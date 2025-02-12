import { NextRequest, NextResponse } from 'next/server';
import { getInvitationsByUserId, addInvitation } from '@/actions/invite';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export const GET = async (request: NextRequest) => {
  try {
    const authToken = request.nextUrl.searchParams.get('authToken');

    if (!authToken)
      return NextResponse.json({ error: 'Missing authToken' }, { status: 400 });

    const decoded = jwt.verify(authToken, secret);

    const data = await getInvitationsByUserId(Number(decoded.userId));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { name, message, authToken } = await request.json();

    if (!name || !message)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const decoded = jwt.verify(authToken, secret);

    await addInvitation(decoded.userId, name, message);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
};
