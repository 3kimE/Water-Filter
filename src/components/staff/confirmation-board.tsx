"use client";

import { useState } from "react";
import { Search, Inbox, AlertTriangle } from "lucide-react";
import { ConfirmOrderCard } from "./confirm-order-card";
import { PhoneOrderForm } from "./phone-order-form";
import type { Order } from "@/lib/types";

type PickItem = { id: string; name: string; price: number };

export function ConfirmationBoard({
  orders,
  products,
  plombiers,
  hasPlombier,
}: {
  orders: Order[];
  products: PickItem[];
  plombiers: { email: string; name: string | null; city: string | null }[];
  hasPlombier: boolean;
}) {
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const filtered = s
    ? orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(s) ||
          o.phone.replace(/\s/g, "").includes(s.replace(/\s/g, "")) ||
          o.id.toLowerCase().includes(s),
      )
    : orders;

  return (
    <div className="space-y-5">
      {!hasPlombier && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          Aucun plombier configuré. Les commandes seront confirmées mais pas assignées — demandez à
          l&apos;administrateur de créer un compte plombier.
        </div>
      )}

      <PhoneOrderForm products={products} />

      <div className="relative">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher (nom, téléphone, n° de commande)…"
          className="h-12 w-full rounded-xl border border-slate-200 bg-white ps-10 pe-4 text-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <Inbox className="h-7 w-7" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-ink">
            {orders.length === 0 ? "Aucune commande à confirmer" : "Aucun résultat"}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {orders.length === 0
              ? "Les nouvelles commandes apparaîtront ici."
              : "Essayez un autre mot-clé."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((o) => (
            <ConfirmOrderCard key={o.id} order={o} plombiers={plombiers} />
          ))}
        </div>
      )}
    </div>
  );
}
