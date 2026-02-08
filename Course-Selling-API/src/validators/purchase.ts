import { z } from "zod";

/** Purchase: minimal input. userId comes from auth in API. */
export const createPurchaseSchema = z.object({
  courseId: z.string().uuid("Invalid course id"),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
