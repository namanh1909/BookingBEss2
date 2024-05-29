import { z } from 'zod';

export const LoginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  confirmPassword: z.string(),
});

export const CheckAccountRequestSchema = z.object({
  email: z.string().email(),
});

export const RefreshTokenRequestSchema = z.object({
  email: z.string().email(),
});
