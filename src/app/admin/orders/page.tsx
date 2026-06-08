import Link from "next/link";
import { Phone, Eye } from "lucide-react";
import { getOrders } from "@/lib/data";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatMAD, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";
import { getT } from "@/i18n/server";

type SP = Record<string, string | string[] | undefined>;

const TABS: { key: string; labelKey: string }[] = [
  { key: "", labelKey: "admin.ordersPage.tabAll" },
  { key: "pending", labelKey: "admin.ordersPage.tabPending" },
  { key: "confirmed", labelKey: "admin.ordersPage.tabConfirmed" },
  { key: "installed", labelKey: "admin.ordersPage.tabInstalled" },
  { key: "cancelled", labelKey: "admin.ordersPage.tabCancelled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const { t } = await getT();
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
        <h1 className="font-display text-2xl font-bold text-ink">{t("admin.ordersPage.title")}</h1>
        <p className="text-sm text-ink-soft">
          {t("admin.ordersPage.subtitle")}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = status === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key ? `/admin/orders?status=${tab.key}` : "/admin/orders"}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-brand-500 text-white"
                  : "border border-slate-200 bg-white text-ink-soft hover:bg-slate-50"
              }`}
            >
              {t(tab.labelKey)}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  active ? "bg-white/20" : "bg-slate-100 text-ink"
                }`}
              >
                {countFor(tab.key)}
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
                <th className="px-5 py-3 font-semibold">{t("admin.ordersPage.colOrder")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.ordersPage.colCustomer")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.ordersPage.colCity")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.ordersPage.colTotal")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.ordersPage.colDate")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.ordersPage.colStatus")}</th>
                <th className="px-5 py-3 text-right font-semibold">{t("admin.ordersPage.colAction")}</th>
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
                      {o.items.length > 1
                        ? t("admin.ordersPage.itemsPlural", { count: o.items.length })
                        : t("admin.ordersPage.itemsSingular", { count: o.items.length })}
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
                    {o.status === "pending" && (
                      <p className="mt-1">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            o.lastOutcome === "rappeler"
                              ? "bg-amber-100 text-amber-700"
                              : o.lastOutcome === "pas_reponse"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-ink-soft"
                          }`}
                        >
                          {o.lastOutcome === "rappeler"
                            ? t("admin.ordersPage.outcomeCallBack")
                            : o.lastOutcome === "pas_reponse"
                              ? o.callAttempts > 1
                                ? t("admin.ordersPage.outcomeNoAnswerCount", { count: o.callAttempts })
                                : t("admin.ordersPage.outcomeNoAnswer")
                              : t("admin.ordersPage.outcomeToProcess")}
                        </span>
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-600"
                      aria-label={t("admin.ordersPage.view")}
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
            {t("admin.ordersPage.empty")}
          </p>
        )}
      </div>
    </div>
  );
}
