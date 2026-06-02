"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, dirFor, type Locale } from "./config";
import { translate } from "./dictionary";

type TFn = (key: string, vars?: Record<string, string | number>) => string;

type I18nValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: TFn;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale: initial,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initial);

  // keep in sync when the server re-renders with a new cookie locale
  useEffect(() => {
    setLocaleState(initial);
  }, [initial]);

  const setLocale = useCallback(
    (l: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
      setLocaleState(l); // optimistic text update
      router.refresh(); // re-render server components in the new locale
    },
    [router],
  );

  const t = useCallback<TFn>((key, vars) => translate(locale, key, vars), [locale]);

  const value: I18nValue = { locale, dir: dirFor(locale), t, setLocale };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
