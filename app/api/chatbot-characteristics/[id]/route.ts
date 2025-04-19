import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ChatbotCharacteristic, Chatbot } from '@/models';
import { errorResponse, successResponse, corsHeaders } from '@/lib/api-utils';
import connectToDatabase from '@/lib/mongodb';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
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

    // Find the characteristic first to get the chatbot_id
    const characteristic = await ChatbotCharacteristic.findById(id);
    if (!characteristic) {
      return errorResponse({ message: 'Characteristic not found' }, 404);
    }

    // Verify chatbot ownership
    const chatbot = await Chatbot.findOne({
      _id: characteristic.chatbot_id,
      clerk_user_id: userId,
    });

    if (!chatbot) {
      return errorResponse({ message: 'Chatbot not found' }, 404);
    }

    // Delete the characteristic
    await ChatbotCharacteristic.findByIdAndDelete(id);

    return successResponse({ message: 'Characteristic deleted successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}
