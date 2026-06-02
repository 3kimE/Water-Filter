"use client";

import Link from "next/link";
import Image from "next/image";
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

const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/shop" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const { count, hydrated } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-brand-900 text-white">
        <div className="container-page flex h-9 items-center justify-center gap-2 text-center text-xs sm:text-sm">
          <Truck className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            Livraison gratuite dès 1 000 MAD · Paiement à la livraison partout au Maroc
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="glass border-b border-brand-100">
        <div className="container-page flex h-18 items-center gap-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/logo.jpeg"
              alt="Filtre Maroc"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover ring-1 ring-brand-100"
              priority
            />
            <span className="hidden font-display text-xl font-extrabold leading-none text-brand-800 sm:block">
              Filtre<span className="text-aqua-500">Maroc</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.label === "Boutique" ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                  {/* dropdown */}
                  <div className="invisible absolute left-0 top-full w-64 translate-y-2 rounded-2xl border border-brand-100 bg-white p-2 opacity-0 shadow-[var(--shadow-soft)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/shop?cat=${c.slug}`}
                        className="block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-brand-50"
                      >
                        <span className="font-semibold text-ink">{c.name}</span>
                        <span className="block text-xs text-ink-soft">
                          {c.tagline}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Search (desktop) */}
          <form
            action="/shop"
            className="ml-auto hidden flex-1 items-center md:flex md:max-w-xs"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                name="q"
                placeholder="Rechercher un filtre..."
                className="h-10 w-full rounded-full border border-brand-100 bg-white pl-9 pr-4 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </form>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100 md:ml-2"
            aria-label="Panier"
          >
            <ShoppingCart className="h-5 w-5" />
            {hydrated && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-aqua-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="border-t border-brand-100 bg-white lg:hidden">
            <div className="container-page flex flex-col gap-1 py-4">
              <form action="/shop" className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  name="q"
                  placeholder="Rechercher..."
                  className="h-11 w-full rounded-full border border-brand-100 pl-9 pr-4 text-sm outline-none focus:border-brand-300"
                />
              </form>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 font-semibold text-ink hover:bg-brand-50"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-brand-100 pt-2">
                <p className="px-4 pb-1 text-xs font-bold uppercase tracking-wide text-brand-400">
                  Catégories
                </p>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?cat=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-brand-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
              <a
                href="tel:0634585463"
                className="mt-2 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 font-semibold text-brand-700"
              >
                <Phone className="h-4 w-4" /> 0634 585 463
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
