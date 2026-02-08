import { Hono } from "hono";
import { prisma } from "../../db";
import { signUpSchema, signInSchema } from "../validators/auth";
import { hashPassword, verifyPassword, signToken } from "../lib/auth";
import { requireAuth } from "../middleware/auth";
import type { AuthVariables } from "../middleware/auth";

const app = new Hono<{ Variables: AuthVariables }>();

/** POST /auth/signup — Create account. Validate role server-side (e.g. default STUDENT, or admin sets INSTRUCTOR). */
app.post("/signup", async (c) => {
  const body = await c.req.json();
  const parsed = signUpSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Validation failed", details: parsed.error.flatten() }, 400);
  }
  const { email, name, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return c.json({ error: "Email already registered" }, 409);
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, name, password: hashed, role },
    select: { id: true, email: true, name: true, role: true },
  });

  const token = await signToken(user);
  return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token }, 201);
});

/** POST /auth/login — Return JWT for valid credentials. */
app.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = signInSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Validation failed", details: parsed.error.flatten() }, 400);
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  return c.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  });
});

/** GET /auth/me — Current user (requires valid Bearer token). */
app.get("/me", requireAuth, async (c) => {
  const user = c.get("user");
  return c.json({ user });
});

export default app;
