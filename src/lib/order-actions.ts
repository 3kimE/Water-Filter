"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  createOrder,
  updateOrderStatus,
  confirmOrder,
  getPlombierEmail,
  getOrderById,
  completeInstallation,
  setJobStage,
} from "@/lib/data";
import { uploadProductImage } from "@/lib/storage";
import {
  notifyNewOrder,
  notifyPlombierAssignment,
  notifyOrderConfirmed,
  notifyOrderInstalled,
} from "@/lib/notify";
import { rateLimit, ipFrom } from "@/lib/rate-limit";
import type { OrderItem, OrderStatus } from "@/lib/types";

/** Resolves the caller's session + effective role and checks it's allowed. */
async function requireStaff(roles: string[]) {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");
  // Fall back to the DB role for sessions issued before roles existed.
  let role = session.role;
  if (!role) {
    const u = await prisma.adminUser.findUnique({
      where: { id: session.sub },
      select: { role: true },
    });
    role = u?.role;
  }
  if (!role || !roles.includes(role)) throw new Error("Non autorisé");
  return { session, role };
}

/** Public: place an order at checkout (cash on delivery). */
export async function createOrderAction(payload: {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  items: { productId: string; qty: number; variantLabel?: string }[];
}): Promise<{ id: string; total: number; delivery: number; items: OrderItem[] }> {
  const ip = ipFrom(await headers());
  if (!rateLimit(`order:${ip}`, 5, 10 * 60 * 1000).ok) {
    throw new Error("RATE_LIMITED");
  }
  const order = await createOrder(payload);
  await notifyNewOrder(order); // emails the owner if configured; never throws
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  return {
    id: order.id,
    total: order.total,
    delivery: order.total - subtotal,
    items: order.items,
  };
}

/** Admin only: change an order's status / confirmation note. */
export async function updateOrderStatusAction(
  id: string,
  status: OrderStatus,
  confirmationNote?: string,
): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");
  await updateOrderStatus(id, status, confirmationNote);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
}

/**
 * Confirmateur/admin: confirm an order after calling the client, schedule the
 * install, auto-assign it to the plombier, and notify him by email.
 */
export async function confirmOrderAction(input: {
  id: string;
  installDate: string; // ISO from a datetime-local input
  note?: string;
  assignedTo?: string; // selected plombier email; falls back to the first plombier
}): Promise<{ ok: boolean; error?: string }> {
  await requireStaff(["confirmateur", "admin"]);

  const when = new Date(input.installDate);
  if (isNaN(when.getTime())) return { ok: false, error: "Date d'installation invalide." };

  const plombier = input.assignedTo?.trim() || (await getPlombierEmail());
  const order = await confirmOrder(input.id, {
    installDate: when,
    assignedTo: plombier,
    note: input.note?.trim() || undefined,
  });

  if (plombier) {
    await notifyPlombierAssignment(plombier, {
      orderId: order.id,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      city: order.city,
      installDate: order.installDate,
    });
  }
  await notifyOrderConfirmed(order, plombier); // keep the owner in the loop

  revalidatePath("/confirmation");
  revalidatePath("/plombier");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Confirmateur/admin: record the outcome of a confirmation call.
 * - "annuler"  -> order cancelled
 * - "rappeler" / "pas_reponse" -> stays pending, logs the attempt as a note
 */
export async function recordCallOutcomeAction(
  id: string,
  outcome: "rappeler" | "pas_reponse" | "annuler",
): Promise<{ ok: boolean; error?: string }> {
  await requireStaff(["confirmateur", "admin"]);
  const stamp = new Date().toLocaleString("fr-MA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  if (outcome === "annuler") {
    await updateOrderStatus(id, "cancelled", `Annulée par le confirmateur · ${stamp}`);
  } else {
    const label = outcome === "rappeler" ? "À rappeler" : "Pas de réponse";
    await updateOrderStatus(id, "pending", `${label} · ${stamp}`);
  }
  revalidatePath("/confirmation");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { ok: true };
}

/** Plombier/admin: advance progress on an assigned job ("enroute" | "arrived"). */
export async function setJobStageAction(
  id: string,
  stage: "enroute" | "arrived",
): Promise<{ ok: boolean; error?: string }> {
  const { session, role } = await requireStaff(["plombier", "admin"]);
  const order = await getOrderById(id);
  if (!order) return { ok: false, error: "Commande introuvable." };
  if (role !== "admin" && order.assignedTo !== session.email) {
    return { ok: false, error: "Cette installation ne vous est pas assignée." };
  }
  await setJobStage(id, stage);
  revalidatePath("/plombier");
  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Plombier/admin: mark an installation as done with a completion photo.
 * A plombier may only complete a job assigned to him.
 */
export async function completeInstallationAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const { session, role } = await requireStaff(["plombier", "admin"]);

  const id = String(formData.get("orderId") ?? "");
  if (!id) return { ok: false, error: "Commande manquante." };

  const order = await getOrderById(id);
  if (!order) return { ok: false, error: "Commande introuvable." };
  if (role !== "admin" && order.assignedTo !== session.email) {
    return { ok: false, error: "Cette installation ne vous est pas assignée." };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Ajoutez une photo de l'installation." };
  }

  let photoUrl: string;
  try {
    photoUrl = await uploadProductImage(file);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Échec de l'envoi de la photo." };
  }

  const updated = await completeInstallation(id, photoUrl);
  await notifyOrderInstalled(updated); // keep the owner in the loop
  revalidatePath("/plombier");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  return { ok: true };
}

/** Confirmateur/admin: manually create an order for a client who phoned in. */
export async function createPhoneOrderAction(payload: {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  items: { productId: string; qty: number; variantLabel?: string }[];
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  await requireStaff(["confirmateur", "admin"]);
  try {
    const order = await createOrder({ ...payload, source: "phone" });
    revalidatePath("/confirmation");
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true, id: order.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERREUR";
    const map: Record<string, string> = {
      INVALID_NAME: "Nom invalide (3–60 caractères).",
      INVALID_PHONE: "Téléphone invalide (format 0XXXXXXXXX).",
      INVALID_CITY: "Ville invalide.",
      INVALID_ADDRESS: "Adresse trop courte.",
      INVALID_ITEMS: "Ajoutez au moins un produit.",
      PRODUCT_NOT_FOUND: "Produit introuvable.",
      OUT_OF_STOCK: "Stock insuffisant pour un produit.",
    };
    return { ok: false, error: map[msg] ?? "Une erreur est survenue." };
  }
}
