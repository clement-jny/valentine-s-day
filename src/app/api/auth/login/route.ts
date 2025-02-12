import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt, { type Secret } from 'jsonwebtoken';
import { getByUsername } from '@/actions/user';
import { loginSchema, TLoginSchema } from '@/lib/zod-schemas';
import { type TApiCall } from '@/types/api-call';

const JWT_SECRET = process.env.JWT_SECRET as Secret;

export const POST = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  try {
    const body = (await request.json()) as TLoginSchema;
    const { username, pin } = loginSchema.parse(body);

    // Vérifier si l'utilisateur existe
    const user = await getByUsername(username);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Vérifier le PIN
    const isValid = await bcrypt.compare(pin, user.pin);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Générer un JWT après la validation des identifiants
    const payload = { userId: user.uuid, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }); // Le token expire dans 24 heure

    return NextResponse.json(
      { success: true, message: 'Login successful', data: { token } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
};
