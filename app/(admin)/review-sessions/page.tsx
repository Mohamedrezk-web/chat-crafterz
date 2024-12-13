import ChatBotSessions from '@/components/ChatBotSessions';
import { GET_USER_CHATBOTS } from '@/graphql/queiries';
import { serverClient } from '@/lib/server/serverClient';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

async function ReviewSessions() {
  const { userId } = await auth();
  if (!userId) return;
  const { data } = await serverClient.query({
    query: GET_USER_CHATBOTS,
    variables: { clerk_user_id: userId },
  });

  const sortedChatbots = data?.chatbotsList
    ? [...data?.chatbotsList].sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    : [];

  return (
    <div className='flex-1 pb-20 p-10'>
      <h1 className='text-xl lg:text-3xl font-semibold mb-5 '>
        Review Chat Sessions
      </h1>
      <h2 className='mb-5'>
        Review All Chat Sessions the Chat Bots have had with your customers
      </h2>
      <ChatBotSessions chatbots={sortedChatbots}></ChatBotSessions>
    </div>
  );
}

export default ReviewSessions;
