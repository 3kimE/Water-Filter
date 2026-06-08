"use client";

import { useActionState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { updateAdminAccountAction, type AccountState } from "@/lib/account-actions";
import { useI18n } from "@/i18n/i18n-context";
import { PasswordInput } from "@/components/ui/password-input";

const initial: AccountState = { error: null };

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function AdminAccountForm({ currentEmail }: { currentEmail: string }) {
  const [state, action, pending] = useActionState(updateAdminAccountAction, initial);
  const { t } = useI18n();

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 font-display font-bold text-ink">
        <ShieldCheck className="h-5 w-5 text-brand-600" /> {t("admin.account.title")}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        {t("admin.account.currentEmail")} <b className="text-ink">{currentEmail}</b>
      </p>

      <form action={action} className="mt-4 space-y-4">
        {state.error && (
          <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
            {state.error}
          </div>
        )}
        {state.ok && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" /> {t("admin.account.updated")}
          </div>
        )}

        <div>
          <label className={label}>{t("admin.account.newEmailLabel")}</label>
          <input name="newEmail" type="email" placeholder={currentEmail} className={input} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>{t("admin.account.newPasswordLabel")}</label>
            <PasswordInput name="newPassword" />
          </div>
          <div>
            <label className={label}>{t("admin.account.confirmPasswordLabel")}</label>
            <PasswordInput name="confirmPassword" />
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <label className={label}>
            {t("admin.account.currentPasswordLabel")} <span className="font-normal text-ink-soft">{t("admin.account.currentPasswordHint")}</span>
          </label>
          <PasswordInput name="currentPassword" required className="max-w-xs" />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? t("admin.account.saving") : t("admin.account.submit")}
        </button>
      </form>
    </section>
  );
}
