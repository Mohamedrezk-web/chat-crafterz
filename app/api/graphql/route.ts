import { serverClient } from '@/lib/server/serverClient';
import { gql } from '@apollo/client';
import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.NEXT_PUBLIC_APP_URL || 'https://chat-crafterz.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Apollo-Require-Preflight',
};

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();

  // Log environment variables (excluding sensitive data)
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    HAS_GRAPHQL_TOKEN: process.env.GRAPHQL_TOKEN?.toString().slice(0, 15),
    HAS_GRAPHQL_ENDPOINT:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.toString().slice(0, 15),
  });

  try {
    let result;
    if (query.trim().startsWith('mutation')) {
      result = await serverClient.mutate({
        mutation: gql`
          ${query}
        `,
        variables,
      });
    } else {
      result = await serverClient.query({
        query: gql`
          ${query}
        `,
        variables,
      });
    }

    const data = result.data;

    return NextResponse.json(
      { data },
      {
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    // Enhanced error logging
    console.error('GraphQL Error Details:', {
      message: error.message,
      networkError: error.networkError?.message,
      graphQLErrors: error.graphQLErrors,
      stack: error.stack,
      name: error.name,
    });

    // Check if it's an authentication error
    if (
      error.message?.includes('401') ||
      error.message?.includes('unauthorized')
    ) {
      return NextResponse.json(
        {
          error: 'Authentication failed. Please check your API credentials.',
          details: {
            message: error.message,
            networkError: error.networkError?.message,
          },
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        details: {
          message: error.message,
          networkError: error.networkError?.message,
        },
      },
      {
        status: error.statusCode || 500,
        headers: corsHeaders,
      }
    );
  }
}
