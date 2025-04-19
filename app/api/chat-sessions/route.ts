import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs';
import { ChatSession, Chatbot } from '@/models';
import { chatSessionSchema } from '@/lib/validations';
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
    const { userId } = auth();
    if (!userId) {
      return errorResponse({ message: 'Unauthorized' }, 401);
    }

    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbotId');
    const guestId = searchParams.get('guestId');

    await connectToDatabase();

    // If chatbotId is provided, verify ownership
    if (chatbotId) {
      const chatbot = await Chatbot.findOne({
        _id: chatbotId,
        clerk_user_id: userId,
      });

      if (!chatbot) {
        return errorResponse({ message: 'Chatbot not found' }, 404);
      }
    }

    const query: any = {};
    if (chatbotId) query.chatbot_id = chatbotId;
    if (guestId) query.guest_id = guestId;

    const chatSessions = await ChatSession.find(query)
      .populate('chatbot')
      .populate('guest')
      .populate('messages')
      .sort({ created_at: -1 });

    return successResponse(chatSessions);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return errorResponse({ message: 'Unauthorized' }, 401);
    }

    const json = await request.json();
    const body = chatSessionSchema.parse(json);

    await connectToDatabase();

    // Verify chatbot ownership
    const chatbot = await Chatbot.findOne({
      _id: body.chatbot_id,
      clerk_user_id: userId,
    });

    if (!chatbot) {
      return errorResponse({ message: 'Chatbot not found' }, 404);
    }

    const chatSession = await ChatSession.create(body);
    await chatSession.populate(['chatbot', 'guest']);

    return createdResponse(chatSession);
  } catch (error) {
    return errorResponse(error);
  }
}
