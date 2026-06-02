"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";

const CONTACTS = [
  {
    icon: Phone,
    title: "Téléphone",
    lines: ["0634 585 463", "0760 629 315"],
    href: "tel:0634585463",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["filter.water.maoc@gmail.com"],
    href: "mailto:filter.water.maoc@gmail.com",
  },
  {
    icon: Clock,
    title: "Horaires",
    lines: ["Lun – Sam : 9h – 19h", "Support WhatsApp 24/7"],
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const input =
    "h-12 w-full rounded-xl border border-brand-100 bg-white px-4 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100";

  return (
    <>
      <section className="hero-water border-b border-brand-100">
        <div className="container-page py-14 text-center">
          <h1 className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
            Contactez-nous
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
            Une question sur un produit, une installation ou une commande ? Notre
            équipe est là pour vous aider.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr]">
        {/* Contact info */}
        <div className="space-y-4">
          {CONTACTS.map((c) => (
            <div
              key={c.title}
              className="flex items-start gap-4 rounded-card border border-brand-100 bg-white p-5 shadow-soft"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">{c.title}</h3>
                {c.lines.map((l) =>
                  c.href ? (
                    <a key={l} href={c.href} className="block text-sm text-ink-soft hover:text-brand-600">
                      {l}
                    </a>
                  ) : (
                    <p key={l} className="text-sm text-ink-soft">{l}</p>
                  ),
                )}
              </div>
            </div>
          ))}

          <a
            href="https://wa.me/212634585463"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            <MessageCircle className="h-5 w-5" /> Discuter sur WhatsApp
          </a>

          <div className="flex items-center gap-3 rounded-card bg-brand-50/70 p-5 text-sm text-ink-soft">
            <MapPin className="h-5 w-5 shrink-0 text-brand-500" />
            Livraison et installation partout au Maroc 🇲🇦
          </div>
        </div>

        {/* Form */}
        <div className="rounded-card border border-brand-100 bg-white p-6 shadow-soft sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-ink">
                Message envoyé !
              </h2>
              <p className="mt-2 text-ink-soft">
                Merci {form.name || ""}, nous vous répondrons très vite.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", phone: "", message: "" });
                }}
                className="mt-6 font-semibold text-brand-600 hover:text-brand-700"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink">
                Envoyez-nous un message
              </h2>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Nom</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={input}
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Téléphone</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={input}
                  placeholder="0612345678"
                  inputMode="tel"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>
              <button
                type="submit"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-brand-600"
              >
                <Send className="h-5 w-5" /> Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
