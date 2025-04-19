import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ChatbotCharacteristic, Chatbot } from '@/models';
import { chatbotCharacteristicSchema } from '@/lib/validations';
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
    const { userId } = await auth();
    if (!userId) {
      return errorResponse({ message: 'Unauthorized' }, 401);
    }

    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbotId');

    if (!chatbotId) {
      return errorResponse({ message: 'Chatbot ID is required' }, 400);
    }

    await connectToDatabase();

    // Verify chatbot ownership
    const chatbot = await Chatbot.findOne({
      _id: chatbotId,
      clerk_user_id: userId,
    });

    if (!chatbot) {
      return errorResponse({ message: 'Chatbot not found' }, 404);
    }

    const characteristics = await ChatbotCharacteristic.find({
      chatbot_id: chatbotId,
    }).populate('chatbot');

    return successResponse(characteristics);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse({ message: 'Unauthorized' }, 401);
    }

    const json = await request.json();
    const body = chatbotCharacteristicSchema.parse(json);

    await connectToDatabase();

    // Verify chatbot ownership
    const chatbot = await Chatbot.findOne({
      _id: body.chatbot_id,
      clerk_user_id: userId,
    });

    if (!chatbot) {
      return errorResponse({ message: 'Chatbot not found' }, 404);
    }

    const characteristic = await ChatbotCharacteristic.create(body);
    await characteristic.populate('chatbot');

    return createdResponse(characteristic);
  } catch (error) {
    return errorResponse(error);
  }
}
