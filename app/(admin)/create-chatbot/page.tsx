'use client';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CREATE_CHATBOT } from '@/graphql/mutations';
import { gql, useMutation } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function CreateChatbot() {
  const { user } = useUser();
  const router = useRouter();
  const [name, setName] = useState('');
  const [addNewChatBot, { data, loading, error }] = useMutation(
    CREATE_CHATBOT,
    {
      variables: {
        clerk_user_id: user?.id,
        name,
        created_at: `${new Date().toISOString()}`,
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await addNewChatBot();
      setName('');
      router.push(`/edit-chatbot/${data.data.insertChatbots.id}`);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white rounded-md p-10 m-10'>
      <Avatar seed='Create Chat Bot' className='rounded-full' />
      <div>
        <h1 className='text-xl lg:text-2xl font-semibold'>Create Chat Bot</h1>
        <h2 className='font-light'>
          Create a new chat bot to interact with your customers
        </h2>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col md:flex-row gap-3 mt-5'
        >
          <Input
            type='text'
            placeholder='Chat Bot Name...'
            className='max-w-lg'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button disabled={loading || !name}>
            {loading ? 'Creating' : 'Create'} Chatbot
          </Button>
        </form>
        <p className='text-gray-300 mt-5'>example: Customer Support Bot</p>
      </div>
    </div>
  );
}

export default CreateChatbot;
