import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { type TApiCall } from '@/types/api-call';

const JWT_SECRET = process.env.JWT_SECRET;

type TMeBody = {
  authToken: string;
};

export const POST = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  try {
    const body = (await request.json()) as TMeBody;
    const { authToken } = body;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 400 }
      );
    }

    // TODO: fix to build
    const decoded = jwt.verify(authToken, JWT_SECRET);

    return NextResponse.json({
      success: true,
      message: 'Token successfully verified',
      data: {
        userId: decoded.userId as number,
        username: decoded.username as string,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
};
