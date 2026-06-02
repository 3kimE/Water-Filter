export const LOCALES = ["fr", "ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "fm_locale";

export const LOCALE_META: Record<
  Locale,
  { label: string; flag: string; dir: "ltr" | "rtl" }
> = {
  fr: { label: "Français", flag: "🇫🇷", dir: "ltr" },
  ar: { label: "العربية", flag: "🇲🇦", dir: "rtl" },
  en: { label: "English", flag: "🇬🇧", dir: "ltr" },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return LOCALE_META[locale].dir;
}
