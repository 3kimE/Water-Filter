import { AlertTriangle, Inbox } from "lucide-react";
import { getOrdersToConfirm, getProducts, getPlombierEmail } from "@/lib/data";
import { ConfirmOrderCard } from "@/components/staff/confirm-order-card";
import { PhoneOrderForm } from "@/components/staff/phone-order-form";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage() {
  const [orders, products, plombier] = await Promise.all([
    getOrdersToConfirm(),
    getProducts(),
    getPlombierEmail(),
  ]);

  const pickProducts = products
    .filter((p) => p.inStock)
    .map((p) => ({ id: p.id, name: p.name, price: p.price }));

  return (
    <div className="space-y-6">
      {!plombier && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          Aucun plombier configuré. Les commandes seront confirmées mais pas assignées —
          demandez à l&apos;administrateur de créer un compte plombier.
        </div>
      )}

      <PhoneOrderForm products={pickProducts} />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <Inbox className="h-7 w-7" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-ink">
            Aucune commande à confirmer
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Les nouvelles commandes apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((o) => (
            <ConfirmOrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
