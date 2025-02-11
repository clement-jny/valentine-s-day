import { z } from 'zod';

// TODO: message personnalisé
export const registerSchema = z.object({
  username: z.string().min(2).max(50),
  firstname: z.string().min(2).max(50),
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export const loginSchema = z.object({
  username: z.string().min(2).max(50),
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});
