'use client';
import { REMOVE_CHARACTERISTIC } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { OctagonX } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

function Characteristic({ characteristic }: { characteristic: any }) {
  const handleRemoveCharacteristic = async () => {
    try {
      await removeCharacteristic({
        variables: {
          id: characteristic.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ['GetChatBotById'],
  });
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
