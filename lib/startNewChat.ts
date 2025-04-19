'use server';

import connectToDatabase from '@/lib/mongodb';
import { Guest, ChatSession, Message } from '@/models';
import { Types, Document } from 'mongoose';

interface IChatSession extends Document {
  _id: Types.ObjectId;
  chatbot_id: Types.ObjectId;
  guest_id: Types.ObjectId;
  created_at: Date;
}

interface IGuest extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  created_at: Date;
}

async function startNewChat(
  chatbotId: string,
  guestName: string,
  guestEmail: string
): Promise<{ chatSessionId: string }> {
  try {
    // Ensure database connection
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      throw new Error('Failed to connect to database');
    }

    // Create a new guest for each chat session
    const guest = (await Guest.create({
      name: guestName,
      email: guestEmail,
      created_at: new Date(),
    })) as IGuest;

    // Create chat session
    const chatSession = (await ChatSession.create({
      chatbot_id: new Types.ObjectId(chatbotId),
      guest_id: guest._id,
      created_at: new Date(),
    })) as IChatSession;

    // Create initial AI message
    await Message.create({
      chat_session_id: chatSession._id,
      sender: 'ai',
      content: `Hello! ${guestName} How can I help you today?`,
      created_at: new Date(),
    });

    // Return a plain object with the chat session ID as a string
    return {
      chatSessionId: chatSession._id.toString(),
    };
  } catch (error) {
    console.error('Error starting new chat:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to start chat'
    );
  }
}

export default startNewChat;
