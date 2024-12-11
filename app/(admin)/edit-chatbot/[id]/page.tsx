'use client';
import Avatar from '@/components/Avatar';
import Characteristic from '@/components/Characteristic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BASE_URL } from '@/graphql/apolloClient';
import { GET_CHATBOT_BY_ID } from '@/graphql/queiries';
import { useQuery } from '@apollo/client';
import { Copy } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function EditChatBot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // Unwrap the promise
  const [url, setUrl] = useState('');
  const [chatBotName, setChatBotName] = useState('');
  const [newCharacteristic, setNewCharacteristic] = useState('');

  const { data, loading, error } = useQuery(GET_CHATBOT_BY_ID, {
    variables: {
      id: parseInt(id),
    },
  });

  const handelUpdateChatBot = () => {};

  useEffect(() => {
    if (data) {
      setChatBotName(data.chatbots?.name);
    }
  }, [data]);

  useEffect(() => {
    const generatedUrl = `${BASE_URL}/chatbot/${id}`;
    setUrl(generatedUrl);
  }, [id]);

  return (
    <div className='px-0 md:p-10'>
      <div className='md:sticky top-0 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-blue-500'>
        <h2 className='text-white text-sm font-bold'>Link To Chat</h2>
        <p className='text-sm italic text-white'>
          Share this link with your customers to start a conversation with your
          chat bot
        </p>
        <div className='flex items-center space-x-2'>
          <Link
            href={url}
            target='_blank'
            className='w-full cursor-pointer hover:opacity-50'
          >
            <Input
              value={url}
              readOnly
              className='cursor-pointer bg-white'
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success('Copied to clipboard');
              }}
            />
          </Link>
          <Button size={'sm'} className='px-3'>
            <span className='sr-only'>Copy</span>
            <Copy className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <section className='relative bg-white p-5 md:p-10 rounded-lg'>
        <Button
          variant={'destructive'}
          className=' absolute top-2 right-2 h-8 w-2'
        >
          X
        </Button>
        <div className='flex space-x-4'>
          <Avatar seed={chatBotName} />
          <form
            onSubmit={handelUpdateChatBot}
            className='flex flex-1 space-x-2 items-center'
          >
            <Input
              placeholder={chatBotName}
              value={chatBotName}
              className='w-full border-none bg-transparent text-xl font-bold'
              onChange={(e) => setChatBotName(e.target.value)}
            />
            <Button disabled={!chatBotName}>update</Button>
          </form>
        </div>
        <h2 className='text-xl font-bold mt-10'>
          Here is what your AI knows...
        </h2>
        <p>
          Your chatbot is equipped with the following information to assist you
          in your conversation with your customers.
        </p>
        <div>
          <form className='flex space-x-2 mt-10'>
            <Input
              type='text'
              placeholder='Example: If customer asks for a price provide pricing page: https://www.youtube.com/watch?v=E-jxfIM7GU4'
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
            />
            <Button type='submit' disabled={!newCharacteristic}>
              Add Characteristic
            </Button>
          </form>
          <ul className='flex flex-wrap-reverse gap-5'>
            {data?.chatbots?.chatbot_characteristics?.map(
              (characteristic: any) => (
                <Characteristic
                  characteristic={characteristic}
                  key={characteristic.id}
                />
              )
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EditChatBot;
