"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Phone, MessageCircle, MapPin, Check, CalendarClock } from "lucide-react";
import { confirmOrderAction } from "@/lib/order-actions";
import { formatMAD, formatDate } from "@/lib/utils";
import type { Order } from "@/lib/types";

function waNumber(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("212")) return d;
  if (d.startsWith("0")) return "212" + d.slice(1);
  return d;
}

export function ConfirmOrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  function confirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!date) {
      setError("Choisissez une date d'installation.");
      return;
    }
    startTransition(async () => {
      const res = await confirmOrderAction({
        id: order.id,
        installDate: new Date(date).toISOString(),
        note: note.trim() || undefined,
      });
      if (res.ok) router.refresh();
      else setError(res.error ?? "Erreur.");
    });
  }

  const tel = order.phone.replace(/\s/g, "");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-ink">
            {order.id}
            {order.source === "phone" && (
              <span className="ms-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-soft">
                téléphone
              </span>
            )}
          </p>
          <p className="text-xs text-ink-soft">{formatDate(order.createdAt)}</p>
        </div>
        <span className="font-display text-lg font-extrabold text-brand-700">
          {formatMAD(order.total)}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <p className="font-medium text-ink" dir="auto">{order.customerName}</p>
        <p className="flex items-center gap-1.5 text-ink-soft">
          <MapPin className="h-4 w-4 shrink-0" /> <span dir="auto">{order.address}, {order.city}</span>
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {order.items.map((it, i) => (
            <span key={i} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-ink" dir="auto">
              {it.name} × {it.qty}
            </span>
          ))}
        </div>
        {order.note && (
          <p className="pt-1 text-xs text-ink-soft" dir="auto">📝 {order.note}</p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={`tel:${tel}`}
          className="flex items-center justify-center gap-2 rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          <Phone className="h-4 w-4" /> Appeler
        </a>
        <a
          href={`https://wa.me/${waNumber(order.phone)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>

      {/* Confirm + schedule */}
      <form onSubmit={confirm} className="mt-4 rounded-xl bg-slate-50 p-3">
        <label className="flex items-center gap-1.5 text-sm font-medium text-ink">
          <CalendarClock className="h-4 w-4 text-brand-500" /> Date d&apos;installation
        </label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (ex : client confirmé, livrer le matin)"
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> {pending ? "Confirmation…" : "Confirmer & planifier"}
        </button>
      </form>
    </div>
  );
}
