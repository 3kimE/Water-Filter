"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createOrder, updateOrderStatus } from "@/lib/data";
import type { OrderItem, OrderStatus } from "@/lib/types";

/** Public: place an order at checkout (cash on delivery). */
export async function createOrderAction(payload: {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  items: OrderItem[];
  total: number;
}): Promise<{ id: string }> {
  const order = await createOrder(payload);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { id: order.id };
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
