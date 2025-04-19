import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Chatbot } from '@/models';
import { chatbotSchema } from '@/lib/validations';
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
  console.log('GET /api/chatbots - Request received');
  console.log('Request headers:', Object.fromEntries(request.headers));

  try {
    // Get the auth session
    console.log('Getting auth session...');
    const session = await auth();
    const userId = session?.userId;
    console.log('Auth session userId:', userId);

    if (!userId) {
      console.error('Authentication failed: No userId found');
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'No session found',
          details:
            process.env.NODE_ENV === 'development'
              ? {
                  headers: Object.fromEntries(request.headers),
                  session,
                }
              : undefined,
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    console.log('Connecting to database for user:', userId);
    await connectToDatabase();

    console.log('Fetching chatbots for user:', userId);
    const chatbots = await Chatbot.find({ clerk_user_id: userId })
      .populate('characteristics')
      .sort({ created_at: -1 });

    console.log('Found chatbots:', chatbots.length);
    return successResponse(chatbots);
  } catch (error: any) {
    console.error('API Error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
      cause: error?.cause,
    });

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error?.message || 'An unexpected error occurred',
        details:
          process.env.NODE_ENV === 'development'
            ? {
                stack: error?.stack,
                code: error?.code,
                cause: error?.cause,
                headers: Object.fromEntries(request.headers),
              }
            : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'No session found' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const json = await request.json();
    const validatedData = chatbotSchema.parse({
      ...json,
      clerk_user_id: userId,
    });

    await connectToDatabase();
    const chatbot = await Chatbot.create(validatedData);

    return createdResponse(chatbot);
  } catch (error) {
    return errorResponse(error);
  }
}
