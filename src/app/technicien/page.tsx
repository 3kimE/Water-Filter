import { Wrench } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getPlombierJobs, getActiveInstalls } from "@/lib/data";
import { PlombierJobCard } from "@/components/staff/plombier-job-card";
import { getT } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function PlombierPage() {
  const session = await getSession();
  const { t } = await getT();
  // The plombier sees only his own jobs; the admin sees every active install.
  const jobs =
    session?.role === "plombier" && session?.email
      ? await getPlombierJobs(session.email)
      : await getActiveInstalls();

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Wrench className="h-7 w-7" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-ink">
          {t("tech.empty.title")}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          {t("tech.empty.subtitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      {jobs.map((o) => (
        <PlombierJobCard key={o.id} order={o} />
      ))}
    </div>
  );
}
