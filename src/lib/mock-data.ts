import type { Category } from "@/lib/types";

/* ============================================================
   Site configuration (NOT product data).
   Products & orders now live in the database (Supabase) and are
   managed from the admin. These are fixed config values.
   ============================================================ */

export const CATEGORIES: Category[] = [
  {
    id: "c1",
    slug: "cuisine",
    name: "Filtres de cuisine",
    nameAr: "فلاتر المطبخ",
    tagline: "Osmose inverse sous évier, 5 à 10 étapes",
    icon: "kitchen",
    hue: 205,
  },
  {
    id: "c3",
    slug: "fontaines",
    name: "Fontaines à eau",
    nameAr: "نافورة المياه",
    tagline: "Distributeurs chaud / froid pour bureau & maison",
    icon: "fountain",
    hue: 195,
  },
  {
    id: "c4",
    slug: "semi-industriel",
    name: "Semi-industriel",
    nameAr: "شبه صناعي",
    tagline: "Grand débit 400+ GPD pour cafés, restaurants, hôtels",
    icon: "industrial",
    hue: 212,
  },
  {
    id: "c5",
    slug: "filtres-rechange",
    name: "Filtres de rechange",
    nameAr: "فلاتر بديلة",
    tagline: "Cartouches & membranes pour tous nos systèmes",
    icon: "cartridge",
    hue: 188,
  },
  {
    id: "c6",
    slug: "pieces",
    name: "Pièces & accessoires",
    nameAr: "قطع الغيار",
    tagline: "Pompes, robinets, réservoirs, housings et accessoires",
    icon: "parts",
    hue: 218,
  },
];

/** Major Moroccan cities for the checkout dropdown. */
export const MOROCCAN_CITIES: string[] = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Salé",
  "Mohammedia",
  "El Jadida",
  "Béni Mellal",
  "Nador",
  "Khouribga",
  "Settat",
  "Safi",
  "Larache",
  "Khémisset",
  "Berrechid",
  "Taza",
  "Essaouira",
  "Ouarzazate",
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
