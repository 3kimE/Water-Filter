import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";

/** Minimal top-bar shell for the confirmateur / plombier areas. */
export function StaffShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur lg:px-8">
        <Link href="/" className="leading-tight">
          <p className="font-display text-lg font-extrabold tracking-tight text-ink">
            Filtre<span className="text-brand-600">Maroc</span>
          </p>
          <p className="text-xs text-ink-soft">{subtitle}</p>
        </Link>
        <form action={logoutAction} className="ms-auto">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-5xl p-4 lg:p-8">
        <h1 className="mb-6 font-display text-2xl font-bold text-ink">{title}</h1>
        {children}
      </main>
    </div>
  );
}
