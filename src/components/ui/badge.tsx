import { cn } from "@/lib/utils";

type Tone = "sale" | "best" | "new" | "neutral" | "success";

const tones: Record<Tone, string> = {
  sale: "bg-rose-50 text-rose-600",
  best: "bg-amber-50 text-amber-700",
  new: "bg-brand-50 text-brand-700",
  neutral: "bg-neutral-100 text-neutral-600",
  success: "bg-emerald-50 text-emerald-700",
};

/** Map a French badge label to a visual tone. */
export function toneForBadge(label: string): Tone {
  const l = label.toLowerCase();
  if (l.includes("promo")) return "sale";
  if (l.includes("best")) return "best";
  if (l.includes("nouveau")) return "new";
  return "neutral";
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
