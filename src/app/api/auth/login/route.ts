import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getByUsername } from '@/actions/user';
import { loginSchema, TLoginSchema } from '@/lib/zod-schemas';

const JWT_SECRET = process.env.JWT_SECRET;

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

    // Générer un JWT après la validation des identifiants
    const payload = { userId: user.uuid, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Le token expire dans 1 heure

    return NextResponse.json(
      { message: 'Login successful', token },
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
