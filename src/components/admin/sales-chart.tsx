"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { formatMAD, cn } from "@/lib/utils";
import type { SalesBucket, SalesSeries } from "@/lib/data";

type Range = "day" | "week" | "month";

/** Round a value up to a clean axis ceiling: 1, 2, 5, 10, 20, 50, 100, 200… */
function niceCeil(v: number): number {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / pow;
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * pow;
}

const fmtAxis = (v: number) =>
  v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : `${Math.round(v)}`;

// viewBox geometry — the SVG scales to fill width, keeping this aspect ratio.
const W = 1000;
const H = 260;
const padL = 42;
const padR = 14;
const padT = 14;
const padB = 26;
const plotW = W - padL - padR;
const plotH = H - padT - padB;

export function SalesChart({ series }: { series: SalesSeries }) {
  const { t } = useI18n();
  const [range, setRange] = useState<Range>("week");
  const [hover, setHover] = useState<number | null>(null);

  const data = series[range];
  const n = data.length;
  const total = data.reduce((s, b) => s + b.revenue, 0);
  const max = Math.max(...data.map((b) => b.revenue), 0);
  const niceMax = niceCeil(max);

  const x = (i: number) => padL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => padT + plotH - (v / niceMax) * plotH;

  const linePath = data
    .map((b, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(b.revenue).toFixed(1)}`)
    .join(" ");
  const areaPath =
    `${linePath} L ${x(n - 1).toFixed(1)} ${(padT + plotH).toFixed(1)}` +
    ` L ${x(0).toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const gridVals = [niceMax, niceMax / 2, 0];

  const labelShort = (b: SalesBucket) =>
    range === "day" ? `${b.hour}h` : range === "week" ? t(`common.dow.${b.dow}`) : b.date ?? "";
  const tipLabel = (b: SalesBucket) =>
    range === "day"
      ? `${String(b.hour).padStart(2, "0")}:00`
      : range === "week"
        ? t(`common.dow.${b.dow}`)
        : b.date ?? "";
  const showX = (i: number) =>
    range === "week" ? true : range === "day" ? i % 3 === 0 : i % 5 === 0;

  const ranges: { key: Range; label: string }[] = [
    { key: "day", label: t("admin.dash.rangeDay") },
    { key: "week", label: t("admin.dash.rangeWeek") },
    { key: "month", label: t("admin.dash.rangeMonth") },
  ];

  function moveTo(clientX: number, rect: DOMRect) {
    const vbX = ((clientX - rect.left) / rect.width) * W;
    const frac = (vbX - padL) / plotW;
    const idx = Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1))));
    setHover(idx);
  }

  const hx = hover != null ? x(hover) : 0;
  const lxPct = hover != null ? (hx / W) * 100 : 0;
  const tipTransform =
    lxPct < 12 ? "translateX(0)" : lxPct > 88 ? "translateX(-100%)" : "translateX(-50%)";

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
              onClick={() => {
                setRange(r.key);
                setHover(null);
              }}
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
        <div
          className="relative mt-4 select-none"
          onMouseMove={(e) => moveTo(e.clientX, e.currentTarget.getBoundingClientRect())}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => moveTo(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
          onTouchMove={(e) => moveTo(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-brand-500" role="img">
            <defs>
              <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* gridlines + y labels */}
            {gridVals.map((v, i) => (
              <g key={i}>
                <line
                  x1={padL}
                  x2={W - padR}
                  y1={y(v)}
                  y2={y(v)}
                  className="stroke-slate-200"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={padL - 8}
                  y={y(v)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-slate-400"
                  fontSize={13}
                >
                  {fmtAxis(v)}
                </text>
              </g>
            ))}

            {/* area + line */}
            <path d={areaPath} fill="url(#salesAreaGradient)" />
            <path
              d={linePath}
              fill="none"
              className="stroke-brand-500"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* x labels */}
            {data.map((b, i) =>
              showX(i) ? (
                <text
                  key={i}
                  x={x(i)}
                  y={H - 6}
                  textAnchor="middle"
                  className="fill-slate-400"
                  fontSize={13}
                >
                  {labelShort(b)}
                </text>
              ) : null,
            )}

            {/* hover crosshair + dot */}
            {hover != null && (
              <>
                <line
                  x1={hx}
                  x2={hx}
                  y1={padT}
                  y2={padT + plotH}
                  className="stroke-slate-300"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={hx}
                  cy={y(data[hover].revenue)}
                  r={5}
                  className="fill-white stroke-brand-500"
                  strokeWidth={2.5}
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>

          {/* tooltip */}
          {hover != null && (
            <div
              className="pointer-events-none absolute top-1 z-10 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-md"
              style={{ left: `${lxPct}%`, transform: tipTransform }}
            >
              <p className="text-[11px] text-ink-soft">{tipLabel(data[hover])}</p>
              <p className="text-sm font-bold text-ink">{formatMAD(data[hover].revenue)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
