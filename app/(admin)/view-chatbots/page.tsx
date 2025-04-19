import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Chatbot } from '@/models';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';
export const dynamic = 'force-dynamic';

// Helper function to check if a value is an ObjectId
function isObjectId(value: any): value is { toString(): string } {
  return (
    value &&
    typeof value === 'object' &&
    value.constructor &&
    value.constructor.name === 'ObjectId'
  );
}

type SerializedValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SerializedObject
  | SerializedValue[];
interface SerializedObject {
  [key: string]: SerializedValue;
}

// Helper function to serialize MongoDB documents
function serializeDocument(doc: any): SerializedValue {
  if (!doc) return doc;

  // If it's an array, map over it
  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDocument(item));
  }

  // If it's not an object, return as is
  if (typeof doc !== 'object') {
    return doc;
  }

  const serialized: any = {};

  // Process each field
  for (const [key, value] of Object.entries(doc)) {
    if (isObjectId(value)) {
      // Convert ObjectId to string
      serialized[key] = value.toString();
    } else if (
      (key === 'created_at' || key === 'createdAt' || key === 'updatedAt') &&
      value
    ) {
      // Convert dates to ISO strings
      serialized[key] = new Date(value as string | number | Date).toISOString();
    } else if (typeof value === 'object' && value !== null) {
      // Recursively serialize nested objects
      serialized[key] = serializeDocument(value);
    } else {
      // Keep other values as is
      serialized[key] = value;
    }
  }

  return serialized;
}

async function ViewChatBots() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    redirect('/sign-in?redirect_url=/view-chatbots');
  }

  try {
    console.log('Connecting to database for user:', userId);
    await connectToDatabase();

    console.log('Fetching chatbots directly from database');
    const chatbots = await Chatbot.find({ clerk_user_id: userId }).lean();

    // Fetch characteristics separately and handle model access correctly
    const ChatbotCharacteristic = mongoose.model('ChatbotCharacteristic');
    const populatedChatbots = await Promise.all(
      chatbots.map(async (chatbot) => {
        const characteristics = await ChatbotCharacteristic.find({
          chatbot_id: chatbot._id,
        }).lean();

        // Serialize the entire structure
        return serializeDocument({
          ...chatbot,
          characteristics,
        });
      })
    );

    console.log('Successfully fetched chatbots:', {
      count: populatedChatbots?.length || 0,
    });

    const sortedChatbots = populatedChatbots
      ? [...populatedChatbots].sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      : [];

    return (
      <div className='flex-1 pb-20 p-10'>
        <h1 className='text-xl lg:text-3xl font-semibold mb-5'>
          View Chat Bots
        </h1>
        {sortedChatbots.length === 0 && (
          <div>
            <p>
              You don't have any chat bots yet, Click on the button below to
              create one
            </p>
            <Link href={'/create-chatbot'}>
              <Button className='text-white bg-blue-500 rounded-md mt-5 p-3'>
                Create Chat Bot
              </Button>
            </Link>
          </div>
        )}
        <ul className='flex flex-col space-y-5'>
          {sortedChatbots.map((chatbot: any) => (
            <Link key={chatbot._id} href={`/edit-chatbot/${chatbot._id}`}>
              <li className='relative p-10 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 max-w-3xl'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center space-x-4'>
                    <Avatar seed={chatbot.name} className='rounded-full' />
                    <h2 className='font-bold'>{chatbot.name}</h2>
                  </div>
                  <p className='absolute top-5 right-5 text-xs text-gray-400'>
                    created at: {new Date(chatbot.created_at).toDateString()}
                  </p>
                </div>

                <hr className='my-5' />

                <div className='grid grid-cols-2 gap-10 md:gap-5 p-5'>
                  <h3 className='italic'>Characteristics</h3>

                  <ul className='text-sm'>
                    {!chatbot.characteristics?.length && (
                      <p>No Characteristics</p>
                    )}
                    {chatbot.characteristics?.map((characteristic: any) => (
                      <li
                        className='list-disc break-words'
                        key={characteristic._id}
                      >
                        {characteristic.content}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
  } catch (error: any) {
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      userId: userId,
      stack: error?.stack,
    });
    return (
      <div className='flex-1 pb-20 p-10'>
        <h1 className='text-xl lg:text-3xl font-semibold mb-5 text-red-500'>
          Error Loading Chatbots
        </h1>
        <p>Failed to load your chatbots. Please try again later.</p>
        <Link href={'/create-chatbot'}>
          <Button className='text-white bg-blue-500 rounded-md mt-5 p-3'>
            Create New Chat Bot
          </Button>
        </Link>
      </div>
    );
  }
}

export default ViewChatBots;
