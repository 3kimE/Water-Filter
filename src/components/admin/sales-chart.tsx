"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { formatMAD, cn } from "@/lib/utils";
import type { SalesBucket, SalesSeries } from "@/lib/data";

type Range = "day" | "week" | "month";

/** Only show every Nth x-axis label so dense ranges (24h, 30d) don't overlap. */
function showLabel(range: Range, i: number) {
  if (range === "week") return true;
  if (range === "day") return i % 3 === 0;
  return i % 5 === 0;
}

export function SalesChart({ series }: { series: SalesSeries }) {
  const { t } = useI18n();
  const [range, setRange] = useState<Range>("week");

  const data = series[range];
  const total = data.reduce((s, b) => s + b.revenue, 0);
  const max = Math.max(...data.map((b) => b.revenue), 0);

  const labelFor = (b: SalesBucket) =>
    range === "day"
      ? `${b.hour}h`
      : range === "week"
        ? t(`common.dow.${b.dow}`)
        : b.date ?? "";

  const ranges: { key: Range; label: string }[] = [
    { key: "day", label: t("admin.dash.rangeDay") },
    { key: "week", label: t("admin.dash.rangeWeek") },
    { key: "month", label: t("admin.dash.rangeMonth") },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-500" />
          <h2 className="font-display font-bold text-ink">{t("admin.dash.salesTitle")}</h2>
          <span className="font-display text-sm font-bold text-ink">{formatMAD(total)}</span>
        </div>
        <div className="flex rounded-full bg-slate-100 p-0.5">
          {ranges.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                range === r.key
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <p className="py-20 text-center text-sm text-ink-soft">{t("admin.dash.noSalesRange")}</p>
      ) : (
        <div className="mt-6">
          {/* Bar track — fixed height so the percentage bar heights resolve */}
          <div className="flex h-52 items-end gap-1">
            {data.map((b, i) => {
              const pct = max > 0 ? Math.round((b.revenue / max) * 100) : 0;
              return (
                <div key={i} className="flex h-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-brand-500 to-aqua-400 transition-all hover:opacity-90"
                    style={{ height: b.revenue > 0 ? `${Math.max(pct, 2)}%` : "0%" }}
                    title={formatMAD(b.revenue)}
                  />
                </div>
              );
            })}
          </div>
          {/* X-axis labels in their own row, aligned to the bars above */}
          <div className="mt-2 flex gap-1">
            {data.map((b, i) => (
              <span
                key={i}
                className="flex-1 truncate text-center text-[10px] leading-none text-ink-soft"
              >
                {showLabel(range, i) ? labelFor(b) : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
