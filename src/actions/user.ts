'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getUsers = async () => {
  const data = await db.select().from(userTable);
  return data;
};

export const getByUsername = async (username: string) => {
  const data = await db
    .select()
    // .select({ username: userTable.username })
    .from(userTable)
    .where(eq(userTable.username, username));

  console.log(data);

  // TODO: find better solution
  return data[0];
};

export const addUser = async (
  username: string,
  firstname: string,
  pin: string
) => {
  await db.insert(userTable).values({ username, firstname, pin });
};

export const editUser = async (uuid: number, firstname: string) => {
  await db
    .update(userTable)
    .set({
      firstname,
    })
    .where(eq(userTable.uuid, uuid));

  revalidatePath('/');
};
