import { Phone, MessageCircle, MessageSquare, Check } from "lucide-react";
import { getMessages } from "@/lib/data";
import { markMessageReadAction } from "@/lib/contact-actions";
import { formatDate } from "@/lib/utils";
import { getT } from "@/i18n/server";

export const dynamic = "force-dynamic";

/** Turn a Moroccan local number (06.., 07..) into wa.me international format. */
function waNumber(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("212")) return d;
  if (d.startsWith("0")) return "212" + d.slice(1);
  return d;
}

export default async function AdminMessagesPage() {
  const { t } = await getT();
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">{t("admin.messages.title")}</h1>
        <p className="text-sm text-ink-soft">
          {t("admin.messages.subtitle")}
          {unread > 0 && (
            <span className="ms-2 inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
              {t(unread > 1 ? "admin.messages.unreadBadge.plural" : "admin.messages.unreadBadge.one", { count: unread })}
            </span>
          )}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <MessageSquare className="h-7 w-7" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-ink">
            {t("admin.messages.empty.title")}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {t("admin.messages.empty.body")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 shadow-sm transition-colors ${
                m.read
                  ? "border-slate-200 bg-white"
                  : "border-brand-200 bg-brand-50/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-display font-semibold text-ink" dir="auto">
                    {!m.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden />
                    )}
                    {m.name}
                  </p>
                  <a
                    href={`tel:${m.phone.replace(/\s/g, "")}`}
                    className="mt-0.5 flex items-center gap-1 text-sm text-ink-soft hover:text-brand-600"
                  >
                    <Phone className="h-3.5 w-3.5" /> {m.phone}
                  </a>
                </div>
                <span className="text-xs text-ink-soft">{formatDate(m.createdAt)}</span>
              </div>

              <p
                className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 text-sm text-ink"
                dir="auto"
              >
                {m.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={`https://wa.me/${waNumber(m.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={`tel:${m.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-slate-50"
                >
                  <Phone className="h-4 w-4" /> {t("admin.messages.call")}
                </a>
                {!m.read && (
                  <form action={markMessageReadAction.bind(null, m.id)} className="ms-auto">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                    >
                      <Check className="h-4 w-4" /> {t("admin.messages.markRead")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
