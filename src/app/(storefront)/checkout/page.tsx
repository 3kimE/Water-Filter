"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  MapPin,
  Home,
  StickyNote,
  Banknote,
  ShieldCheck,
  Truck,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { ProductPhoto } from "@/components/product-photo";
import { MOROCCAN_CITIES } from "@/lib/mock-data";
import { formatMAD } from "@/lib/utils";

const FREE_DELIVERY = 1000;

type Errors = Partial<Record<"name" | "phone" | "city" | "address", string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const delivery = subtotal >= FREE_DELIVERY ? 0 : 40;
  const total = subtotal + delivery;

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (form.name.trim().length < 3) e.name = "Entrez votre nom complet";
    if (!/^0[5-7]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Numéro invalide (ex : 0612345678)";
    if (!form.city) e.city = "Choisissez votre ville";
    if (form.address.trim().length < 6) e.address = "Entrez une adresse complète";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const order = {
      id: "FM-" + (1000 + Math.floor(Math.random() * 9000)),
      ...form,
      items,
      delivery,
      total,
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem("fm_last_order", JSON.stringify(order));
    clear();
    router.push("/order-confirmation");
  }

  if (!hydrated) {
    return <div className="container-page py-24 text-center text-ink-soft">Chargement…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-ink-soft">
          Ajoutez un produit avant de passer commande.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block font-semibold text-brand-600 hover:text-brand-700"
        >
          Aller à la boutique →
        </Link>
      </div>
    );
  }

  const inputBase =
    "h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm outline-none transition-all focus:ring-4 focus:ring-brand-100";

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold text-ink">
        Finaliser la commande
      </h1>
      <p className="mt-2 text-ink-soft">
        Remplissez vos coordonnées. Notre équipe vous appellera pour confirmer.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]"
      >
        {/* Form */}
        <div className="rounded-card border border-brand-100 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm text-white">
              1
            </span>
            Vos coordonnées
          </h2>

          <div className="mt-6 space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ex : Mohamed Alaoui"
                  className={`${inputBase} ${errors.name ? "border-rose-400" : "border-brand-100 focus:border-brand-300"}`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  inputMode="tel"
                  placeholder="0612345678"
                  className={`${inputBase} ${errors.phone ? "border-rose-400" : "border-brand-100 focus:border-brand-300"}`}
                />
              </div>
              {errors.phone ? (
                <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
              ) : (
                <p className="mt-1 text-xs text-ink-soft">
                  Nous vous appellerons sur ce numéro pour confirmer.
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Ville
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <select
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={`${inputBase} appearance-none ${errors.city ? "border-rose-400" : "border-brand-100 focus:border-brand-300"}`}
                >
                  <option value="">Choisissez votre ville</option>
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {errors.city && <p className="mt-1 text-xs text-rose-500">{errors.city}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Adresse complète
              </label>
              <div className="relative">
                <Home className="absolute left-4 top-4 h-4 w-4 text-ink-soft" />
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  rows={3}
                  placeholder="Quartier, rue, numéro, étage..."
                  className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:ring-4 focus:ring-brand-100 ${errors.address ? "border-rose-400" : "border-brand-100 focus:border-brand-300"}`}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Note (facultatif)
              </label>
              <div className="relative">
                <StickyNote className="absolute left-4 top-4 h-4 w-4 text-ink-soft" />
                <textarea
                  value={form.note}
                  onChange={(e) => set("note", e.target.value)}
                  rows={2}
                  placeholder="Ex : Appeler après 18h"
                  className="w-full rounded-xl border border-brand-100 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <h2 className="mt-8 flex items-center gap-2 font-display text-lg font-bold text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm text-white">
              2
            </span>
            Mode de paiement
          </h2>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-brand-500 bg-brand-50 p-4">
            <Banknote className="h-6 w-6 text-brand-600" />
            <div>
              <p className="font-semibold text-ink">Paiement à la livraison (COD)</p>
              <p className="text-sm text-ink-soft">
                Payez en espèces quand vous recevez votre commande.
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-card border border-brand-100 bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold text-ink">
              Votre commande
            </h2>

            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId + (item.variantLabel ?? "")}
                  className="flex items-center gap-3"
                >
                  <div className="relative shrink-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-brand-100 bg-white">
                      <ProductPhoto
                        src={item.image}
                        alt={item.name}
                        hue={item.hue}
                        sizes="56px"
                        className="p-1"
                      />
                    </div>
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1 text-xs font-bold text-white">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p dir="auto" className="font-medium text-ink">{item.name}</p>
                    {item.variantLabel && (
                      <p className="text-xs text-ink-soft">{item.variantLabel}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-ink">
                    {formatMAD(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-brand-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Sous-total</dt>
                <dd className="font-semibold text-ink">{formatMAD(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Livraison</dt>
                <dd className="font-semibold text-ink">
                  {delivery === 0 ? "Gratuite" : formatMAD(delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-brand-100 pt-3">
                <dt className="font-bold text-ink">Total à payer</dt>
                <dd className="font-display text-xl font-extrabold text-brand-700">
                  {formatMAD(total)}
                </dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? "Traitement…" : "Confirmer la commande"}
            </button>

            <div className="mt-4 space-y-2 text-xs text-ink-soft">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand-500" /> Livraison partout au Maroc
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-500" /> Garantie & retour 48h
              </p>
              <p className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-brand-500" /> Vos données restent confidentielles
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
