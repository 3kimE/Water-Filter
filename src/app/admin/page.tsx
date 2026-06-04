import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  Banknote,
  Package,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  getDashboardStats,
  getOrders,
  getLowStockProducts,
  getTopSellers,
} from "@/lib/data";
import { StatusBadge } from "@/components/admin/status-badge";
import { STATUS_META, STATUS_ORDER } from "@/lib/order-status";
import { formatMAD } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { total: totalOrders, pending, products, revenue, byStatus } =
    await getDashboardStats();
  const [lowStock, topSellers] = await Promise.all([
    getLowStockProducts(5, 6),
    getTopSellers(5),
  ]);

  const stats = [
    {
      label: "Commandes",
      value: String(totalOrders),
      icon: ShoppingBag,
      tone: "bg-brand-50 text-brand-600",
      hint: "+12% ce mois",
    },
    {
      label: "À confirmer",
      value: String(pending),
      icon: Clock,
      tone: "bg-amber-50 text-amber-600",
      hint: "Appels en attente",
    },
    {
      label: "Chiffre d'affaires",
      value: formatMAD(revenue),
      icon: Banknote,
      tone: "bg-emerald-50 text-emerald-600",
      hint: "Commandes validées",
    },
    {
      label: "Produits",
      value: String(products),
      icon: Package,
      tone: "bg-indigo-50 text-indigo-600",
      hint: "En catalogue",
    },
  ];

  const recent = (await getOrders()).slice(0, 6);

  // Mock weekly sales (visual only)
  const week = [
    { d: "Lun", v: 60 },
    { d: "Mar", v: 80 },
    { d: "Mer", v: 45 },
    { d: "Jeu", v: 95 },
    { d: "Ven", v: 70 },
    { d: "Sam", v: 100 },
    { d: "Dim", v: 55 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          Tableau de bord
        </h1>
        <p className="text-sm text-ink-soft">
          Bonjour 👋 Voici un aperçu de votre boutique aujourd&apos;hui.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-ink-soft">{s.hint}</span>
            </div>
            <p className="mt-4 font-display text-2xl font-extrabold text-ink">
              {s.value}
            </p>
            <p className="text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display font-bold text-ink">Commandes par statut</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Tout voir <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {STATUS_ORDER.map((st) => {
            const meta = STATUS_META[st];
            return (
              <Link
                key={st}
                href={`/admin/orders?status=${st}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
                <p className="mt-3 font-display text-2xl font-extrabold text-ink">
                  {byStatus[st] ?? 0}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_20rem]">
        {/* Recent orders */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-display font-bold text-ink">Commandes récentes</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Tout voir <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-5 py-3 font-semibold">Commande</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
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
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{o.customerName}</p>
                      <p className="text-xs text-ink-soft">{o.city}</p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-ink">
                      {formatMAD(o.total)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly sales */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-500" />
            <h2 className="font-display font-bold text-ink">Ventes (7 jours)</h2>
          </div>
          <div className="mt-6 flex h-44 items-end justify-between gap-2">
            {week.map((b) => (
              <div key={b.d} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-aqua-400"
                    style={{ height: `${b.v}%` }}
                  />
                </div>
                <span className="text-xs text-ink-soft">{b.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock faible + Meilleures ventes */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Stock faible */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Package className="h-4 w-4" />
              </span>
              <h2 className="font-display font-bold text-ink">Stock faible</h2>
            </div>
            <Link
              href="/admin/products"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Gérer l&apos;inventaire
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-ink-soft">
              Tout est bien approvisionné ✅
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}/edit`}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Package className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p dir="auto" className="line-clamp-1 text-sm font-medium text-ink">
                      {p.name}
                    </p>
                    <p className="text-xs capitalize text-ink-soft">{p.categorySlug}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      p.stock <= 2
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {p.stock} restant{p.stock > 1 ? "s" : ""}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Meilleures ventes */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h2 className="font-display font-bold text-ink">Meilleures ventes</h2>
            </div>
            <Link
              href="/admin/products"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Produits
            </Link>
          </div>
          {topSellers.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-ink-soft">
              Aucune vente pour l&apos;instant.
            </p>
          ) : (
            <div className="space-y-4 px-5 py-5">
              {topSellers.map((p, i) => {
                const max = topSellers[0].units || 1;
                const pct = Math.max(6, Math.round((p.units / max) * 100));
                return (
                  <div key={p.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span dir="auto" className="line-clamp-1 font-medium text-ink">
                        <span className="text-ink-soft">{i + 1}.</span> {p.name}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-ink-soft">
                        {p.units} unité{p.units > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-aqua-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
