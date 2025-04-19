import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Chatbot } from '@/models';
import { chatbotSchema } from '@/lib/validations';
import { successResponse, errorResponse, corsHeaders } from '@/lib/api-utils';
import connectToDatabase from '@/lib/mongodb';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectToDatabase();
    const chatbot = await Chatbot.findById(id).populate('characteristics');

    if (!chatbot) {
      return errorResponse({ message: 'Chatbot not found' }, 404);
    }

    return successResponse(chatbot);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { userId } = await auth();
    if (!userId) {
      return errorResponse({ message: 'Unauthorized' }, 401);
    }

    const json = await request.json();
    const { name } = json;

    await connectToDatabase();
    const chatbot = await Chatbot.findOneAndUpdate(
      {
        _id: id,
        clerk_user_id: userId,
      },
      { name },
      { new: true }
    ).populate('characteristics');

    if (!chatbot) {
      return errorResponse({ message: 'Chatbot not found' }, 404);
    }

    return successResponse(chatbot);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { userId } = await auth();
    if (!userId) {
      return errorResponse({ message: 'Unauthorized' }, 401);
    }

    await connectToDatabase();
    const chatbot = await Chatbot.findOneAndDelete({
      _id: id,
      clerk_user_id: userId,
    });

    if (!chatbot) {
      return errorResponse({ message: 'Chatbot not found' }, 404);
    }

    return successResponse({ message: 'Chatbot deleted successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}
