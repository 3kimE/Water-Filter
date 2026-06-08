"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, Send } from "lucide-react";
import { submitReviewAction } from "@/lib/review-actions";
import { useI18n } from "@/i18n/i18n-context";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId, productSlug }: { productId: string; productSlug: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [hp, setHp] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError(t("product.reviews.errorGeneric"));
      return;
    }
    startTransition(async () => {
      const res = await submitReviewAction({ productId, productSlug, name, rating, comment, hp });
      if (res.ok) {
        setDone(true);
        router.refresh();
      } else {
        setError(res.error === "RATE_LIMIT" ? t("product.reviews.rateLimit") : t("product.reviews.errorGeneric"));
      }
    });
  }

  if (done) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-card border border-emerald-200 bg-emerald-50 p-5">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-semibold text-emerald-800">{t("product.reviews.successTitle")}</p>
          <p className="text-sm text-emerald-700">{t("product.reviews.successText")}</p>
        </div>
      </div>
    );
  }

  const input =
    "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={submit} className="mt-6 rounded-card border border-line bg-white p-5 shadow-soft">
      <h3 className="font-display font-bold text-ink">{t("product.reviews.writeTitle")}</h3>

      <div className="mt-3">
        <label className="mb-1.5 block text-sm font-semibold text-ink">{t("product.reviews.ratingLabel")}</label>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} / 5`}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hover || rating) >= n ? "fill-amber-400 text-amber-400" : "text-neutral-300",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={60}
          placeholder={t("product.reviews.namePlaceholder")}
          className={input}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          maxLength={1000}
          placeholder={t("product.reviews.commentPlaceholder")}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* honeypot — hidden from people, bots fill it */}
      <input
        type="text"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
      />

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        <Send className="h-4 w-4" /> {pending ? t("product.reviews.submitting") : t("product.reviews.submit")}
      </button>
    </form>
  );
}
