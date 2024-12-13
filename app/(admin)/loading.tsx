import Avatar from '@/components/Avatar';
import React from 'react';

export default function Loading() {
  return (
    <div className='mx-auto animate-spin p-10'>
      <Avatar seed='Chat Bot' className='rounded-full' />
    </div>
  );
}
