"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  StickyNote,
  Banknote,
  Check,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
} from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { formatMAD, formatDate } from "@/lib/utils";
import { updateOrderStatusAction } from "@/lib/order-actions";

const ACTIONS: {
  status: OrderStatus;
  label: string;
  icon: typeof Check;
  className: string;
}[] = [
  { status: "confirmed", label: "Confirmer", icon: Check, className: "bg-brand-500 hover:bg-brand-600 text-white" },
  { status: "shipped", label: "Expédier", icon: Truck, className: "bg-indigo-500 hover:bg-indigo-600 text-white" },
  { status: "delivered", label: "Livrée & payée", icon: PackageCheck, className: "bg-emerald-500 hover:bg-emerald-600 text-white" },
  { status: "returned", label: "Retournée", icon: RotateCcw, className: "bg-orange-500 hover:bg-orange-600 text-white" },
  { status: "cancelled", label: "Annuler", icon: XCircle, className: "bg-rose-500 hover:bg-rose-600 text-white" },
];

export function OrderManager({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState(order.confirmationNote ?? "");
  const [touched, setTouched] = useState(false);
  const [pending, startTransition] = useTransition();

  function changeStatus(s: OrderStatus) {
    setStatus(s);
    setTouched(true);
    startTransition(async () => {
      await updateOrderStatusAction(order.id, s, note);
    });
  }

  function saveNote() {
    setTouched(true);
    startTransition(async () => {
      await updateOrderStatusAction(order.id, status, note);
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/admin/orders"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-ink">
              {order.id}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-ink-soft">
            Passée le {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {touched && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <Check className="h-5 w-5" />
          {pending ? "Enregistrement…" : "Modifications enregistrées ✓"}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Left: items */}
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h2 className="border-b border-slate-200 px-5 py-4 font-display font-bold text-ink">
              Articles commandés
            </h2>
            <table className="w-full text-left text-sm">
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{it.name}</p>
                      {it.variantLabel && (
                        <p className="text-xs text-ink-soft">{it.variantLabel}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center text-ink-soft">
                      × {it.qty}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-ink">
                      {formatMAD(it.price * it.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between bg-slate-50 px-5 py-4">
              <span className="font-bold text-ink">Total à encaisser</span>
              <span className="font-display text-xl font-extrabold text-brand-700">
                {formatMAD(order.total)}
              </span>
            </div>
          </section>

          {order.note && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-ink">
                <StickyNote className="h-4 w-4 text-brand-500" /> Note du client
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{order.note}</p>
            </section>
          )}

          {/* Confirmation note */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-ink">Note de confirmation</h3>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setTouched(true);
              }}
              rows={3}
              placeholder="Ex : Client confirmé par téléphone, livraison demain matin."
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={saveNote}
              disabled={pending}
              className="mt-3 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {pending ? "Enregistrement…" : "Enregistrer la note"}
            </button>
          </section>
        </div>

        {/* Right: customer + actions */}
        <aside className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-display font-bold text-ink">Client</h3>
            <p className="mt-3 font-semibold text-ink">{order.customerName}</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
              <Phone className="h-4 w-4" /> {order.phone}
            </div>
            <div className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{order.address}, {order.city}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={`tel:${order.phone}`}
                className="flex items-center justify-center gap-2 rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                <Phone className="h-4 w-4" /> Appeler
              </a>
              <a
                href={`https://wa.me/212${order.phone.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-display font-bold text-ink">Paiement</h3>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm">
              <Banknote className="h-5 w-5 text-brand-600" />
              <span className="font-medium text-ink">À la livraison (COD)</span>
            </div>
          </section>

          {/* Suivi (confirmation + installation) */}
          {(order.confirmedAt || order.installDate || order.assignedTo || order.completedAt || order.source === "phone") && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-display font-bold text-ink">Suivi</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-soft">Source</dt>
                  <dd className="font-medium text-ink">
                    {order.source === "phone" ? "Téléphone" : "Site web"}
                  </dd>
                </div>
                {order.confirmedAt && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-soft">Confirmée le</dt>
                    <dd className="font-medium text-ink">{formatDate(order.confirmedAt)}</dd>
                  </div>
                )}
                {order.installDate && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-soft">Installation prévue</dt>
                    <dd className="text-end font-medium text-ink">
                      {new Date(order.installDate).toLocaleString("fr-MA", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </dd>
                  </div>
                )}
                {order.assignedTo && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-soft">Plombier</dt>
                    <dd className="break-all font-medium text-ink">{order.assignedTo}</dd>
                  </div>
                )}
                {order.completedAt && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-soft">Installée le</dt>
                    <dd className="font-medium text-emerald-600">{formatDate(order.completedAt)}</dd>
                  </div>
                )}
              </dl>

              {order.photoUrl && (
                <a
                  href={order.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block overflow-hidden rounded-xl border border-slate-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.photoUrl}
                    alt="Photo de l'installation"
                    className="h-40 w-full object-cover"
                  />
                  <span className="block bg-slate-50 px-3 py-2 text-xs font-medium text-brand-600">
                    Voir la photo de l&apos;installation →
                  </span>
                </a>
              )}
            </section>
          )}

          {/* Status actions */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-display font-bold text-ink">Changer le statut</h3>
            <div className="mt-3 space-y-2">
              {ACTIONS.map((a) => (
                <button
                  key={a.status}
                  onClick={() => changeStatus(a.status)}
                  disabled={status === a.status}
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition disabled:cursor-default disabled:opacity-50 ${a.className}`}
                >
                  <a.icon className="h-4 w-4" /> {a.label}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
