import { z } from "zod";

/** Path param: resource id (UUID). */
export const uuidParamSchema = z.object({
  id: z.string().uuid("Invalid id"),
});

/** Path param: courseId (UUID). */
export const courseIdParamSchema = z.object({
  courseId: z.string().uuid("Invalid course id"),
});

export type UuidParam = z.infer<typeof uuidParamSchema>;
export type CourseIdParam = z.infer<typeof courseIdParamSchema>;
