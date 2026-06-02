import Link from "next/link";
import {
  Droplet,
  ShieldCheck,
  Truck,
  Users,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getT } from "@/i18n/server";

export const metadata = { title: "À propos" };

const STATS = [
  { value: "+5 000", labelKey: "about.stats.0.label" },
  { value: "+10", labelKey: "about.stats.1.label" },
  { value: "4.8/5", labelKey: "about.stats.2.label" },
  { value: "7 ans", labelKey: "about.stats.3.label" },
];

const VALUES = [
  { icon: Droplet, titleKey: "about.values.0.title", textKey: "about.values.0.text" },
  { icon: ShieldCheck, titleKey: "about.values.1.title", textKey: "about.values.1.text" },
  { icon: Truck, titleKey: "about.values.2.title", textKey: "about.values.2.text" },
  { icon: HeartHandshake, titleKey: "about.values.3.title", textKey: "about.values.3.text" },
];

export default async function AboutPage() {
  const { t } = await getT();
  return (
    <>
      <section className="hero-water">
        <div className="container-page py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft">
            <Droplet className="h-4 w-4 text-aqua-500" /> {t("about.hero.badge")}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-extrabold text-ink sm:text-5xl">
            {t("about.hero.titleLead")}{" "}
            <span className="text-gradient">{t("about.hero.titleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-8">
        <div className="grid grid-cols-2 gap-4 rounded-card border border-line bg-white p-6 shadow-soft sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.labelKey} className="text-center">
              <p className="font-display text-3xl font-extrabold text-brand-600">{s.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{t(s.labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-gradient-to-br from-brand-400 to-brand-800 shadow-glow">
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplet className="h-40 w-40 animate-float text-white/90" strokeWidth={1.2} fill="rgba(255,255,255,0.18)" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-ink">{t("about.story.heading")}</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            {t("about.story.paragraph1")}
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            {t("about.story.paragraph2")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/shop" size="lg">
              {t("about.story.ctaProducts")} <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/contact" variant="outline" size="lg">{t("about.story.ctaContact")}</Button>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-50/60 py-16">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-ink">{t("about.values.heading")}</h2>
            <p className="mt-2 text-ink-soft">{t("about.values.subtitle")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.titleKey} className="rounded-card bg-white p-6 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{t(v.titleKey)}</h3>
                <p className="mt-1 text-sm text-ink-soft">{t(v.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-gradient-to-r from-brand-700 to-brand-500 px-8 py-12 text-center text-white">
          <Users className="h-12 w-12 text-aqua-300" />
          <h2 className="max-w-xl font-display text-3xl font-bold">
            {t("about.cta.heading")}
          </h2>
          <Button href="/shop" variant="dark" size="lg">
            {t("about.cta.button")} <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </>
  );
}
