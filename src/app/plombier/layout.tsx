import Link from "next/link";
import { LogOut, ClipboardList, User } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

export default function PlombierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Top app bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur">
        <Link href="/plombier" className="leading-tight">
          <span className="block font-display text-base font-extrabold tracking-tight text-ink">
            Filtre<span className="text-brand-600">Maroc</span>
          </span>
          <span className="block text-[11px] text-ink-soft">Espace Plombier</span>
        </Link>
        <h1 className="ms-auto font-display text-base font-bold text-ink">Mes installations</h1>
      </header>

      <main className="mx-auto max-w-xl p-4">{children}</main>

      {/* Bottom nav (mobile app feel) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white">
        <span className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-brand-600">
          <ClipboardList className="h-5 w-5" />
          <span className="text-[11px] font-semibold">Missions</span>
        </span>
        <form action={logoutAction} className="flex-1">
          <button type="submit" className="flex w-full flex-col items-center gap-0.5 py-2.5 text-ink-soft">
            <User className="h-5 w-5" />
            <span className="text-[11px] font-medium">Déconnexion</span>
          </button>
        </form>
      </nav>
    </div>
  );
}
