"use client";

import { useActionState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { updateAdminAccountAction, type AccountState } from "@/lib/account-actions";

const initial: AccountState = { error: null };

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function AdminAccountForm({ currentEmail }: { currentEmail: string }) {
  const [state, action, pending] = useActionState(updateAdminAccountAction, initial);

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 font-display font-bold text-ink">
        <ShieldCheck className="h-5 w-5 text-brand-600" /> Mon compte
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Email de connexion actuel : <b className="text-ink">{currentEmail}</b>
      </p>

      <form action={action} className="mt-4 space-y-4">
        {state.error && (
          <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
            {state.error}
          </div>
        )}
        {state.ok && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" /> Compte mis à jour ✓
          </div>
        )}

        <div>
          <label className={label}>Nouvel email (laisser vide pour ne pas changer)</label>
          <input name="newEmail" type="email" placeholder={currentEmail} className={input} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Nouveau mot de passe</label>
            <input name="newPassword" type="password" placeholder="••••••••" className={input} />
          </div>
          <div>
            <label className={label}>Confirmer le mot de passe</label>
            <input name="confirmPassword" type="password" placeholder="••••••••" className={input} />
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <label className={label}>
            Mot de passe actuel <span className="font-normal text-ink-soft">(obligatoire pour confirmer)</span>
          </label>
          <input name="currentPassword" type="password" required placeholder="••••••••" className={`${input} max-w-xs`} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : "Mettre à jour le compte"}
        </button>
      </form>
    </section>
  );
}
