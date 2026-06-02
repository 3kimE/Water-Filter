"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "./product-image";
import { Badge, toneForBadge } from "./ui/badge";
import { StarRating } from "./star-rating";
import { useCart } from "@/context/cart-context";
import { cn, formatMAD, discountPercent } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const off = discountPercent(product.price, product.oldPrice);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      hue: product.hue,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-brand-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow"
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductImage
          name={product.name}
          hue={product.hue}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          showName={false}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <Badge key={b} tone={toneForBadge(b)}>
              {b}
            </Badge>
          ))}
          {off && <Badge tone="sale">-{off}%</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.stages && (
          <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
            {product.stages} étapes
            {product.capacity ? ` · ${product.capacity}` : ""}
          </span>
        )}
        <h3 className="line-clamp-2 font-display text-base font-semibold text-ink group-hover:text-brand-600">
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5">
          <StarRating value={product.rating} size={14} />
          <span className="text-xs text-ink-soft">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="leading-tight">
            <div className="text-lg font-bold text-brand-700">
              {formatMAD(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-xs text-ink-soft line-through">
                {formatMAD(product.oldPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAdd}
            aria-label="Ajouter au panier"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md transition-all active:scale-90",
              added ? "bg-emerald-500" : "bg-brand-500 hover:bg-brand-600",
            )}
          >
            {added ? (
              <Check className="h-5 w-5" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
