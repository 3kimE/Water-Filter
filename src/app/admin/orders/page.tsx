import Link from "next/link";
import { Phone, Eye } from "lucide-react";
import { getOrders } from "@/lib/data";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatMAD, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

type SP = Record<string, string | string[] | undefined>;

const TABS: { key: string; label: string }[] = [
  { key: "", label: "Toutes" },
  { key: "pending", label: "En attente" },
  { key: "confirmed", label: "Confirmées" },
  { key: "installed", label: "Installées" },
  { key: "shipped", label: "Expédiées" },
  { key: "delivered", label: "Livrées" },
  { key: "returned", label: "Retournées" },
  { key: "cancelled", label: "Annulées" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const params = await searchParams;
  const status = (Array.isArray(params.status) ? params.status[0] : params.status) ?? "";

  const all = await getOrders();
  const list = status
    ? all.filter((o) => o.status === (status as OrderStatus))
    : all;

  const countFor = (key: string) =>
    key ? all.filter((o) => o.status === key).length : all.length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Commandes</h1>
        <p className="text-sm text-ink-soft">
          Gérez et confirmez les commandes de vos clients
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = status === t.key;
          return (
            <Link
              key={t.key}
              href={t.key ? `/admin/orders?status=${t.key}` : "/admin/orders"}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-brand-500 text-white"
                  : "border border-slate-200 bg-white text-ink-soft hover:bg-slate-50"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  active ? "bg-white/20" : "bg-slate-100 text-ink"
                }`}
              >
                {countFor(t.key)}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3 font-semibold">Commande</th>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Ville</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-semibold text-brand-700 hover:underline"
                    >
                      {o.id}
                    </Link>
                    <p className="text-xs text-ink-soft">
                      {o.items.length} article{o.items.length > 1 ? "s" : ""}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink">{o.customerName}</p>
                    <a
                      href={`tel:${o.phone}`}
                      className="flex items-center gap-1 text-xs text-ink-soft hover:text-brand-600"
                    >
                      <Phone className="h-3 w-3" /> {o.phone}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{o.city}</td>
                  <td className="px-5 py-3 font-semibold text-ink">
                    {formatMAD(o.total)}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-600"
                      aria-label="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {list.length === 0 && (
          <p className="py-16 text-center text-ink-soft">
            Aucune commande dans cette catégorie.
          </p>
        )}
      </div>
    </div>
  );
}
