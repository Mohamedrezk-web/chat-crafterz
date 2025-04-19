'use client';
import { OctagonX } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

function Characteristic({ characteristic }: { characteristic: any }) {
  const handleRemoveCharacteristic = async () => {
    try {
      const response = await fetch(
        `/api/chatbot-characteristics/${characteristic._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove characteristic');
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <li className='relative p-10 bg-white border border-gray-200 rounded-lg shadow'>
      {characteristic.content}
      <OctagonX
        className='w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50'
        onClick={() => {
          const promise = handleRemoveCharacteristic();
          toast.promise(promise, {
            loading: 'Removing characteristic',
            success: 'Characteristic removed successfully',
            error: 'Error removing characteristic',
          });
        }}
      />
    </li>
  );
}

export default Characteristic;
