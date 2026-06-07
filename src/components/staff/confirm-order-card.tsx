"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  MessageCircle,
  MapPin,
  User,
  Check,
  RotateCcw,
  PhoneOff,
  X,
} from "lucide-react";
import { confirmOrderAction, recordCallOutcomeAction } from "@/lib/order-actions";
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
  const tel = order.phone.replace(/\s/g, "");

  function confirm() {
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

  function outcome(o: "rappeler" | "pas_reponse" | "annuler") {
    setError(null);
    startTransition(async () => {
      const res = await recordCallOutcomeAction(order.id, o);
      if (res.ok) router.refresh();
      else setError(res.error ?? "Erreur.");
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-ink">{order.id}</span>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            À confirmer
          </span>
          {order.source === "phone" && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-soft">
              téléphone
            </span>
          )}
        </div>
        <span className="text-xs text-ink-soft">{formatDate(order.createdAt)}</span>
      </div>

      {/* Body: client + products */}
      <div className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-1.5 text-sm">
          <p className="flex items-center gap-2 font-medium text-ink" dir="auto">
            <User className="h-4 w-4 shrink-0 text-ink-soft" /> {order.customerName}
          </p>
          <a href={`tel:${tel}`} className="flex items-center gap-2 text-ink-soft hover:text-brand-600">
            <Phone className="h-4 w-4 shrink-0" /> {order.phone}
          </a>
          <p className="flex items-start gap-2 text-ink-soft" dir="auto">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> <span>{order.address}, {order.city}</span>
          </p>
        </div>
        <div className="sm:text-right">
          <p className="mb-1 text-xs text-ink-soft">Produits demandés</p>
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {order.items.map((it, i) => (
              <span key={i} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-ink" dir="auto">
                {it.name} ×{it.qty}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-soft">Montant total</p>
          <p className="font-display text-2xl font-extrabold text-brand-700">{formatMAD(order.total)}</p>
        </div>
      </div>

      {order.note && (
        <p className="mx-5 mb-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-ink-soft" dir="auto">
          📝 {order.note}
        </p>
      )}
      {order.confirmationNote && (
        <p className="mx-5 mb-2 text-xs font-medium text-amber-600">⏱ {order.confirmationNote}</p>
      )}

      {/* Quick contact */}
      <div className="grid grid-cols-2 gap-2 px-5">
        <a
          href={`tel:${tel}`}
          className="flex items-center justify-center gap-2 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50"
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

      {/* Treatment */}
      <div className="mt-4 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
        <p className="mb-2 text-sm font-semibold text-ink">Traitement de la commande</p>
        <label className="mb-1 block text-xs font-medium text-ink-soft">Date d&apos;installation prévue</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optionnel) — ex : livrer le matin"
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => outcome("rappeler")}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink-soft transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RotateCcw className="h-3.5 w-3.5" /> À rappeler
          </button>
          <button
            onClick={() => outcome("pas_reponse")}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink-soft transition hover:bg-slate-50 disabled:opacity-60"
          >
            <PhoneOff className="h-3.5 w-3.5" /> Pas de réponse
          </button>
          <button
            onClick={() => outcome("annuler")}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
          >
            <X className="h-3.5 w-3.5" /> Annuler
          </button>
          <button
            onClick={confirm}
            disabled={pending}
            className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            <Check className="h-4 w-4" /> {pending ? "…" : "Confirmer & planifier"}
          </button>
        </div>
      </div>
    </div>
  );
}
