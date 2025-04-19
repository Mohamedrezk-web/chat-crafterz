'use client';

import { usePathname } from 'next/navigation';
import React, { use, useEffect, useRef } from 'react';
import Avatar from './Avatar';
import { UserCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Messages({ messages, chatBotName }: any) {
  const path = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  const isReviewSession = path?.includes('/review-sessions');

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <div className='flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white '>
      {messages.map((message: any) => {
        const isSender = message.sender !== 'user';
        return (
          <div
            key={message.id}
            className={`relative chat ${isSender ? 'chat-start' : 'chat-end'}`}
          >
            {isReviewSession && (
              <p className='absolute -bottom-5 text-xs text-gray-400'>
                sent {new Date(message.created_at).toLocaleString()}
              </p>
            )}
            <div className={`chat-image avatar w-10 ${!isSender && ''}`}>
              {isSender ? (
                <Avatar seed={chatBotName} />
              ) : (
                <UserCircle className='text-primary-500' />
              )}
            </div>
            <div
              className={`chat-bubble text-white ${
                isSender
                  ? 'chat-bubble-primary bg-primary-500'
                  : 'chat-bubble-secondary bg-gray-200 text-gray-700'
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className={`break-words`}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}

      <div ref={ref} />
    </div>
  );
}

export default Messages;
