"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { createOrder, updateOrderStatus } from "@/lib/data";
import { rateLimit, ipFrom } from "@/lib/rate-limit";
import type { OrderItem, OrderStatus } from "@/lib/types";

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
