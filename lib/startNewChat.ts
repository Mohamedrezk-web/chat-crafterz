import client from '@/graphql/apolloClient';
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from '@/graphql/mutations';

async function startNewChat(
  chatbotId: string,
  guestName: string,
  guestEmail: string
) {
  try {
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: {
        name: guestName,
        email: guestEmail,
        created_at: new Date().toISOString(),
      },
    });
    const guestId = guestResult.data.insertGuests.id;

    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        chatbot_id: chatbotId,
        guest_id: guestId,
        created_at: new Date().toISOString(),
      },
    });

    const chatSessionId = chatSessionResult.data.insertChat_sessions?.id;

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: 'ai',
        content: `Hello! ${guestName} How can I help you today?`,
        created_at: new Date().toISOString(),
      },
    });

    return chatSessionId;
  } catch (error) {
    console.error(error);
  }
}

export default startNewChat;
