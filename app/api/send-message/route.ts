import { INSERT_MESSAGE } from '@/graphql/mutations';
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGE_BY_CHAT_SESSION_ID,
} from '@/graphql/queiries';
import { serverClient } from '@/lib/server/serverClient';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function POST(request: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await request.json();

  try {
    const { data } = await serverClient.query({
      query: GET_CHATBOT_BY_ID,
      variables: {
        id: chatbot_id,
      },
    });

    const chatbot = data.chatbots;

    if (!chatbot) {
      return NextResponse.json('Chatbot not found', { status: 404 });
    }

    const { data: messagesData } = await serverClient.query({
      query: GET_MESSAGE_BY_CHAT_SESSION_ID,
      variables: {
        id: chat_session_id,
      },
      fetchPolicy: 'no-cache',
    });

    const previousMessages =
      messagesData.messagesUsingMessages_chat_session_id_fkey;

    const formattedMessages = previousMessages.map((message: any) => ({
      role: message.sender === 'user' ? 'user' : 'system',
      name: message.sender === 'user' ? name : 'system',
      content: message.content,
    }));

    const systemPrompt = chatbot.chatbot_characteristics
      .map((characteristic: any) => characteristic.content)
      .join(' + ');

    const messages: ChatCompletionMessage[] = [
      {
        role: 'system',
        name: 'system',
        content: `
            you are a helpful assistant talking to ${name}.
            if a generic question is asked which is not relevant or in the same scope or domain as the points mentioned in the key information section, 
            kindly inform the user they are only allowed to search for the specified content.
            use emojis to make the conversation more engaging.
            here are some key information that you need to be aware of, these are elements you maybe asked about: ${systemPrompt}
            `,
      },
      ...formattedMessages,
      {
        role: 'user',
        name: name.replace(/[^a-zA-Z0-9_-]/g, ''),
        content: content,
      },
    ];

    console.log('messages', messages);

    const openAiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    console.log('openai response', openAiResponse);

    const aiResponse = openAiResponse?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      return NextResponse.json('Failed to send message', { status: 500 });
    }

    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content,
        sender: 'user',
        created_at: new Date().toISOString(),
      },
    });

    const aiMessageResults = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content: aiResponse,
        sender: 'ai',
        created_at: new Date().toISOString(),
      },
    });
    return NextResponse.json(
      { id: aiMessageResults.data.insertMessages.id, content: aiResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json('Failed to send message', { status: 500 });
  }
}
