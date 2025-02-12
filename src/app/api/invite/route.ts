import { NextRequest, NextResponse } from 'next/server';
import {
  getInvitationsByUserId,
  addInvitation,
  getInvitationByRef,
  updateInvitation,
} from '@/actions/invite';
import jwt from 'jsonwebtoken';
import { type TApiCall } from '@/types/api-call';

const JWT_SECRET = process.env.JWT_SECRET;

export const GET = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  const authToken = request.nextUrl.searchParams.get('authToken');
  const ref = request.nextUrl.searchParams.get('ref');

  if (authToken) {
    try {
      if (!authToken)
        return NextResponse.json(
          { success: false, message: 'Missing authToken' },
          { status: 400 }
        );

      // TODO: fix to build
      const decoded = jwt.verify(authToken, JWT_SECRET);

      const data = await getInvitationsByUserId(Number(decoded.userId));

      return NextResponse.json(
        {
          success: true,
          message: 'Invitations fetched successfully',
          data: { invitations: data },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch invitations' },
        { status: 500 }
      );
    }
  } else if (ref) {
    const data = await getInvitationByRef(ref);

    return NextResponse.json(
      { success: true, message: '', data },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: false, message: 'Missing authToken or ref' },
    { status: 400 }
  );
};

export const POST = async (request: NextRequest) => {
  try {
    const { name, message, authToken } = await request.json();

    if (!name || !message)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // TODO: fix to build
    const decoded = jwt.verify(authToken, JWT_SECRET);

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

export const PATCH = async (request: NextRequest) => {
  try {
    const { ref, response } = (await request.json()) as {
      ref: string;
      response: 'yes' | 'no';
    };

    await updateInvitation(ref, response);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to update invitation' },
      { status: 500 }
    );
  }
};
