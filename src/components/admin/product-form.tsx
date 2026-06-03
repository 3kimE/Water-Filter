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

const BADGES = ["Best Seller", "Promo", "Nouveau"];

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
    >
      <Save className="h-5 w-5" /> {pending ? "Enregistrement…" : "Enregistrer le produit"}
    </button>
  );
}

export function ProductForm({ product }: { product?: Product | null }) {
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
            {product ? "Modifier le produit" : "Ajouter un produit"}
          </h1>
          <p className="text-sm text-ink-soft">
            Les champs apparaîtront dans la boutique après enregistrement.
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
            <h2 className="font-display font-bold text-ink">Informations générales</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={label}>Nom du produit</label>
                <input name="name" required value={form.name} onChange={(e) => set("name", e.target.value)} className={input} placeholder="Ex : Osmoseur 6 étapes" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Catégorie</label>
                  <select name="category" value={form.category} onChange={(e) => set("category", e.target.value)} className={input}>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Garantie</label>
                  <input name="warranty" value={form.warranty} onChange={(e) => set("warranty", e.target.value)} className={input} placeholder="Ex : 2 ans" />
                </div>
              </div>
              <div>
                <label className={label}>Description courte</label>
                <input name="shortDescription" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className={input} placeholder="Une phrase qui résume le produit" />
              </div>
              <div>
                <label className={label}>Description complète</label>
                <textarea name="description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="Décrivez le produit en détail..." />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">Prix & stock</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={label}>Prix (MAD)</label>
                <input name="price" required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className={input} placeholder="1900" />
              </div>
              <div>
                <label className={label}>Ancien prix</label>
                <input name="oldPrice" type="number" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} className={input} placeholder="2300" />
              </div>
              <div>
                <label className={label}>Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={input} placeholder="20" />
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input type="checkbox" name="inStock" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} className="h-5 w-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-300" />
              <span className="text-sm font-medium text-ink">Produit en stock</span>
            </label>
          </section>

          <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">Caractéristiques</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Nombre d&apos;étapes</label>
                <input name="stages" type="number" value={form.stages} onChange={(e) => set("stages", e.target.value)} className={input} placeholder="6" />
              </div>
              <div>
                <label className={label}>Capacité / débit</label>
                <input name="capacity" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} className={input} placeholder="75 GPD" />
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>Points forts <span className="font-normal text-ink-soft">(un par ligne)</span></label>
              <textarea name="features" value={form.features} onChange={(e) => set("features", e.target.value)} rows={4} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder={"Purification en 6 étapes\nRéservoir 12 litres\nRobinet inox inclus"} />
            </div>
            <div className="mt-4">
              <span className={label}>Étiquettes</span>
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
            <h2 className="font-display font-bold text-ink">Photos</h2>
            <label className="mt-4 flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:border-brand-400">
              {previewImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewImg} alt="aperçu" className="h-full w-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center text-ink-soft">
                  <ImagePlus className="h-9 w-9" />
                  <span className="mt-2 text-sm font-medium">Cliquez pour ajouter</span>
                  <span className="text-xs">JPG, PNG — plusieurs possibles</span>
                </div>
              )}
              <input type="file" name="images" accept="image/*" multiple onChange={onFiles} className="hidden" />
            </label>
            {existingImages.length > 0 && newPreviews.length === 0 && (
              <p className="mt-2 text-xs text-ink-soft">
                {existingImages.length} photo(s) actuelle(s) conservée(s). Choisir de nouvelles photos les ajoutera.
              </p>
            )}
            <div className="mt-4">
              <label className={label}>Teinte (aperçu sans photo)</label>
              <input type="range" name="hue" min={180} max={230} value={form.hue} onChange={(e) => set("hue", Number(e.target.value))} className="w-full accent-brand-600" />
            </div>
          </section>

          {/* Live preview */}
          <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-display font-bold text-ink">Aperçu boutique</h2>
            <div className="overflow-hidden rounded-card border border-line">
              <div className="relative aspect-square bg-white">
                {previewImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewImg} alt="" className="h-full w-full object-contain p-3" />
                ) : (
                  <ProductPhoto src={undefined} alt={form.name || "Produit"} hue={form.hue} className="h-full w-full" />
                )}
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  {form.badges.map((b) => (
                    <Badge key={b} tone={toneForBadge(b)}>{b}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-3">
                <p dir="auto" className="line-clamp-1 font-display font-semibold text-ink">
                  {form.name || "Nom du produit"}
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
