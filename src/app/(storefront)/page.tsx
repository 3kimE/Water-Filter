import Link from "next/link";
import {
  Droplet,
  ArrowRight,
  ShieldCheck,
  Truck,
  Phone,
  PackageCheck,
  Star,
  MousePointerClick,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CategoryIcon } from "@/components/category-icon";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, getBestSellers } from "@/lib/mock-data";
import { getT } from "@/i18n/server";

export default async function HomePage() {
  const { t } = await getT();
  const bestSellers = getBestSellers();

  const TESTIMONIALS = [
    {
      id: "t1",
      author: "Yassine B.",
      city: "Casablanca",
      rating: 5,
      title: t("home.reviews.t1.title"),
      body: t("home.reviews.t1.body"),
      product: t("home.reviews.t1.role"),
    },
    {
      id: "t2",
      author: "Fatima Z.",
      city: "Rabat",
      rating: 5,
      title: t("home.reviews.t2.title"),
      body: t("home.reviews.t2.body"),
      product: t("home.reviews.t2.role"),
    },
    {
      id: "t3",
      author: "Café Atlas",
      city: "Marrakech",
      rating: 5,
      title: t("home.reviews.t3.title"),
      body: t("home.reviews.t3.body"),
      product: t("home.reviews.t3.role"),
    },
  ];

  const COD_STEPS = [
    {
      icon: MousePointerClick,
      title: t("home.cod.step1.title"),
      text: t("home.cod.step1.text"),
    },
    {
      icon: PackageCheck,
      title: t("home.cod.step2.title"),
      text: t("home.cod.step2.text"),
    },
    {
      icon: Phone,
      title: t("home.cod.step3.title"),
      text: t("home.cod.step3.text"),
    },
    {
      icon: Truck,
      title: t("home.cod.step4.title"),
      text: t("home.cod.step4.text"),
    },
  ];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero-water">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft">
              <Droplet className="h-4 w-4 text-aqua-500" />
              {t("home.hero.badge")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
              {t("home.hero.titleA")}{" "}
              <span className="text-gradient">{t("home.hero.titleHighlight")}</span>{" "}
              {t("home.hero.titleB")}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">
              {t("home.hero.subtitleA")}{" "}
              <strong className="text-brand-700">{t("home.hero.subtitleStrong")}</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/shop" size="lg">
                {t("home.hero.ctaShop")} <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/shop?cat=cuisine" variant="outline" size="lg">
                {t("home.hero.ctaKitchen")}
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-ink">
                <ShieldCheck className="h-5 w-5 text-brand-500" /> {t("home.trust.warranty")}
              </span>
              <span className="flex items-center gap-2 font-medium text-ink">
                <Truck className="h-5 w-5 text-brand-500" /> {t("home.trust.freeDelivery")}
              </span>
              <span className="flex items-center gap-2 font-medium text-ink">
                <Headphones className="h-5 w-5 text-brand-500" /> {t("home.trust.support")}
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-square rounded-[2.5rem] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-800 shadow-[var(--shadow-glow)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplet
                  className="h-44 w-44 animate-float text-white/90"
                  strokeWidth={1.2}
                  fill="rgba(255,255,255,0.18)"
                />
              </div>
              {/* floating cards */}
              <div className="absolute -start-4 top-10 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-soft">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-xs leading-tight">
                  <p className="font-bold text-ink">{t("home.hero.card.impuritiesPct")}</p>
                  <p className="text-ink-soft">{t("home.hero.card.impuritiesLabel")}</p>
                </div>
              </div>
              <div className="absolute -end-3 bottom-12 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-soft">
                <StarRating value={5} size={14} />
                <div className="text-xs leading-tight">
                  <p className="font-bold text-ink">{t("home.hero.card.clientsCount")}</p>
                  <p className="text-ink-soft">{t("home.hero.card.clientsLabel")}</p>
                </div>
              </div>
              <div className="absolute bottom-5 start-6 rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-brand-700 shadow-soft backdrop-blur">
                {t("home.hero.card.priceFrom")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="container-page py-16">
        <div className="mb-9 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            {t("home.categories.title")}
          </h2>
          <p className="mt-2 text-ink-soft">
            {t("home.categories.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?cat=${c.slug}`}
              className="group flex flex-col items-center rounded-card border border-brand-100 bg-white p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <CategoryIcon name={c.icon} className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink group-hover:text-brand-700">
                {t(`cat.${c.slug}.name`)}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ BEST SELLERS ============ */}
      <section className="container-page py-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <Badge tone="best">
              <Star className="h-3 w-3" fill="currentColor" /> {t("home.bestSellers.badge")}
            </Badge>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">
              {t("home.bestSellers.title")}
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 sm:flex"
          >
            {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ============ COD — HOW IT WORKS ============ */}
      <section className="mt-16 bg-brand-50/60 py-16">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-ink">
              {t("home.cod.title")}
            </h2>
            <p className="mt-2 text-ink-soft">
              {t("home.cod.subtitle")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COD_STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="flex h-full flex-col rounded-card bg-white p-6 shadow-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
                </div>
                {i < COD_STEPS.length - 1 && (
                  <ArrowRight className="absolute -end-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-brand-300 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROMO BANNER ============ */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-700 to-brand-500 px-8 py-12 text-white sm:px-14">
          <Droplet className="absolute -end-8 -top-8 h-48 w-48 text-white/10" fill="currentColor" />
          <div className="relative max-w-xl">
            <Badge tone="sale">{t("home.promo.badge")}</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              {t("home.promo.title")}
            </h2>
            <p className="mt-3 text-brand-100">
              {t("home.promo.subtitle")}
            </p>
            <div className="mt-7">
              <Button href="/shop" variant="dark" size="lg">
                {t("home.promo.cta")} <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="container-page pb-16">
        <div className="mb-9 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            {t("home.reviews.title")}
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <StarRating value={4.8} size={20} />
            <span className="font-semibold text-ink">{t("home.reviews.score")}</span>
            <span className="text-ink-soft">{t("home.reviews.count")}</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((r) => (
            <div key={r.id} className="rounded-card border border-brand-100 bg-white p-6 shadow-soft">
              <StarRating value={r.rating} size={16} />
              <h3 className="mt-3 font-display font-semibold text-ink">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                “{r.body}”
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-brand-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {r.author.charAt(0)}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-ink">{r.author}</p>
                  <p className="text-ink-soft">{r.city} · {r.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
