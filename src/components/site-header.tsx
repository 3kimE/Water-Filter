"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  Truck,
  Phone,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import { useCart } from "@/context/cart-context";
import { useI18n } from "@/i18n/i18n-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { BrandName } from "@/components/brand-name";
import type { SiteSettings } from "@/lib/data";

const NAV = [
  { key: "nav.home", href: "/" },
  { key: "nav.shop", href: "/shop" },
  { key: "nav.about", href: "/about" },
  { key: "nav.contact", href: "/contact" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const { count, hydrated } = useCart();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-ink text-white">
        <div className="container-page flex h-9 items-center justify-center gap-2 text-center text-xs">
          <Truck className="h-3.5 w-3.5 shrink-0 opacity-80" />
          <span className="font-medium opacity-90">
            {settings.announcement || t("header.announcement")}
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="glass border-b border-line">
        <div className="container-page flex h-18 items-center gap-4">
          {/* Logo (text only) */}
          <Link href="/" className="flex shrink-0 items-center">
            <span className="font-display text-2xl font-extrabold leading-none tracking-tight text-ink">
              <BrandName name={settings.siteName} />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ms-6 hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.key === "nav.shop" ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-neutral-100"
                  >
                    {t(item.key)}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Link>
                  <div className="invisible absolute start-0 top-full w-64 translate-y-2 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-[var(--shadow-soft)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/shop?cat=${c.slug}`}
                        className="block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-neutral-100"
                      >
                        <span className="font-medium text-ink">
                          {t(`cat.${c.slug}.name`)}
                        </span>
                        <span className="block text-xs text-ink-soft">
                          {t(`cat.${c.slug}.tagline`)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-neutral-100"
                >
                  {t(item.key)}
                </Link>
              ),
            )}
          </nav>

          {/* Search (desktop) */}
          <form action="/shop" className="ms-auto hidden flex-1 items-center md:flex md:max-w-xs">
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                name="q"
                placeholder={t("header.searchPlaceholder")}
                className="h-10 w-full rounded-full border border-line bg-neutral-50 ps-9 pe-4 text-sm outline-none transition-all focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </form>

          {/* Language switcher */}
          <div className="ms-auto md:ms-2">
            <LanguageSwitcher />
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-neutral-100"
            aria-label={t("header.cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {hydrated && count > 0 && (
              <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-neutral-100 lg:hidden"
            aria-label={t("header.menu")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="border-t border-line bg-white lg:hidden">
            <div className="container-page flex flex-col gap-1 py-4">
              <form action="/shop" className="relative mb-2">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  name="q"
                  placeholder={t("header.searchShort")}
                  className="h-11 w-full rounded-full border border-line bg-neutral-50 ps-9 pe-4 text-sm outline-none focus:border-brand-400 focus:bg-white"
                />
              </form>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 font-medium text-ink hover:bg-neutral-100"
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="mt-2 border-t border-line pt-2">
                <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  {t("header.categories")}
                </p>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?cat=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-neutral-100"
                  >
                    {t(`cat.${c.slug}.name`)}
                  </Link>
                ))}
              </div>
              {settings.phone1 && (
                <a
                  href={`tel:${settings.phone1.replace(/\s/g, "")}`}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-3 font-medium text-ink"
                >
                  <Phone className="h-4 w-4" /> {settings.phone1}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
