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

export const inviteSchema = z.object({
  name: z.string().min(1, { message: 'The name must be 1 characters' }).max(50),
  message: z
    .string()
    .min(1, { message: 'The message must be 1 characters' })
    .max(255),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;
export type TInviteSchema = z.infer<typeof inviteSchema>;
