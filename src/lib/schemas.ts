import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Your username must be 2 characters' })
    .max(50),
  firstname: z
    .string()
    .min(2, { message: 'Your firstname must be 2 characters' })
    .max(50),
  pin: z.string().min(6, {
    message: 'Your pin password must be 6 characters.',
  }),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Your username must be 2 characters' })
    .max(50),
  pin: z.string().min(6, {
    message: 'Your pin password must be 6 characters.',
  }),
});
