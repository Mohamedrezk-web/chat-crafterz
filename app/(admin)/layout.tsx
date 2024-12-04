import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import React from 'react';

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col flex-1'>
      <Header />
      <div className='flex flex-col flex-1 lg:flex-row bg-gray-100'>
        <Sidebar />
        <div className='flex-1 flex justify-center lg:justify-start items-start max-w-5xl mx-auto'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
