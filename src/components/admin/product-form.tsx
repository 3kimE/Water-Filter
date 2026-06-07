"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import { ProductPhoto } from "@/components/product-photo";
import { StarRating } from "@/components/star-rating";
import { Badge, toneForBadge } from "@/components/ui/badge";
import { formatMAD } from "@/lib/utils";
import { saveProductAction } from "@/lib/product-actions";
import type { Product } from "@/lib/types";
import { useI18n } from "@/i18n/i18n-context";

const BADGES = ["Best Seller", "Promo", "Nouveau"];

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
    >
      <Save className="h-5 w-5" /> {pending ? t("admin.productForm.saving") : t("admin.productForm.save")}
    </button>
  );
}

export function ProductForm({ product }: { product?: Product | null }) {
  const { t } = useI18n();
  const action = saveProductAction.bind(null, product?.id ?? null);
  const existingImages = product?.images ?? [];

  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.categorySlug ?? CATEGORIES[0].slug,
    price: product?.price?.toString() ?? "",
    oldPrice: product?.oldPrice?.toString() ?? "",
    stages: product?.stages?.toString() ?? "",
    capacity: product?.capacity ?? "",
    warranty: product?.warranty ?? "",
    stock: product?.stock?.toString() ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    features: product?.features?.join("\n") ?? "",
    badges: product?.badges ?? [],
    inStock: product?.inStock ?? true,
    allowBackorder: product?.allowBackorder ?? false,
    hue: product?.hue ?? 205,
  });
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function toggleBadge(b: string) {
    setForm((f) => ({
      ...f,
      badges: f.badges.includes(b) ? f.badges.filter((x) => x !== b) : [...f.badges, b],
    }));
  }
  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  const previewImg = newPreviews[0] ?? existingImages[0];
  const priceNum = Number(form.price) || 0;
  const oldNum = Number(form.oldPrice) || 0;

  return (
    <form action={action}>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-neutral-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            {product ? t("admin.productForm.editTitle") : t("admin.productForm.addTitle")}
          </h1>
          <p className="text-sm text-ink-soft">
            {t("admin.productForm.subtitle")}
          </p>
        </div>
      </div>

      {/* hidden fields */}
      <input type="hidden" name="existingImages" value={JSON.stringify(existingImages)} />
      {product && <input type="hidden" name="slug" value={product.slug} />}

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Main */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">{t("admin.productForm.generalInfo")}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={label}>{t("admin.productForm.nameLabel")}</label>
                <input name="name" required value={form.name} onChange={(e) => set("name", e.target.value)} className={input} placeholder={t("admin.productForm.namePlaceholder")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>{t("admin.productForm.categoryLabel")}</label>
                  <select name="category" value={form.category} onChange={(e) => set("category", e.target.value)} className={input}>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>{t("admin.productForm.warrantyLabel")}</label>
                  <input name="warranty" value={form.warranty} onChange={(e) => set("warranty", e.target.value)} className={input} placeholder={t("admin.productForm.warrantyPlaceholder")} />
                </div>
              </div>
              <div>
                <label className={label}>{t("admin.productForm.shortDescriptionLabel")}</label>
                <input name="shortDescription" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className={input} placeholder={t("admin.productForm.shortDescriptionPlaceholder")} />
              </div>
              <div>
                <label className={label}>{t("admin.productForm.descriptionLabel")}</label>
                <textarea name="description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder={t("admin.productForm.descriptionPlaceholder")} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">{t("admin.productForm.priceStock")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={label}>{t("admin.productForm.priceLabel")}</label>
                <input name="price" required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className={input} placeholder="1900" />
              </div>
              <div>
                <label className={label}>{t("admin.productForm.oldPriceLabel")}</label>
                <input name="oldPrice" type="number" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} className={input} placeholder="2300" />
              </div>
              <div>
                <label className={label}>{t("admin.productForm.stockLabel")}</label>
                <input name="stock" type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={input} placeholder="20" />
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input type="checkbox" name="inStock" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} className="h-5 w-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-300" />
              <span className="text-sm font-medium text-ink">{t("admin.productForm.inStockLabel")}</span>
            </label>
            <label className="mt-3 flex cursor-pointer items-start gap-3">
              <input type="checkbox" name="allowBackorder" checked={form.allowBackorder} onChange={(e) => set("allowBackorder", e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-300" />
              <span className="text-sm text-ink">
                <span className="font-medium">{t("admin.productForm.allowBackorderLabel")}</span>
                <span className="block text-xs text-ink-soft">
                  {t("admin.productForm.allowBackorderHint")}
                </span>
              </span>
            </label>
          </section>

          <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">{t("admin.productForm.specifications")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>{t("admin.productForm.stagesLabel")}</label>
                <input name="stages" type="number" value={form.stages} onChange={(e) => set("stages", e.target.value)} className={input} placeholder="6" />
              </div>
              <div>
                <label className={label}>{t("admin.productForm.capacityLabel")}</label>
                <input name="capacity" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} className={input} placeholder="75 GPD" />
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>{t("admin.productForm.featuresLabel")} <span className="font-normal text-ink-soft">{t("admin.productForm.featuresHint")}</span></label>
              <textarea name="features" value={form.features} onChange={(e) => set("features", e.target.value)} rows={4} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder={t("admin.productForm.featuresPlaceholder")} />
            </div>
            <div className="mt-4">
              <span className={label}>{t("admin.productForm.badgesLabel")}</span>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => {
                  const active = form.badges.includes(b);
                  return (
                    <label key={b} className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line text-ink-soft hover:border-brand-300"}`}>
                      <input type="checkbox" name="badges" value={b} checked={active} onChange={() => toggleBadge(b)} className="sr-only" />
                      {b}
                    </label>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Right: image + preview + save */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">{t("admin.productForm.photos")}</h2>
            <label className="mt-4 flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:border-brand-400">
              {previewImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewImg} alt={t("admin.productForm.previewAlt")} className="h-full w-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center text-ink-soft">
                  <ImagePlus className="h-9 w-9" />
                  <span className="mt-2 text-sm font-medium">{t("admin.productForm.clickToAdd")}</span>
                  <span className="text-xs">{t("admin.productForm.fileTypes")}</span>
                </div>
              )}
              <input type="file" name="images" accept="image/*" multiple onChange={onFiles} className="hidden" />
            </label>
            {existingImages.length > 0 && newPreviews.length === 0 && (
              <p className="mt-2 text-xs text-ink-soft">
                {t("admin.productForm.existingPhotosNote", { count: existingImages.length })}
              </p>
            )}
            <div className="mt-4">
              <label className={label}>{t("admin.productForm.hueLabel")}</label>
              <input type="range" name="hue" min={180} max={230} value={form.hue} onChange={(e) => set("hue", Number(e.target.value))} className="w-full accent-brand-600" />
            </div>
          </section>

          {/* Live preview */}
          <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-display font-bold text-ink">{t("admin.productForm.shopPreview")}</h2>
            <div className="overflow-hidden rounded-card border border-line">
              <div className="relative aspect-square bg-white">
                {previewImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewImg} alt="" className="h-full w-full object-contain p-3" />
                ) : (
                  <ProductPhoto src={undefined} alt={form.name || t("admin.productForm.productFallback")} hue={form.hue} className="h-full w-full" />
                )}
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  {form.badges.map((b) => (
                    <Badge key={b} tone={toneForBadge(b)}>{b}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-3">
                <p dir="auto" className="line-clamp-1 font-display font-semibold text-ink">
                  {form.name || t("admin.productForm.nameFallback")}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <StarRating value={5} size={13} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold text-ink">{formatMAD(priceNum)}</span>
                  {oldNum > priceNum && (
                    <span className="text-xs text-ink-soft line-through">{formatMAD(oldNum)}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <SubmitButton />
        </aside>
      </div>
    </form>
  );
}
