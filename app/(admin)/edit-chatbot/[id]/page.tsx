'use client';
import Avatar from '@/components/Avatar';
import Characteristic from '@/components/Characteristic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function EditChatBot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // Unwrap the promise
  const [url, setUrl] = useState('');
  const [chatBotName, setChatBotName] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatbot, setChatbot] = useState<any>(null);
  const [newCharacteristic, setNewCharacteristic] = useState('');

  // Fetch chatbot data
  const fetchChatbot = async () => {
    try {
      const response = await fetch(`/api/chatbots/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chatbot');
      }
      const { data } = await response.json();
      setChatbot(data);
      setChatBotName(data.name);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch chatbot');
      setLoading(false);
    }
  };

  // Update chatbot name
  const handleUpdateChatBot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const promise = fetch(`/api/chatbots/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: chatBotName }),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to update chatbot');
      }
      const { data } = await response.json();
      setChatbot(data);
    });

    toast.promise(promise, {
      loading: 'Updating chatbot',
      success: 'Chatbot updated successfully',
      error: 'Failed to update chatbot',
    });
  };

  // Add characteristic
  const handleAddCharacteristic = async (content: string) => {
    const promise = fetch('/api/chatbot-characteristics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatbot_id: id,
        content,
      }),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to add characteristic');
      }
      await fetchChatbot(); // Refresh chatbot data
    });

    toast.promise(promise, {
      loading: 'Adding characteristic',
      success: 'Characteristic added successfully',
      error: 'Failed to add characteristic',
    });
  };

  // Delete chatbot
  const handleDeleteChatBot = async () => {
    const isConfirmed = confirm(
      'Are you sure you want to delete this chatbot?'
    );

    if (!isConfirmed) {
      return;
    }

    const promise = fetch(`/api/chatbots/${id}`, {
      method: 'DELETE',
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete chatbot');
      }
      window.location.href = '/view-chatbots';
      return 'Chatbot deleted successfully';
    });

    toast.promise(promise, {
      loading: 'Deleting chatbot',
      success: 'Chatbot deleted successfully',
      error: (err) => err.message || 'Failed to delete chatbot',
    });
  };

  useEffect(() => {
    fetchChatbot();
  }, [id]);

  useEffect(() => {
    const generatedUrl = `${process.env.NEXT_PUBLIC_APP_URL}/chatbot/${id}`;
    setUrl(generatedUrl);
  }, [id]);

  if (loading) {
    return (
      <div className='mx-auto animate-spin p-10'>
        <Avatar seed='Chat Bot' className='rounded-full' />
      </div>
    );
  }

  if (!chatbot) return redirect('/view-chatbots');

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
          className='absolute top-2 right-2 h-8 w-2'
          onClick={handleDeleteChatBot}
        >
          X
        </Button>
        <div className='flex space-x-4'>
          <Avatar seed={chatBotName} />
          <form
            onSubmit={handleUpdateChatBot}
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
        <div className='bg-gray-100 p-5 rounded rounded-lg mt-10'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCharacteristic(newCharacteristic);
              setNewCharacteristic('');
            }}
            className='flex space-x-2'
          >
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
          <ul className='flex flex-wrap-reverse gap-5 mt-5'>
            {chatbot?.characteristics?.map((characteristic: any) => (
              <Characteristic
                characteristic={characteristic}
                key={characteristic._id}
              />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EditChatBot;
