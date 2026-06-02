import { cn } from "@/lib/utils";

type Tone = "sale" | "best" | "new" | "neutral" | "success";

const tones: Record<Tone, string> = {
  sale: "bg-rose-500 text-white",
  best: "bg-amber-400 text-amber-950",
  new: "bg-aqua-400 text-brand-950",
  neutral: "bg-brand-50 text-brand-700",
  success: "bg-emerald-500 text-white",
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
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
