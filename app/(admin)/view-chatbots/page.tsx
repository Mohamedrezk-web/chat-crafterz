import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { GET_CHATBOTS_BY_USER_ID } from '@/graphql/queiries';
import { serverClient } from '@/lib/server/serverClient';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react';
export const dynamic = 'force-dynamic';

async function ViewChatBots() {
  const { userId } = await auth();
  if (!userId) return;

  const { data } = await serverClient.query({
    query: GET_CHATBOTS_BY_USER_ID,
    variables: { clerk_user_id: userId },
  });

  const res = await serverClient.query({
    query: GET_CHATBOTS_BY_USER_ID,
    variables: { clerk_user_id: userId },
  });

  const sortedChatbots = data
    ? [...data.chatbotsList].sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    : [];
  return (
    <div className='flex-1 pb-20 p-10'>
      <h1 className='text-xl lg:text-3xl font-semibold mb-5 '>
        View Chat Bots
      </h1>
      {sortedChatbots.length === 0 && (
        <div>
          <p>
            You don't have any chat bots yet, Click on the button below to
            create one
          </p>
          <Link href={'/create-chatbot'}>
            <Button className='text-white bg-blue-500 rounded-md mt-5 p-3 '>
              Create Chat Bot
            </Button>
          </Link>
        </div>
      )}
      <ul className='flex flex-col space-y-5'>
        {sortedChatbots.map((chatbot: any) => (
          <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
            <li className='relative p-10 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 max-w-3xl'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center space-x-4'>
                  <Avatar seed={chatbot.name} className='rounded-full' />
                  <h2 className='font-bold'>{chatbot.name}</h2>
                </div>
                <p className='absolute top-5 right-5 text-xs text-gray-400'>
                  created at: {new Date(chatbot.created_at).toDateString()}
                </p>
              </div>

              <hr className='my-5' />

              <div className='grid grid-cols-2 gap-10 md:gap-5 p-5'>
                <h3 className='italic'>Characteristics</h3>

                <ul className='text-sm'>
                  {!chatbot.chatbot_characteristics.length && (
                    <p>No Characteristics</p>
                  )}
                  {chatbot.chatbot_characteristics.map(
                    (characteristic: any) => (
                      <li
                        className='list-disc break-words'
                        key={characteristic.id}
                      >
                        {characteristic.content}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ViewChatBots;
