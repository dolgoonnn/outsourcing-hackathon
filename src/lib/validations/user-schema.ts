import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const appLoginSchema = z.object({
  phoneNumber: z.number(),
  password: z.string(),
});

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.number(),
  name: z.string(),
  type: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  createdAt: z.date(),
  phoneNumber: z.number().nullable(),
  name: z.string().nullable(),
});
