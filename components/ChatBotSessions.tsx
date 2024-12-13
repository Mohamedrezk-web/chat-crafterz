'use client';

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Avatar from './Avatar';
import Link from 'next/link';
import TimeAgo from 'react-timeago';

function ChatBotSessions({ chatbots }: any) {
  const [sortedChatbots, setSortedChatbots] = useState(chatbots);

  useEffect(() => {
    setSortedChatbots(
      chatbots.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    );
  }, [chatbots]);
  return (
    <div className='bg-white '>
      <Accordion type='single' collapsible>
        {sortedChatbots.map((chatbot: any) => {
          const hasSessions = chatbot.chat_sessions.length > 0;

          return (
            <AccordionItem
              key={chatbot.id}
              value={`item-${chatbot.id.toString()}`}
              className='px-10 py-5'
            >
              {hasSessions ? (
                <>
                  <AccordionTrigger>
                    <div className='flex text-left items-center w-full'>
                      <Avatar
                        seed={chatbot.name}
                        className='rounded-full mr-4'
                      />
                      <div className='flex flex-1 justify-between space-x-4'>
                        <p>{chatbot.name}</p>
                        <p className='pr-4 font-bold text-right'>
                          {chatbot.chat_sessions.length} sessions
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='space-y-5 p-5 bg-gray-100 rounded-md'>
                    {chatbot.chat_sessions.map((session: any) => (
                      <Link
                        href={`/review-sessions/${session.id}`}
                        key={session.id}
                        className='relative p-10 bg-blue-500 text-white rounded-md block'
                      >
                        <p className='text-lg font-bold'>
                          {session.guests?.name || 'Anonymous'}
                        </p>
                        <p className='text-sm font-light'>
                          {session.guests?.email || 'No email provided'}
                        </p>
                        <p className='absolute top-5 right-5 text-sm'>
                          <TimeAgo date={session.created_at} locale='en-US' />
                        </p>
                      </Link>
                    ))}
                  </AccordionContent>
                </>
              ) : (
                <div className='flex text-left items-center w-full'>
                  <Avatar seed={chatbot.name} className='rounded-full mr-4' />
                  <div className='flex flex-1 justify-between space-x-4'>
                    <p>{chatbot.name}</p>
                    <p className='pr-4 font-bold text-right'>has no sessions</p>
                  </div>
                </div>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default ChatBotSessions;
