"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  Truck,
  Banknote,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMAD } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

type LastOrder = {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  items: CartItem[];
  delivery: number;
  total: number;
};

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("fm_last_order");
      if (raw) setOrder(JSON.parse(raw) as LastOrder);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  if (loaded && !order) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">
          Aucune commande récente
        </h1>
        <p className="mt-2 text-ink-soft">
          Vous n&apos;avez pas de commande à afficher.
        </p>
        <Link href="/shop" className="mt-6 inline-block font-semibold text-brand-600 hover:text-brand-700">
          Aller à la boutique →
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="container-page py-24 text-center text-ink-soft">Chargement…</div>;
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 animate-fade-up items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-11 w-11" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">
          Merci, {order.name.split(" ")[0]} ! 🎉
        </h1>
        <p className="mt-2 text-ink-soft">
          Votre commande <strong className="text-brand-700">{order.id}</strong> a
          bien été reçue. Notre équipe va vous appeler pour la confirmer.
        </p>
      </div>

      {/* What happens next */}
      <div className="mx-auto mt-10 max-w-2xl rounded-card border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-ink">Et maintenant ?</h2>
        <ol className="mt-4 space-y-4">
          {[
            { icon: Phone, title: "On vous appelle", text: `Notre centre de confirmation appellera le ${order.phone} sous peu pour valider votre commande.` },
            { icon: Truck, title: "Livraison", text: `Votre commande sera livrée à ${order.city} après confirmation.` },
            { icon: Banknote, title: "Paiement à la livraison", text: `Vous payez ${formatMAD(order.total)} en espèces à la réception.` },
          ].map((s, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="text-sm text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Order summary */}
      <div className="mx-auto mt-6 max-w-2xl rounded-card border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-bold text-ink">
          Résumé de la commande
        </h2>
        <div className="mt-4 space-y-2 text-sm">
          {order.items.map((item) => (
            <div
              key={item.productId + (item.variantLabel ?? "")}
              className="flex justify-between"
            >
              <span className="text-ink">
                {item.name}
                {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.qty}
              </span>
              <span className="font-semibold text-ink">
                {formatMAD(item.price * item.qty)}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-brand-100 pt-2 text-ink-soft">
            <span>Livraison</span>
            <span>{order.delivery === 0 ? "Gratuite" : formatMAD(order.delivery)}</span>
          </div>
          <div className="flex justify-between border-t border-brand-100 pt-2 text-base">
            <span className="font-bold text-ink">Total</span>
            <span className="font-display font-extrabold text-brand-700">
              {formatMAD(order.total)}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-brand-50/70 p-3 text-sm text-ink-soft">
          <strong className="text-ink">Livraison à :</strong> {order.address},{" "}
          {order.city}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
        <Button href="/shop" size="lg">Continuer mes achats</Button>
        <a
          href="https://wa.me/212634585463"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 font-semibold text-white transition hover:brightness-105"
        >
          <MessageCircle className="h-5 w-5" /> Nous contacter
        </a>
      </div>
    </div>
  );
}
