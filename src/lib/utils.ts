import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Moroccan Dirhams, e.g. 1900 -> "1 900 MAD". */
export function formatMAD(value: number): string {
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(value) + " MAD";
}

/** Discount percentage from old/new price. */
export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** The store operates in Morocco — pin all date formatting to its timezone. */
export const TZ = "Africa/Casablanca";

/** Short, human date, e.g. "12 mai 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-MA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}
