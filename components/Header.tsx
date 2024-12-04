import Link from 'next/link';
import React from 'react';
import Avatar from './Avatar';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

function Header() {
  return (
    <header className='bg-white shadow-sm text-gray-800 flex justify-between p-5'>
      <Link href='/' className='flex gap-2 items-center'>
        <Avatar seed='Chat Bot' className='rounded-full' />
        <div>
          <h1>Chat Crafterz</h1>

          <h2 className='text-sm'>Your Customizable AI Chat Agent</h2>
        </div>
      </Link>

      <div>
        <SignedIn>
          <UserButton showName />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
