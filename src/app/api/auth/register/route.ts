import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getByUsername, addUser } from '@/actions/user';
import { registerSchema, TRegisterSchema } from '@/lib/zod-schemas';
import { type TApiCall } from '@/types/api-call';

export const POST = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  try {
    const body = (await request.json()) as TRegisterSchema;
    const { username, firstname, pin } = registerSchema.parse(body);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await getByUsername(username);

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hacher le PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    await addUser(username, firstname, hashedPin);

    return NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
};
