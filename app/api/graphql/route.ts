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

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
