import { SignIn } from '@clerk/nextjs';
import React from 'react';

export default function LoginPage() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <SignIn routing='hash' fallbackRedirectUrl={'/'} />
    </div>
  );
}
