import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ProductView } from "@/components/product-view";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/star-rating";
import {
  PRODUCTS,
  getProductBySlug,
  getCategoryBySlug,
  getRelatedProducts,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { getT } from "@/i18n/server";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { t } = await getT();
  const product = getProductBySlug(slug);
  return { title: product ? product.name : t("product.meta.fallback") };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t } = await getT();
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const related = getRelatedProducts(product);

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-600">{t("nav.home")}</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-600">{t("nav.shop")}</Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/shop?cat=${category.slug}`} className="hover:text-brand-600">
              {t(`cat.${category.slug}.name`)}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <ProductView product={product} />

      {/* Description + Specs */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">{t("product.description")}</h2>
          <p dir="auto" className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">
            {product.description}
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">{t("product.specs")}</h2>
          <dl className="mt-4 overflow-hidden rounded-card border border-line">
            {product.specs.map((s, i) => (
              <div
                key={s.label}
                className={`flex justify-between px-4 py-3 text-sm ${
                  i % 2 === 0 ? "bg-brand-50/50" : "bg-white"
                }`}
              >
                <dt className="text-ink-soft">{s.label}</dt>
                <dd className="font-semibold text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold text-ink">
            {t("product.reviews.title")}
          </h2>
          <div className="flex items-center gap-2">
            <StarRating value={product.rating} size={18} />
            <span className="font-semibold text-ink">{product.rating}</span>
            <span className="text-ink-soft">({product.reviewCount})</span>
          </div>
        </div>

        {product.reviews.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-card border border-line bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <StarRating value={r.rating} size={15} />
                  <span className="text-xs text-ink-soft">{formatDate(r.date)}</span>
                </div>
                <h3 className="mt-2 font-display font-semibold text-ink">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">“{r.body}”</p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="font-semibold text-ink">{r.author}</span>
                  <span className="text-ink-soft">· {r.city}</span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {t("product.reviews.verified")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-ink-soft">
            {t("product.reviews.empty")}
          </p>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-ink">
            {t("product.related")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
