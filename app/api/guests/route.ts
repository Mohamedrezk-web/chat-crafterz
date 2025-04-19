import { NextRequest } from 'next/server';
import { Guest } from '@/models';
import { guestSchema } from '@/lib/validations';
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
    const email = searchParams.get('email');

    await connectToDatabase();

    if (email) {
      const guest = await Guest.findOne({ email });
      return successResponse(guest);
    }

    const guests = await Guest.find().sort({ created_at: -1 });
    return successResponse(guests);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const body = guestSchema.parse(json);

    await connectToDatabase();

    // Check if guest already exists
    const existingGuest = await Guest.findOne({ email: body.email });
    if (existingGuest) {
      return successResponse(existingGuest);
    }

    const guest = await Guest.create(body);
    return createdResponse(guest);
  } catch (error) {
    return errorResponse(error);
  }
}
