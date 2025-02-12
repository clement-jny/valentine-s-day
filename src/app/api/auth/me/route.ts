import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const token = body.token;
    const secret = process.env.JWT_SECRET;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    const decoded = jwt.verify(token, secret);

    return NextResponse.json({
      userId: decoded.userId,
      username: decoded.username,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
