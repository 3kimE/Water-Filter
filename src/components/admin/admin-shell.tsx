"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ExternalLink,
  Menu,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Produits", href: "/admin/products", icon: Package },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingBag },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Paramètres", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center px-5 py-5">
        <div className="leading-tight">
          <p className="font-display text-lg font-extrabold tracking-tight text-ink">
            Filtre<span className="text-brand-600">Maroc</span>
          </p>
          <p className="text-xs text-ink-soft">Espace Admin</p>
        </div>
      </Link>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-soft hover:bg-neutral-100 hover:text-ink",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-neutral-100 hover:text-ink"
        >
          <ExternalLink className="h-5 w-5" />
          Voir le site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-line bg-white">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-white/80 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-neutral-100 lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-neutral-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                A
              </div>
              <div className="hidden text-sm leading-tight sm:block">
                <p className="font-semibold text-ink">Admin</p>
                <p className="text-xs text-ink-soft">Filtre Maroc</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
