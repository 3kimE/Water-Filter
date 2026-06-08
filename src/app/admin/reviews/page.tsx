import { getReviewsForAdmin } from "@/lib/data";
import { ReviewsManager } from "@/components/admin/reviews-manager";
import { getT } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const { t } = await getT();
  const reviews = await getReviewsForAdmin();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">{t("admin.reviews.title")}</h1>
        <p className="text-sm text-ink-soft">{t("admin.reviews.subtitle")}</p>
      </div>
      <ReviewsManager reviews={reviews} />
    </div>
  );
}
