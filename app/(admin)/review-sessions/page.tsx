import { auth } from '@clerk/nextjs/server';
import ChatBotSessions from '@/components/ChatBotSessions';
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

  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDocument(item));
  }

  if (typeof doc === 'object') {
    if (isObjectId(doc)) {
      return doc.toString();
    }

    if (doc instanceof Date) {
      return doc.toISOString();
    }

    const serialized: SerializedObject = {};
    for (const [key, value] of Object.entries(doc)) {
      if (value instanceof Date) {
        serialized[key] = value.toISOString();
      } else if (isObjectId(value)) {
        serialized[key] = value.toString();
      } else if (typeof value === 'object' && value !== null) {
        serialized[key] = serializeDocument(value);
      } else {
        serialized[key] = value as SerializedValue;
      }
    }
    return serialized;
  }

  return doc;
}

export default async function ReviewSessions() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    redirect('/sign-in?redirect_url=/review-sessions');
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
      <div className='w-full p-10'>
        <h1 className='text-4xl font-bold mb-2'>Review Chat Sessions</h1>
        <p className='text-gray-500 mb-10'>
          Here you can review all chat sessions for your chatbots
        </p>
        <ChatBotSessions chatbots={sortedChatbots} />
      </div>
    );
  } catch (error: any) {
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      userId: userId,
      stack: error?.stack,
    });
    throw error;
  }
}
