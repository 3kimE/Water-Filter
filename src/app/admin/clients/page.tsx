import { Users } from "lucide-react";

export default function AdminClientsPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Clients</h1>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Users className="h-7 w-7" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-ink">
          Gestion des clients
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Bientôt disponible — historique d&apos;achat et fidélité.
        </p>
      </div>
    </div>
  );
}
