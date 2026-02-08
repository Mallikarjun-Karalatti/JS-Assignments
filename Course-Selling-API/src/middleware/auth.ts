import { createMiddleware } from "hono/factory";
import { getBearerToken, getAuthUserFromToken } from "../lib/auth";
import type { AuthUser } from "../lib/auth";

export type AuthVariables = { user: AuthUser };

/** Require valid Bearer token. Sets context.var.user or returns 401. */
export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const token = getBearerToken(c.req.raw.headers.get("Authorization") ?? undefined);
  if (!token) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }
  const user = await getAuthUserFromToken(token);
  if (!user) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
  c.set("user", user);
  await next();
});

/** Optional auth: set user if valid token, but do not require it. */
export const optionalAuth = createMiddleware<{ Variables: { user: AuthUser | null } }>(async (c, next) => {
  const token = getBearerToken(c.req.raw.headers.get("Authorization") ?? undefined);
  if (!token) {
    c.set("user", null);
    await next();
    return;
  }
  const user = await getAuthUserFromToken(token);
  c.set("user", user ?? null);
  await next();
});

/** Require authenticated user with INSTRUCTOR role. Must use after requireAuth. */
export const requireInstructor = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const user = c.get("user");
  if (!user || user.role !== "INSTRUCTOR") {
    return c.json({ error: "Forbidden: Instructor access required" }, 403);
  }
  await next();
});

/** Require authenticated user with STUDENT role. Must use after requireAuth. */
export const requireStudent = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const user = c.get("user");
  if (!user || user.role !== "STUDENT") {
    return c.json({ error: "Forbidden: Student access required" }, 403);
  }
  await next();
});
