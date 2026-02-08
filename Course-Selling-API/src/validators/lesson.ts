import { z } from "zod";

const optionalVideoUrl = z
  .string()
  .url("Invalid video URL")
  .optional()
  .or(z.literal("").transform(() => undefined));

/** Create lesson: shape only. Course ownership enforced in API later. */
export const createLessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  videoUrl: optionalVideoUrl,
  order: z.number().int().min(0).default(0),
  courseId: z.string().uuid("Invalid course id"),
});

/** Update lesson: partial. No createdAt. */
export const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional().nullable(),
  videoUrl: z
    .string()
    .url()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => undefined)),
  order: z.number().int().min(0).optional(),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
