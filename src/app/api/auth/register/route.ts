import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getByUsername, addUser } from '@/actions/userAction';
import { registerSchema, TRegisterSchema } from '@/lib/zod-schemas';

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as TRegisterSchema;
    const { username, firstname, pin } = registerSchema.parse(body);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await getByUsername(username);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hacher le PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    await addUser(username, firstname, hashedPin);

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
