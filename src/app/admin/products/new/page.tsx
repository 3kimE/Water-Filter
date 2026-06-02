"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Check,
  Save,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import { ProductImage } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";
import { Badge, toneForBadge } from "@/components/ui/badge";
import { formatMAD } from "@/lib/utils";

const BADGES = ["Best Seller", "Promo", "Nouveau"];

export default function NewProductPage() {
  const [saved, setSaved] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0].slug,
    price: "",
    oldPrice: "",
    stages: "",
    capacity: "",
    warranty: "",
    stock: "",
    shortDescription: "",
    description: "",
    features: "",
    badges: [] as string[],
    inStock: true,
    hue: 205,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleBadge(b: string) {
    setForm((f) => ({
      ...f,
      badges: f.badges.includes(b)
        ? f.badges.filter((x) => x !== b)
        : [...f.badges, b],
    }));
  }

  function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const label = "mb-1.5 block text-sm font-semibold text-ink";
  const input =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100";
  const priceNum = Number(form.price) || 0;
  const oldNum = Number(form.oldPrice) || 0;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Ajouter un produit
          </h1>
          <p className="text-sm text-ink-soft">
            Remplissez les détails — ils apparaîtront dans la boutique.
          </p>
        </div>
      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <Check className="h-5 w-5" />
          Produit enregistré ! (démo — la sauvegarde réelle viendra avec le backend)
        </div>
      )}

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Main form */}
        <div className="space-y-6">
          {/* General */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">Informations générales</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={label}>Nom du produit</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={input}
                  placeholder="Ex : AQUABO 6-ST"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className={input}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Garantie</label>
                  <input
                    value={form.warranty}
                    onChange={(e) => set("warranty", e.target.value)}
                    className={input}
                    placeholder="Ex : 2 ans"
                  />
                </div>
              </div>
              <div>
                <label className={label}>Description courte</label>
                <input
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  className={input}
                  placeholder="Une phrase qui résume le produit"
                />
              </div>
              <div>
                <label className={label}>Description complète</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                  placeholder="Décrivez le produit en détail..."
                />
              </div>
            </div>
          </section>

          {/* Pricing & stock */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">Prix & stock</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={label}>Prix (MAD)</label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={input}
                  placeholder="1900"
                />
              </div>
              <div>
                <label className={label}>Ancien prix</label>
                <input
                  type="number"
                  value={form.oldPrice}
                  onChange={(e) => set("oldPrice", e.target.value)}
                  className={input}
                  placeholder="2300"
                />
              </div>
              <div>
                <label className={label}>Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  className={input}
                  placeholder="38"
                />
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => set("inStock", e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-brand-500 focus:ring-brand-300"
              />
              <span className="text-sm font-medium text-ink">Produit en stock</span>
            </label>
          </section>

          {/* Specs */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">Caractéristiques</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Nombre d&apos;étapes</label>
                <input
                  type="number"
                  value={form.stages}
                  onChange={(e) => set("stages", e.target.value)}
                  className={input}
                  placeholder="6"
                />
              </div>
              <div>
                <label className={label}>Capacité / débit</label>
                <input
                  value={form.capacity}
                  onChange={(e) => set("capacity", e.target.value)}
                  className={input}
                  placeholder="75 GPD"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>
                Points forts <span className="font-normal text-ink-soft">(un par ligne)</span>
              </label>
              <textarea
                value={form.features}
                onChange={(e) => set("features", e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                placeholder={"Purification en 6 étapes\nRéservoir 12 litres\nRobinet inox inclus"}
              />
            </div>
            <div className="mt-4">
              <label className={label}>Étiquettes</label>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => {
                  const active = form.badges.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBadge(b)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-slate-200 text-ink-soft hover:border-brand-300"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Right column: image + preview + save */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display font-bold text-ink">Image</h2>
            <label className="mt-4 flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-brand-400">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="aperçu" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-ink-soft">
                  <ImagePlus className="h-9 w-9" />
                  <span className="mt-2 text-sm font-medium">Cliquez pour ajouter</span>
                  <span className="text-xs">JPG, PNG (démo)</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={onImage} className="hidden" />
            </label>

            <div className="mt-4">
              <label className={label}>Teinte (aperçu sans photo)</label>
              <input
                type="range"
                min={180}
                max={230}
                value={form.hue}
                onChange={(e) => set("hue", Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
          </section>

          {/* Live preview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-display font-bold text-ink">Aperçu boutique</h2>
            <div className="overflow-hidden rounded-card border border-brand-100">
              <div className="relative aspect-square">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ProductImage
                    name={form.name || "Produit"}
                    hue={form.hue}
                    showName={false}
                    className="h-full w-full"
                  />
                )}
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  {form.badges.map((b) => (
                    <Badge key={b} tone={toneForBadge(b)}>{b}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-3">
                <p className="line-clamp-1 font-display font-semibold text-ink">
                  {form.name || "Nom du produit"}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <StarRating value={5} size={13} />
                  <span className="text-xs text-ink-soft">(0)</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-bold text-brand-700">
                    {formatMAD(priceNum)}
                  </span>
                  {oldNum > priceNum && (
                    <span className="text-xs text-ink-soft line-through">
                      {formatMAD(oldNum)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 font-semibold text-white shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5 hover:bg-brand-600"
          >
            <Save className="h-5 w-5" /> Enregistrer le produit
          </button>
        </aside>
      </form>
    </div>
  );
}
