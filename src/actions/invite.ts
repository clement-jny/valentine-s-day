'use server';

// import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { inviteTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';

export const getInvitationsByUserId = async (userId: number) => {
  const data = await db
    .select()
    .from(inviteTable)
    .where(eq(inviteTable.userId, userId));
  return data;
};

export const getInvitationByRef = async (ref: string) => {
  const data = await db
    .select()
    .from(inviteTable)
    .where(eq(inviteTable.ref, ref));
  return data[0];
};

export const addInvitation = async (
  userId: number,
  name: string,
  message: string
) => {
  const ref = randomBytes(12).toString('hex');
  const accessLink = `${process.env.BASE_URL}/invite?ref=${ref}`;

  await db
    .insert(inviteTable)
    .values({ userId, ref, name, message, accessLink });
};

export const updateInvitation = async (ref: string, response: string) => {
  await db
    .update(inviteTable)
    .set({ response })
    .where(eq(inviteTable.ref, ref));
};
