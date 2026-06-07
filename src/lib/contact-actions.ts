"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createContactMessage, markMessageRead } from "@/lib/data";
import { notifyNewMessage } from "@/lib/notify";
import { rateLimit, ipFrom } from "@/lib/rate-limit";

/** Public: a visitor sends the contact form. Saves it + alerts the owner. */
export async function sendContactMessageAction(data: {
  name: string;
  phone: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const ip = ipFrom(await headers());
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000).ok) {
    return { ok: false, error: "Trop de messages envoyés. Réessayez plus tard." };
  }
  const name = (data.name ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const message = (data.message ?? "").trim();
  if (name.length < 2) return { ok: false, error: "Veuillez entrer votre nom." };
  if (message.length < 5) return { ok: false, error: "Votre message est trop court." };

  const msg = await createContactMessage({
    name: name.slice(0, 80),
    phone: phone.slice(0, 30),
    message: message.slice(0, 2000),
  });
  await notifyNewMessage(msg);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

/** Admin: mark a message as read. */
export async function markMessageReadAction(id: string): Promise<void> {
  await requireRole(["admin"]);
  await markMessageRead(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
