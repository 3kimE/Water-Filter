import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data";
import { OrderManager } from "@/components/admin/order-manager";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return <OrderManager order={order} />;
}
