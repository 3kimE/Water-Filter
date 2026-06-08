"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createReview, setReviewStatus } from "@/lib/data";
import { requireRole } from "@/lib/auth";
import { rateLimit, ipFrom } from "@/lib/rate-limit";

export type ReviewSubmitResult = { ok: true } | { ok: false; error: string };

/** Public: a customer submits a review (saved as "pending" until an admin approves it). */
export async function submitReviewAction(input: {
  productId: string;
  productSlug?: string;
  name: string;
  rating: number;
  comment: string;
  hp?: string; // honeypot — bots fill it
}): Promise<ReviewSubmitResult> {
  // Honeypot: pretend success, save nothing.
  if (input.hp) return { ok: true };

  const ip = ipFrom(await headers());
  const rl = await rateLimit(`review:${ip}`, 5, 60 * 60 * 1000); // 5 reviews / hour / IP
  if (!rl.ok) return { ok: false, error: "RATE_LIMIT" };

  try {
    await createReview({
      productId: input.productId,
      name: input.name,
      rating: input.rating,
      comment: input.comment,
    });
    if (input.productSlug) revalidatePath(`/product/${input.productSlug}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "ERROR" };
  }
}

/** Admin: approve a review (it then shows on the site). */
export async function approveReviewAction(id: string) {
  await requireRole(["admin"]);
  await setReviewStatus(id, "approved");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}

/** Admin: reject a review (hidden from the site). */
export async function rejectReviewAction(id: string) {
  await requireRole(["admin"]);
  await setReviewStatus(id, "rejected");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}
