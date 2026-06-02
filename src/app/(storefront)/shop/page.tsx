import Link from "next/link";
import { SlidersHorizontal, PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORIES, PRODUCTS, getCategoryBySlug } from "@/lib/mock-data";
import type { Product } from "@/lib/types";

export const metadata = { title: "Boutique" };

type SP = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

const SORTS = [
  { key: "", label: "Pertinence" },
  { key: "price-asc", label: "Prix croissant" },
  { key: "price-desc", label: "Prix décroissant" },
  { key: "rating", label: "Mieux notés" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const params = await searchParams;
  const cat = one(params.cat);
  const q = one(params.q).toLowerCase();
  const sort = one(params.sort);

  const category = cat ? getCategoryBySlug(cat) : undefined;

  let list: Product[] = [...PRODUCTS];
  if (cat) list = list.filter((p) => p.categorySlug === cat);
  if (q)
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q),
    );
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

  const buildHref = (next: Partial<{ cat: string; sort: string; q: string }>) => {
    const sp = new URLSearchParams();
    const c = next.cat !== undefined ? next.cat : cat;
    const s = next.sort !== undefined ? next.sort : sort;
    const query = next.q !== undefined ? next.q : q;
    if (c) sp.set("cat", c);
    if (s) sp.set("sort", s);
    if (query) sp.set("q", query);
    const str = sp.toString();
    return str ? `/shop?${str}` : "/shop";
  };

  return (
    <>
      {/* Page header */}
      <div className="hero-water border-b border-brand-100">
        <div className="container-page py-10">
          <nav className="text-sm text-ink-soft">
            <Link href="/" className="hover:text-brand-600">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-ink">
              {category ? category.name : "Boutique"}
            </span>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            {category ? category.name : "Tous nos produits"}
          </h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            {category ? category.tagline : "Filtres, fontaines, systèmes semi-industriels et pièces de rechange."}
          </p>
          {q && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-soft">
              <PackageSearch className="h-4 w-4" /> Recherche : “{q}”
            </p>
          )}
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[16rem_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="mb-3 flex items-center gap-2 font-display font-semibold text-ink">
            <SlidersHorizontal className="h-4 w-4 text-brand-500" /> Catégories
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            <Link
              href={buildHref({ cat: "" })}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                !cat
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-brand-100 bg-white text-ink hover:border-brand-200 hover:bg-brand-50"
              }`}
            >
              Tous les produits
            </Link>
            {CATEGORIES.map((c) => {
              const active = c.slug === cat;
              return (
                <Link
                  key={c.slug}
                  href={buildHref({ cat: c.slug })}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-brand-100 bg-white text-ink hover:border-brand-200 hover:bg-brand-50"
                  }`}
                >
                  <CategoryIcon name={c.icon} className="h-4 w-4" />
                  {c.name}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              <strong className="text-ink">{list.length}</strong> produit
              {list.length > 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {SORTS.map((s) => (
                <Link
                  key={s.key}
                  href={buildHref({ sort: s.key })}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    sort === s.key
                      ? "bg-brand-100 text-brand-700"
                      : "text-ink-soft hover:bg-brand-50"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {list.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-brand-200 bg-brand-50/50 py-20 text-center">
              <PackageSearch className="mx-auto h-12 w-12 text-brand-300" />
              <p className="mt-4 font-display text-lg font-semibold text-ink">
                Aucun produit trouvé
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Essayez une autre catégorie ou recherche.
              </p>
              <Link
                href="/shop"
                className="mt-5 inline-block font-semibold text-brand-600 hover:text-brand-700"
              >
                Voir tous les produits
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
