import { createMiddleware } from "hono/factory";
import { prisma } from "../../db";
import type { Course } from "@prisma/client";
import type { AuthVariables } from "./auth";

export type OwnershipVariables = AuthVariables & { course: Course };

/**
 * Require that the course exists and belongs to the authenticated instructor.
 * Must use after requireAuth + requireInstructor.
 * Sets context.var.course or returns 403/404.
 */
export const requireCourseOwnership = createMiddleware<{ Variables: OwnershipVariables }>(async (c, next) => {
  const user = c.get("user");
  const courseId = c.req.param("courseId") || c.req.param("id");

  if (!courseId) {
    return c.json({ error: "Course ID is required" }, 400);
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return c.json({ error: "Course not found" }, 404);
  }

  if (course.userId !== user.id) {
    return c.json({ error: "Forbidden: You can only modify your own courses" }, 403);
  }

  c.set("course", course);
  await next();
});
