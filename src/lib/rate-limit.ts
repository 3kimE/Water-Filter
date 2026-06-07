import { prisma } from "@/lib/prisma";

/**
 * DB-backed rate limiter — shared across all serverless instances (works on Vercel,
 * unlike a per-process Map). Fixed-window counter per key. Best-effort (a tiny race
 * on the window edge is acceptable for abuse protection).
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: boolean; retryAfterSec: number }> {
  const now = new Date();
  try {
    const rec = await prisma.rateLimit.findUnique({ where: { key } });
    if (!rec || rec.resetAt <= now) {
      const resetAt = new Date(now.getTime() + windowMs);
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt },
        update: { count: 1, resetAt },
      });
      return { ok: true, retryAfterSec: 0 };
    }
    if (rec.count >= limit) {
      return { ok: false, retryAfterSec: Math.ceil((rec.resetAt.getTime() - now.getTime()) / 1000) };
    }
    await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
    return { ok: true, retryAfterSec: 0 };
  } catch {
    // Never block a legitimate request because the limiter itself failed.
    return { ok: true, retryAfterSec: 0 };
  }
}

/** Best-effort client IP from request headers (Next server actions). */
export function ipFrom(h: Headers): string {
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
