"use client";

import { useActionState, useState } from "react";
import { Lock, Mail, LogIn, Eye, EyeOff } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/auth-actions";
import { useI18n } from "@/i18n/i18n-context";

const initial: LoginState = { error: null };

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial);
  const { t } = useI18n();
  const [showPw, setShowPw] = useState(false);

  const input =
    "h-11 w-full rounded-xl border border-line bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-card border border-line bg-white p-8 shadow-soft">
        <div className="text-center">
          <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Filtre<span className="text-brand-600">Maroc</span>
          </span>
          <p className="mt-1 text-sm text-ink-soft">{t("admin.login.subtitle")}</p>
        </div>

        <form action={action} className="mt-6 space-y-4">
          {state.error && (
            <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
              {state.error}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">{t("admin.login.email")}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                name="email"
                type="email"
                required
                placeholder="admin@filtremaroc.ma"
                className={input}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              {t("admin.login.password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                name="password"
                type={showPw ? "text" : "password"}
                required
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-11 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? t("common.hidePassword") : t("common.showPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-ink"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-600 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" /> {pending ? t("admin.login.submitting") : t("admin.login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
