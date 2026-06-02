import { notFound } from "next/navigation";
import { ORDERS } from "@/lib/mock-data";
import { OrderManager } from "@/components/admin/order-manager";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = ORDERS.find((o) => o.id === id);
  if (!order) notFound();

  return <OrderManager order={order} />;
}
