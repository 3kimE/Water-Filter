import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Fail fast if the signing secret is missing/weak — never sign or verify with an empty key.
const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET || AUTH_SECRET.length < 16) {
  throw new Error("AUTH_SECRET is missing or too short (set a long random value in your env).");
}
const secret = new TextEncoder().encode(AUTH_SECRET);
export const SESSION_COOKIE = "fm_admin_session";

/**
 * Resolves the caller's session + effective role and enforces it's allowed.
 * Falls back to the DB role for sessions issued before roles existed. Throws if not allowed.
 */
export async function requireRole(
  roles: string[],
): Promise<{ sub: string; email: string; role: string }> {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");
  let role = session.role;
  if (!role) {
    const u = await prisma.adminUser.findUnique({
      where: { id: session.sub },
      select: { role: true },
    });
    role = u?.role ?? undefined;
  }
  if (!role || !roles.includes(role)) throw new Error("Non autorisé");
  return { sub: session.sub, email: session.email, role };
}

/** Where each role lands after login / when redirected out of a forbidden area. */
export function roleHome(role: string | undefined): string {
  if (role === "confirmateur") return "/confirmation";
  if (role === "plombier") return "/technicien";
  return "/admin";
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function createSession(user: { id: string; email: string; role?: string }) {
  const token = await new SignJWT({ email: user.email, role: user.role ?? "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { sub: string; email: string; role?: string };
  } catch {
    return null;
  }
}
