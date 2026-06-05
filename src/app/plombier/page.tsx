import { Phone, MessageCircle, MapPin, CalendarClock, Wrench } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getPlombierJobs } from "@/lib/data";
import { formatMAD } from "@/lib/utils";

export const dynamic = "force-dynamic";

function waNumber(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("212")) return d;
  if (d.startsWith("0")) return "212" + d.slice(1);
  return d;
}

function formatWhen(iso?: string): string {
  if (!iso) return "À planifier";
  return new Date(iso).toLocaleString("fr-MA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PlombierPage() {
  const session = await getSession();
  const jobs = session?.email ? await getPlombierJobs(session.email) : [];

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Wrench className="h-7 w-7" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-ink">
          Aucune installation pour le moment
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Vous serez notifié dès qu&apos;une installation vous est assignée.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {jobs.map((o) => {
        const tel = o.phone.replace(/\s/g, "");
        return (
          <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-display font-bold text-ink">{o.id}</p>
              <span className="font-display text-lg font-extrabold text-brand-700">
                {formatMAD(o.total)}
              </span>
            </div>

            <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800">
              <CalendarClock className="h-4 w-4 shrink-0" /> {formatWhen(o.installDate)}
            </p>

            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium text-ink" dir="auto">{o.customerName}</p>
              <p className="flex items-center gap-1.5 text-ink-soft">
                <MapPin className="h-4 w-4 shrink-0" /> <span dir="auto">{o.address}, {o.city}</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {o.items.map((it, i) => (
                  <span key={i} className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-ink" dir="auto">
                    {it.name} × {it.qty}
                  </span>
                ))}
              </div>
              {o.confirmationNote && (
                <p className="pt-1 text-xs text-ink-soft" dir="auto">📝 {o.confirmationNote}</p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={`tel:${tel}`}
                className="flex items-center justify-center gap-2 rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                <Phone className="h-4 w-4" /> Appeler
              </a>
              <a
                href={`https://wa.me/${waNumber(o.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
