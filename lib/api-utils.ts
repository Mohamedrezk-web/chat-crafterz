import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { MongooseError } from 'mongoose';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

export function successResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      message,
    },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

export function createdResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      message,
    },
    {
      status: 201,
      headers: corsHeaders,
    }
  );
}

export function errorResponse(
  error: unknown,
  status = 500
): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        message: error.errors.map((e) => e.message).join(', '),
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  if (error instanceof MongooseError) {
    return NextResponse.json(
      {
        error: 'Database error',
        message: error.message,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';

  return NextResponse.json(
    {
      error: 'Internal server error',
      message,
    },
    {
      status,
      headers: corsHeaders,
    }
  );
}
