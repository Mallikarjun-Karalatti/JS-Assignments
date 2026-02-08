import { SignJWT, jwtVerify } from "jose";
import type { User } from "@prisma/client";
import { prisma } from "../../db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-in-production"
);
const JWT_ISSUER = "course-selling-api";
const JWT_AUDIENCE = "course-selling-api";
const JWT_EXPIRY = "7d";

export type AuthUser = Pick<User, "id" | "email" | "name" | "role">;

/** Hash password with bcrypt (Bun built-in). */
export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 });
}

/** Verify password against hash. */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Bun.password.verify(password, hash);
}

/** Sign a JWT for the user. */
export async function signToken(user: AuthUser): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

/** Verify JWT and return payload (sub = userId). */
export async function verifyToken(token: string): Promise<{ sub: string; email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    const sub = payload.sub;
    if (typeof sub !== "string") return null;
    return {
      sub,
      email: (payload.email as string) ?? "",
      role: (payload.role as string) ?? "STUDENT",
    };
  } catch {
    return null;
  }
}

/** Get current user from DB by ID. Returns null if not found or token invalid. */
export async function getAuthUserFromToken(token: string): Promise<AuthUser | null> {
  const payload = await verifyToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true },
  });
  return user;
}

/** Extract Bearer token from Authorization header. */
export function getBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim() || null;
}
