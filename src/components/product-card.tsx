"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductPhoto } from "./product-photo";
import { Badge, toneForBadge } from "./ui/badge";
import { StarRating } from "./star-rating";
import { useCart } from "@/context/cart-context";
import { cn, formatMAD, discountPercent } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-context";
import { translateBadge } from "@/i18n/dictionary";

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useI18n();
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
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-soft"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <ProductPhoto
          src={product.images[0]}
          alt={product.name}
          hue={product.hue}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="p-3 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute start-3 top-3 z-10 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <Badge key={b} tone={toneForBadge(b)}>
              {translateBadge(locale, b)}
            </Badge>
          ))}
          {off && <Badge tone="sale">-{off}%</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.stages && (
          <span className="mb-1 text-xs font-medium text-ink-soft">
            {t("product.stagesShort", { n: product.stages })}
            {product.capacity ? ` · ${product.capacity}` : ""}
          </span>
        )}
        <h3
          dir="auto"
          className="line-clamp-2 font-display text-[15px] font-semibold text-ink"
        >
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5">
          <StarRating value={product.rating} size={14} />
          <span className="text-xs text-ink-soft">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="leading-tight">
            <div className="text-lg font-semibold text-ink">
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
            aria-label={t("common.addToCart")}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-white transition-all active:scale-90",
              added ? "bg-emerald-500" : "bg-brand-600 hover:bg-brand-700",
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
