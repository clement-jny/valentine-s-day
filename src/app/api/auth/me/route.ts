import { NextRequest, NextResponse } from 'next/server';
import jwt, { type Secret, JwtPayload } from 'jsonwebtoken';
import { type TApiCall } from '@/types/api-call';

const JWT_SECRET = process.env.JWT_SECRET as Secret;

type TMeGetBody = {
  authToken: string;
};

export const POST = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  try {
    const body = (await request.json()) as TMeGetBody;
    const { authToken } = body;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(authToken, JWT_SECRET) as JwtPayload & {
      userId: number;
      username: string;
    };

    return NextResponse.json({
      success: true,
      message: 'Token successfully verified',
      data: {
        userId: decoded.userId,
        username: decoded.username,
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
