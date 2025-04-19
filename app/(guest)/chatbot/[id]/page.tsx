'use client';

import Avatar from '@/components/Avatar';
import Messages from '@/components/Messages';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import startNewChat from '@/lib/startNewChat';
import { useUser } from '@clerk/nextjs';
import { CloudLightningIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

const formSchema = z.object({
  message: z.string().min(2, 'Message must be at least 2 characters long'),
});

function ChatBotPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatBot, setChatBot] = useState<any>(null);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setUnwrappedParams(resolvedParams);
    }
    unwrapParams();
  }, [params]);

  // Fetch chatbot data
  useEffect(() => {
    async function fetchChatbot() {
      if (!unwrappedParams?.id) return;
      try {
        const response = await fetch(`/api/chatbots/${unwrappedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chatbot');
        }
        const { data } = await response.json();
        setChatBot(data);
      } catch (error) {
        console.error('Error fetching chatbot:', error);
      }
    }
    fetchChatbot();
  }, [unwrappedParams?.id]);

  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      if (!chatId) return;
      try {
        const response = await fetch(`/api/messages?chatSessionId=${chatId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const { data } = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
    fetchMessages();
  }, [chatId]);

  if (!unwrappedParams) {
    return <p>Loading...</p>;
  }

  const handleInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIsOpen(false);

    try {
      const { chatSessionId } = await startNewChat(
        unwrappedParams.id,
        name,
        email
      );
      setChatId(chatSessionId);
    } catch (error) {
      console.error('Error starting chat:', error);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { message: formMessage } = values;

    const message = formMessage;

    form.reset();
    if (!name || !email) {
      setIsOpen(true);
      setLoading(false);
      return;
    }

    if (!message.trim()) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      content: message,
      created_at: new Date().toISOString(),
      sender: 'user',
      chat_session_id: chatId,
    };

    const loadingMessage = {
      id: Date.now() + 1,
      content: 'Cooking...',
      created_at: new Date().toISOString(),
      sender: 'ai',
      chat_session_id: chatId,
    };

    setMessages(
      (messages) => [...messages, userMessage, loadingMessage] as any
    );

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          chat_session_id: chatId,
          chatbot_id: unwrappedParams?.id,
          content: message,
        }),
      });

      const result = await response.json();

      setMessages(
        (prevMessages) =>
          prevMessages.map((message: any) => {
            if (message['id'] === loadingMessage.id) {
              return {
                ...message,
                content: result.content,
                id: result.id,
              } as any;
            }
            return message as any;
          }) as any
      );
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full flex bg-gray-100  h-screen justify-center'>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-[26rem]'>
          <form onSubmit={handleInfoSubmit}>
            <DialogHeader>
              <DialogTitle>Chat with {chatBot?.name}</DialogTitle>
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
      <div className='w-full flex flex-col md:max-w-3xl'>
        <div className='W-full pb-4 border-b top-0 z-50 bg-blue-500 py-5 px-10 text-white  flex items-center space-x-4'>
          <Avatar seed={chatBot?.name} className='rounded-full' />
          <div>
            <h1 className='truncate text-lg font-semibold'>
              Chat with {chatBot?.name}
            </h1>
            <p className='flex gap-1'>
              <CloudLightningIcon className='w-6 h-6' />
              typically replies instantly
            </p>
          </div>
        </div>
        <Messages messages={messages} chatBotName={name} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex items-start gap-2 lg:gap-4 w-full sticky bottom-0 z-50 bg-gray-100 p-5  drop-shadow-lg'
          >
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Type a message'
                      className='border-none bg-gray-100'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type='submit'
              size='sm'
              disabled={loading}
              className='bg-blue-500'
            >
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatBotPage;
