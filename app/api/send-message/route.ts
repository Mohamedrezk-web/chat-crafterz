import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';
import { Message, ChatSession, Chatbot, ChatbotCharacteristic } from '@/models';
import connectToDatabase from '@/lib/mongodb';
import { Types } from 'mongoose';

interface IChatbotCharacteristic {
  content: string;
}

interface IChatbot {
  characteristics: IChatbotCharacteristic[];
}

type Role = 'system' | 'user' | 'assistant';

interface ChatMessage {
  role: Role;
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await request.json();

  try {
    // Connect to database
    await connectToDatabase();

    // Find chatbot and its characteristics
    const chatbot = (await Chatbot.findById(chatbot_id).populate(
      'characteristics'
    )) as unknown as IChatbot;

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Get previous messages
    const previousMessages = await Message.find({
      chat_session_id: new Types.ObjectId(chat_session_id),
    }).sort({ created_at: 1 });

    const formattedMessages: ChatMessage[] = previousMessages.map(
      (message) => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.content,
      })
    );

    const systemPrompt = chatbot.characteristics
      .map((characteristic) => characteristic.content)
      .join(' + ');

    const messages: ChatMessage[] = [
      {
        role: 'system',
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
        content: content,
      },
    ];

    const openAiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as ChatCompletionMessage[],
    });

    const aiResponse = openAiResponse?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      );
    }

    // Save user message
    await Message.create({
      chat_session_id: new Types.ObjectId(chat_session_id),
      content,
      sender: 'user',
      created_at: new Date(),
    });

    // Save AI message
    const aiMessage = await Message.create({
      chat_session_id: new Types.ObjectId(chat_session_id),
      content: aiResponse,
      sender: 'ai',
      created_at: new Date(),
    });

    return NextResponse.json(
      { id: (aiMessage as any)._id.toString(), content: aiResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in send-message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
