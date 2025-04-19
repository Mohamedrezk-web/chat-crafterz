import { NextRequest } from 'next/server';
import { Message, ChatSession } from '@/models';
import { messageSchema } from '@/lib/validations';
import {
  successResponse,
  createdResponse,
  errorResponse,
  corsHeaders,
} from '@/lib/api-utils';
import connectToDatabase from '@/lib/mongodb';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatSessionId = searchParams.get('chatSessionId');

    if (!chatSessionId) {
      return errorResponse({ message: 'Chat session ID is required' }, 400);
    }

    await connectToDatabase();

    // Get messages for the chat session
    const messages = await Message.find({
      chat_session_id: chatSessionId,
    }).sort({ created_at: 1 });

    return successResponse(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const body = messageSchema.parse(json);

    await connectToDatabase();

    // Verify chat session exists
    const chatSession = await ChatSession.findById(body.chat_session_id);
    if (!chatSession) {
      return errorResponse({ message: 'Chat session not found' }, 404);
    }

    const message = await Message.create(body);
    return createdResponse(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return errorResponse(error);
  }
}
