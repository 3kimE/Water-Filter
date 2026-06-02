import Image from "next/image";
import { ProductImage } from "./product-image";
import { cn } from "@/lib/utils";

/**
 * Renders a real product photo (Shopify CDN) inside a `fill` container.
 * The PARENT must be `relative` with a fixed aspect. Falls back to the
 * branded gradient visual when no photo is available.
 */
export function ProductPhoto({
  src,
  alt,
  hue,
  className,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority,
}: {
  src?: string;
  alt: string;
  hue: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <ProductImage
        name={alt}
        hue={hue}
        showName={false}
        className={cn("h-full w-full", className)}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
