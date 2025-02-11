'use server';

// import { eq, not } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { userTable } from '@/db/schema';

export const getData = async () => {
  const data = await db.select().from(userTable);
  return data;
};
