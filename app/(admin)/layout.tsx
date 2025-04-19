import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { auth } from '@clerk/nextjs/server';
import React from 'react';
import { redirect } from 'next/navigation';

async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/login');
  }
  return (
    <div className='flex flex-col flex-1'>
      <Header />
      <div className='flex flex-col flex-1 lg:flex-row bg-gray-100'>
        <Sidebar />
        <div className='flex-1 flex justify-center lg:justify-start items-start  '>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
