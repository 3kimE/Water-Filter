"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/i18n-context";
import { useSettings } from "@/context/settings-context";
import { sendContactMessageAction } from "@/lib/contact-actions";
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

export default function ContactPage() {
  const { t, locale } = useI18n();
  const settings = useSettings();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", message: "", hp: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const res = await sendContactMessageAction({
      name: form.name,
      phone: form.phone,
      message: form.message,
      hp: form.hp,
    });
    setSending(false);
    if (res.ok) setSent(true);
    else setError(res.error ?? t("checkout.error.generic"));
  }

  const input =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100";

  const phones = [settings.phone1, settings.phone2].filter(Boolean) as string[];
  const lat = settings.mapLat ?? 30.4144656;
  const lng = settings.mapLng ?? -9.5671467;

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
          {/* Phones */}
          {phones.length > 0 && (
            <div className="flex items-start gap-4 rounded-card border border-line bg-white p-5 shadow-soft">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">{t("contact.info.phone")}</h3>
                {phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block text-sm text-ink-soft hover:text-brand-600">
                    {p}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Email */}
          {settings.email && (
            <div className="flex items-start gap-4 rounded-card border border-line bg-white p-5 shadow-soft">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">{t("contact.info.email")}</h3>
                <a href={`mailto:${settings.email}`} className="block break-all text-sm text-ink-soft hover:text-brand-600">
                  {settings.email}
                </a>
              </div>
            </div>
          )}

          {/* Hours */}
          <div className="flex items-start gap-4 rounded-card border border-line bg-white p-5 shadow-soft">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-ink">{t("contact.info.hours")}</h3>
              <p className="text-sm text-ink-soft">{t("contact.info.hours.line1")}</p>
              <p className="text-sm text-ink-soft">{t("contact.info.hours.line2")}</p>
            </div>
          </div>

          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 font-semibold text-white shadow-soft transition hover:brightness-105"
            >
              <MessageCircle className="h-5 w-5" /> {t("contact.whatsapp")}
            </a>
          )}

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
                  setForm({ name: "", phone: "", message: "", hp: "" });
                }}
                className="mt-6 font-semibold text-brand-600 hover:text-brand-700"
              >
                {t("contact.success.button")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {/* Honeypot — hidden from humans, traps bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.hp}
                onChange={(e) => setForm({ ...form, hp: e.target.value })}
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <h2 className="font-display text-xl font-bold text-ink">
                {t("contact.form.title")}
              </h2>
              {error && (
                <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">{t("contact.form.name")}</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder={t("contact.form.namePlaceholder")} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">{t("contact.form.phone")}</label>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} placeholder={t("contact.form.phonePlaceholder")} inputMode="tel" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">{t("contact.form.message")}</label>
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100" placeholder={t("contact.form.messagePlaceholder")} />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-700 disabled:opacity-60"
              >
                <Send className="h-5 w-5" /> {sending ? t("contact.form.sending") : t("contact.form.submit")}
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
              {settings.addressText || t("contact.location.address")}
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Navigation className="h-4 w-4" /> {t("contact.location.directions")}
          </a>
        </div>
        <div className="overflow-hidden rounded-card border border-line shadow-soft">
          <iframe
            title="Filtre Maroc"
            src={`https://www.google.com/maps?q=${lat},${lng}&z=15&hl=${locale}&output=embed`}
            className="h-[380px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
