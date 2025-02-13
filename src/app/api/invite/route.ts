import { NextRequest, NextResponse } from 'next/server';
import {
  getInvitationsByUserId,
  addInvitation,
  getInvitationByRef,
  updateInvitation,
  updateInvitationStatus,
} from '@/actions/invite';
import jwt, { type Secret, JwtPayload } from 'jsonwebtoken';
import { type TApiCall } from '@/types/api-call';

const JWT_SECRET = process.env.JWT_SECRET as Secret;

type TInvitePostBody = {
  name: string;
  message: string;
  authToken: string;
};

type TInvitePatchBody = {
  ref: string;
  response: 'yes' | 'no';
};

type TInviteDeleteBody = {
  ref: string;
};

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

      const decoded = jwt.verify(authToken, JWT_SECRET) as JwtPayload & {
        userId: number;
        username: string;
      };

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
      {
        success: true,
        message: 'Invitation fetched successfully',
        data: { invitation: data },
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: false, message: 'Missing authToken or ref' },
    { status: 400 }
  );
};

export const POST = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  try {
    const body = (await request.json()) as TInvitePostBody;
    const { name, message, authToken } = body;

    if (!name || !message)
      return NextResponse.json(
        { success: false, message: 'Missing fields' },
        { status: 400 }
      );

    const decoded = jwt.verify(authToken, JWT_SECRET) as JwtPayload & {
      userId: number;
      username: string;
    };

    await addInvitation(decoded.userId, name, message);

    return NextResponse.json(
      { success: true, message: 'Invitation created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create invitation' },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  try {
    const body = (await request.json()) as TInvitePatchBody;
    const { ref, response } = body;

    await updateInvitation(ref, response);

    return NextResponse.json(
      { success: true, message: 'Invitation updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update invitation' },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  try {
    const body = (await request.json()) as TInviteDeleteBody;
    const { ref } = body;

    updateInvitationStatus(ref, 'DELETED');

    return NextResponse.json(
      { success: true, message: 'Invitation status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update invitation' },
      { status: 500 }
    );
  }
};
