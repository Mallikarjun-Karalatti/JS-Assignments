import { z } from "zod";

/** Create course: instructor input. Ownership/authorization checked in API, not here. */
export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  published: z.boolean().default(false),
});

/** Update course: partial. No createdAt. */
export const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive().optional(),
  published: z.boolean().optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
