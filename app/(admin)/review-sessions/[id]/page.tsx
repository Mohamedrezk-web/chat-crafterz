import Messages from '@/components/Messages';
import { GET_CHAT_SESSIONS_MESSAGES } from '@/graphql/queiries';
import { serverClient } from '@/lib/server/serverClient';
import React from 'react';

// Use the correct props type
type Props = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

async function ReviewSession({ params }: any) {
  console.log(typeof params); // To check if it's inferred correctly

  const { id } = params;

  const {
    data: {
      chat_sessions: {
        id: chatSessionId,
        messages,
        created_at,
        chatbots: { name },
        guests: { name: guestName, email },
      },
    },
  } = await serverClient.query({
    query: GET_CHAT_SESSIONS_MESSAGES,
    variables: { id: parseInt(id, 10) }, // Ensure ID is parsed as an integer
  });

  return (
    <div className='flex-1 p-10 pb-24'>
      <h1 className='text-xl lg:text-3xl font-semibold'>Session Review</h1>
      <p>Started at {new Date(created_at).toLocaleString()}</p>
      <h2 className='font-light mt-2'>
        Between {name} &{' '}
        <span className='font-extrabold'>
          {guestName} ({email})
        </span>
      </h2>
      <hr className='my-10' />
      <Messages
        messages={messages}
        chatSessionId={chatSessionId}
        chatBotName={name}
        guestName={guestName}
      />
    </div>
  );
}

export default ReviewSession;
