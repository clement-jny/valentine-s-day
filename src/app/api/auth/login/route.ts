import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getByUsername } from '@/actions/userAction';
import { loginSchema, TLoginSchema } from '@/lib/zod-schemas';

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as TLoginSchema;
    const { username, pin } = loginSchema.parse(body);

    // Vérifier si l'utilisateur existe
    const user = await getByUsername(username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Vérifier le PIN
    const isValid = await bcrypt.compare(pin, user.pin);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Login successful', userId: user.uuid },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
