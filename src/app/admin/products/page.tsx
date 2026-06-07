import Link from "next/link";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { getCategoryBySlug } from "@/lib/mock-data";
import { getProducts } from "@/lib/data";
import { deleteProductAction } from "@/lib/product-actions";
import { ProductPhoto } from "@/components/product-photo";
import { formatMAD } from "@/lib/utils";
import { getT } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { t } = await getT();
  const products = await getProducts();
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{t("admin.productsPage.title")}</h1>
          <p className="text-sm text-ink-soft">
            {t("admin.productsPage.subtitle", { count: products.length })}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> {t("admin.productsPage.addProduct")}
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Search bar */}
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              placeholder={t("admin.productsPage.searchPlaceholder")}
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-brand-300 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3 font-semibold">{t("admin.productsPage.colProduct")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.productsPage.colCategory")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.productsPage.colPrice")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.productsPage.colStock")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.productsPage.colStatus")}</th>
                <th className="px-5 py-3 text-right font-semibold">{t("admin.productsPage.colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const cat = getCategoryBySlug(p.categorySlug);
                return (
                  <tr
                    key={p.id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                          <ProductPhoto
                            src={p.images[0]}
                            alt={p.name}
                            hue={p.hue}
                            sizes="44px"
                            className="p-0.5"
                          />
                        </div>
                        <div className="min-w-0">
                          <p dir="auto" className="line-clamp-1 font-medium text-ink">{p.name}</p>
                          <p className="text-xs text-ink-soft">
                            {p.stages ? t("admin.productsPage.stages", { count: p.stages }) : p.capacity ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{cat?.name}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-ink">
                        {formatMAD(p.price)}
                      </span>
                      {p.oldPrice && (
                        <span className="ml-1 text-xs text-ink-soft line-through">
                          {formatMAD(p.oldPrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          p.stock <= 10
                            ? "font-semibold text-amber-600"
                            : "text-ink"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.inStock ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {t("admin.productsPage.inStock")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                          {t("admin.productsPage.outOfStock")}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-600"
                          aria-label={t("admin.productsPage.edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={deleteProductAction.bind(null, p.id)}>
                          <button
                            type="submit"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-rose-50 hover:text-rose-500"
                            aria-label={t("admin.productsPage.delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="py-16 text-center text-sm text-ink-soft">
            {t("admin.productsPage.empty")}
          </div>
        )}
      </div>
    </div>
  );
}
