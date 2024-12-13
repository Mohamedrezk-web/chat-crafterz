import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='p-10 m-10 bg-white rounded-md w-full'>
      <h1 className='text-3xl font-light'>
        Welcome to{' '}
        <span className='font-bold text-blue-500'>Chat Crafterz</span>
      </h1>
      <h2>
        Your Customizable AI Chat Agent that helps you manage your customers
        conversations.
      </h2>

      <Link href={'/create-chatbot'} className='flex gap-2 items-center mt-10'>
        <Button className='bg-blue-500 hover:bg-blue-600'>
          Create your Customizable Chat Bot
        </Button>
      </Link>
    </main>
  );
}
