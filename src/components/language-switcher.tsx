"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LOCALES, LOCALE_META } from "@/i18n/config";
import { useI18n } from "@/i18n/i18n-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LOCALE_META[locale];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-50"
        aria-label="Langue"
      >
        <Globe className="h-4 w-4 text-brand-500" />
        <span className="hidden sm:inline">{current.flag}</span>
        <span className="hidden uppercase md:inline">{locale}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-[var(--shadow-soft)]">
          {LOCALES.map((l) => {
            const meta = LOCALE_META[l];
            return (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-brand-50",
                  l === locale ? "font-bold text-brand-700" : "text-ink",
                )}
              >
                <span className="text-base">{meta.flag}</span>
                <span className="flex-1 text-start">{meta.label}</span>
                {l === locale && <Check className="h-4 w-4 text-brand-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
