'use client';

import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGE_BY_CHAT_SESSION_ID,
} from '@/graphql/queiries';
import startNewChat from '@/lib/startNewChat';
import { useQuery } from '@apollo/client';
import { Bomb, CloudLightningIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

function ChatBotPage({ params }: { params: Promise<{ id: string }> }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setUnwrappedParams(resolvedParams);
      //   setChatId(resolvedParams.id);
    }
    unwrapParams();
  }, [params]);

  const { data: chatBot } = useQuery(GET_CHATBOT_BY_ID, {
    variables: {
      id: unwrappedParams?.id,
    },
  });
  const { data } = useQuery(GET_MESSAGE_BY_CHAT_SESSION_ID, {
    variables: {
      id: chatId,
    },
    skip: !chatId,
  });

  useEffect(() => {
    if (!data) return;
    setMessages(data.messagesUsingMessages_chat_session_id_fkey);
  }, [data]);

  if (!unwrappedParams) {
    return <p>Loading...</p>;
  }

  const handleInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIsOpen(false);

    const chatId = await startNewChat(unwrappedParams.id, name, email);
    setChatId(chatId);
  };

  return (
    <div className='w-full flex bg-gray-100'>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-[26rem]'>
          <form onSubmit={handleInfoSubmit}>
            <DialogHeader>
              <DialogTitle>Chat with {name}</DialogTitle>
              <DialogDescription>
                Enter your name and email to start a conversation with the chat
                bot.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='email' className='text-right'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='col-span-3'
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit' disabled={!name || !email || loading}>
                {loading ? 'Loading' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
          {loading && <p>Loading...</p>}
          {messages.length > 0 && (
            <div>
              {messages.map((message: any) => (
                <p key={message.id}>{message.content}</p>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div>
        <div className='W-full pb-4 border-b top-0 z-50 bg-blue-500 py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4'>
          <Avatar seed={chatBot?.chatbots?.name} className='rounded-full' />
          <div>
            <h1 className='truncate text-lg font-semibold'>
              Chat with {chatBot?.chatbots?.name}
            </h1>
            <p className='flex gap-1'>
              <CloudLightningIcon className='w-6 h-6' />
              typically replies instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBotPage;
