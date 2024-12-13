import { BotMessageSquare, PencilIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function Sidebar() {
  return (
    <div className='bg-white text-white p-5'>
      <ul className='flex gap-5 flex-row lg:flex-col'>
        <li className='flex-1'>
          <Link
            className='flex flex-col text-center items-center lg:text-left lg:flex-row gap-2 p-5 rounded-md hover:opacity-50 bg-blue-500'
            href={'/create-chatbot'}
          >
            <BotMessageSquare className='w-6 h-6 lg:w-8 lg:h-8' />
            <div className='hidden md:inline'>
              <p className='text-xl'>Create</p>
              <p className='text-sm font-extralight'>New Chat Bot</p>
            </div>
          </Link>
        </li>
        <li className='flex-1'>
          <Link
            className='flex flex-col text-center items-center lg:text-left lg:flex-row gap-2 p-5 rounded-md hover:opacity-50 bg-blue-500'
            href={'/view-chatbots'}
          >
            <PencilIcon className='w-6 h-6 lg:w-8 lg:h-8' />

            <div className='hidden md:inline'>
              <p className='text-xl'>Edit</p>
              <p className='text-sm font-extralight'>Your chat bots</p>
            </div>
          </Link>
        </li>
        <li className='flex-1'>
          <Link
            className='flex flex-col text-center items-center lg:text-left lg:flex-row gap-2 p-5 rounded-md hover:opacity-50 bg-blue-500'
            href={'/review-sessions'}
          >
            <SearchIcon className='w-6 h-6 lg:w-8 lg:h-8' />
            <div className='hidden md:inline'>
              <p className='text-xl'>View</p>
              <p className='text-sm font-extralight'>Users chat sessions</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
