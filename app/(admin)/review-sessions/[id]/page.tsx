import Messages from '@/components/Messages';
import connectToDatabase from '@/lib/mongodb';
import { ChatSession } from '@/models';
import { Types } from 'mongoose';
import React from 'react';

// Use the correct props type
type Props = {
  params: {
    id: string;
  };
};

interface IChatbot {
  _id: Types.ObjectId;
  name: string;
}

interface IGuest {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

interface IMessage {
  _id: Types.ObjectId;
  content: string;
  sender: string;
}

interface PopulatedChatSession {
  _id: Types.ObjectId;
  messages: IMessage[];
  created_at: Date;
  chatbot: IChatbot;
  guest: IGuest;
}

export const dynamic = 'force-dynamic';

async function ReviewSession({ params }: Props) {
  const { id } = params;

  await connectToDatabase();

  const chatSessionDoc = await ChatSession.findById(id)
    .populate('chatbot')
    .populate('guest')
    .populate('messages');

  if (!chatSessionDoc) {
    throw new Error('Chat session not found');
  }

  // Serialize the MongoDB document to a plain JavaScript object
  const chatSession = JSON.parse(
    JSON.stringify(chatSessionDoc)
  ) as PopulatedChatSession;

  const { messages, created_at, chatbot, guest } = chatSession;

  return (
    <div className='flex-1 p-10 pb-24'>
      <h1 className='text-xl lg:text-3xl font-semibold'>Session Review</h1>
      <p>Started at {new Date(created_at).toLocaleString()}</p>
      <h2 className='font-light mt-2'>
        Between {chatbot.name} &{' '}
        <span className='font-extrabold'>
          {guest.name} ({guest.email})
        </span>
      </h2>
      <hr className='my-10' />
      <Messages
        messages={messages}
        chatSessionId={chatSession._id.toString()}
        chatBotName={chatbot.name}
        guestName={guest.name}
      />
    </div>
  );
}

export default ReviewSession;
