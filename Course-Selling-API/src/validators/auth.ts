import { z } from "zod";

// Enum validity only. Do not trust client-sent role for authorization; validate server-side.
const roleEnum = z.enum(["INSTRUCTOR", "STUDENT"]);

/** Signup: auth info. Role accepted for shape/enum only — enforce server-side. */
export const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: roleEnum.default("STUDENT"),
});

/** Login: credentials only. */
export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

/** Update user: optional fields. No createdAt — server-managed. */
export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
  role: roleEnum.optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
