import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Branded placeholder visual for a product.
 * Generates a clean water-themed gradient from the product hue so the
 * prototype looks consistent. Real photos replace this later — just swap
 * this component for a <next/image> when product photos exist.
 */
export function ProductImage({
  name,
  hue,
  className,
  variant = 0,
  showName = true,
}: {
  name: string;
  hue: number;
  className?: string;
  variant?: number;
  showName?: boolean;
}) {
  const angle = 135 + variant * 30;
  const bg = `radial-gradient(circle at 50% 30%, hsl(${hue} 90% 72%), hsl(${hue} 80% 50%) 42%, hsl(${hue + 12} 78% 30%) 100%)`;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{ background: bg }}
    >
      {/* soft light sweep */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(${angle}deg, rgba(255,255,255,0.35), transparent 45%)`,
        }}
      />
      {/* bubbles */}
      <span className="absolute left-[14%] top-[18%] h-3 w-3 rounded-full bg-white/40 blur-[1px]" />
      <span className="absolute right-[18%] top-[28%] h-5 w-5 rounded-full bg-white/30 blur-[1px]" />
      <span className="absolute left-[28%] bottom-[20%] h-2.5 w-2.5 rounded-full bg-white/40" />

      {/* central droplet glyph */}
      <Droplet
        className="relative h-1/3 w-1/3 text-white/90 drop-shadow-lg"
        strokeWidth={1.5}
        fill="rgba(255,255,255,0.18)"
      />

      {showName && (
        <span className="absolute bottom-3 left-0 right-0 px-3 text-center text-xs font-semibold uppercase tracking-wider text-white/90">
          {name}
        </span>
      )}
    </div>
  );
}
