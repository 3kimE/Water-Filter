import { getOrdersToConfirm, getProducts, getPlombiers } from "@/lib/data";
import { ConfirmationBoard } from "@/components/staff/confirmation-board";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage() {
  const [orders, products, plombiers] = await Promise.all([
    getOrdersToConfirm(),
    getProducts(),
    getPlombiers(),
  ]);

  const pickProducts = products
    .filter((p) => p.inStock)
    .map((p) => ({ id: p.id, name: p.name, price: p.price }));

  return (
    <ConfirmationBoard
      orders={orders}
      products={pickProducts}
      plombiers={plombiers}
      hasPlombier={plombiers.length > 0}
    />
  );
}
