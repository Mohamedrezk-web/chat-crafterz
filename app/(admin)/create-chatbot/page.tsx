import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

function CreateChatbot() {
  return (
    <div className='flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white rounded-md p-10 m-10'>
      <Avatar seed='Create Chat Bot' className='rounded-full' />
      <div>
        <h1 className='text-xl lg:text-2xl font-semibold'>Create Chat Bot</h1>
        <h2 className='font-light'>
          Create a new chat bot to interact with your customers
        </h2>

        <form className='flex flex-col md:flex-row gap-3 mt-5'>
          <Input
            type='text'
            placeholder='Chat Bot Name...'
            className='max-w-lg'
            required
          />
          <Button>Create Chatbot</Button>
        </form>
      </div>
    </div>
  );
}

export default CreateChatbot;
