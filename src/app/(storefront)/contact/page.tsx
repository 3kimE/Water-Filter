"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/i18n-context";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
} from "lucide-react";

const CONTACTS = [
  {
    icon: Phone,
    titleKey: "contact.info.phone",
    lines: ["0634 585 463", "0760 629 315"],
    href: "tel:0634585463",
  },
  {
    icon: Mail,
    titleKey: "contact.info.email",
    lines: ["filter.water.maoc@gmail.com"],
    href: "mailto:filter.water.maoc@gmail.com",
  },
  {
    icon: Clock,
    titleKey: "contact.info.hours",
    lineKeys: ["contact.info.hours.line1", "contact.info.hours.line2"],
  },
];

export default function ContactPage() {
  const { t, locale } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const input =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100";

  return (
    <>
      <section className="hero-water border-b border-line">
        <div className="container-page py-14 text-center">
          <h1 className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
            {t("contact.hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
            {t("contact.hero.subtitle")}
          </p>
        </div>
      </section>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr]">
        {/* Contact info */}
        <div className="space-y-4">
          {CONTACTS.map((c) => {
            const lines = c.lineKeys ? c.lineKeys.map((k) => t(k)) : c.lines!;
            return (
              <div
                key={c.titleKey}
                className="flex items-start gap-4 rounded-card border border-line bg-white p-5 shadow-soft"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-ink">{t(c.titleKey)}</h3>
                  {lines.map((l) =>
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
            );
          })}

          <a
            href="https://wa.me/212634585463"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            <MessageCircle className="h-5 w-5" /> {t("contact.whatsapp")}
          </a>

          <div className="flex items-center gap-3 rounded-card bg-brand-50/70 p-5 text-sm text-ink-soft">
            <MapPin className="h-5 w-5 shrink-0 text-brand-500" />
            {t("contact.coverage")}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-card border border-line bg-white p-6 shadow-soft sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-ink">
                {t("contact.success.title")}
              </h2>
              <p className="mt-2 text-ink-soft">
                {t("contact.success.text", { name: form.name || "" })}
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", phone: "", message: "" });
                }}
                className="mt-6 font-semibold text-brand-600 hover:text-brand-700"
              >
                {t("contact.success.button")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink">
                {t("contact.form.title")}
              </h2>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">{t("contact.form.name")}</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={input}
                  placeholder={t("contact.form.namePlaceholder")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">{t("contact.form.phone")}</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={input}
                  placeholder={t("contact.form.phonePlaceholder")}
                  inputMode="tel"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">{t("contact.form.message")}</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                  placeholder={t("contact.form.messagePlaceholder")}
                />
              </div>
              <button
                type="submit"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-brand-600"
              >
                <Send className="h-5 w-5" /> {t("contact.form.submit")}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Location / map */}
      <section className="container-page pb-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              {t("contact.location.title")}
            </h2>
            <p className="mt-1 flex items-center gap-2 text-ink-soft">
              <MapPin className="h-4 w-4 text-brand-500" />
              {t("contact.location.address")}
            </p>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=30.4144656,-9.5671467"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Navigation className="h-4 w-4" /> {t("contact.location.directions")}
          </a>
        </div>
        <div className="overflow-hidden rounded-card border border-line shadow-soft">
          <iframe
            title="Filtre Maroc — Agadir"
            src={`https://www.google.com/maps?q=30.4144656,-9.5671467&z=15&hl=${locale}&output=embed`}
            className="h-[380px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
