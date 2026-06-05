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
} from "@/lib/data";
import { notifyNewOrder, notifyPlombierAssignment } from "@/lib/notify";
import { rateLimit, ipFrom } from "@/lib/rate-limit";
import type { OrderItem, OrderStatus } from "@/lib/types";

/** Roles allowed to confirm orders / add phone orders. */
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
  return session;
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
}): Promise<{ ok: boolean; error?: string }> {
  await requireStaff(["confirmateur", "admin"]);

  const when = new Date(input.installDate);
  if (isNaN(when.getTime())) return { ok: false, error: "Date d'installation invalide." };

  const plombier = await getPlombierEmail();
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

  revalidatePath("/confirmation");
  revalidatePath("/plombier");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
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
