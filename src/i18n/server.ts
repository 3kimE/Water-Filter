import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, dirFor, isLocale, type Locale } from "./config";
import { translate } from "./dictionary";

/** Read the active locale from the cookie (server components). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Get a translator bound to the active locale (server components). */
export async function getT() {
  const locale = await getLocale();
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, vars);
  return { t, locale, dir: dirFor(locale) };
}
