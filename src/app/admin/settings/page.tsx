import { getSettings } from "@/lib/data";
import { updateSettingsAction } from "@/lib/settings-actions";
import { getSession } from "@/lib/auth";
import { AdminAccountForm } from "@/components/admin/account-form";
import { getT } from "@/i18n/server";

export const dynamic = "force-dynamic";

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
const card = "rounded-2xl border border-line bg-white p-6 shadow-sm";

export default async function AdminSettingsPage() {
  const { t } = await getT();
  const s = await getSettings();
  const session = await getSession();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">{t("admin.settings.title")}</h1>
        <p className="text-sm text-ink-soft">
          {t("admin.settings.subtitle")}
        </p>
      </div>

      <form action={updateSettingsAction} className="grid items-start gap-6 lg:grid-cols-2">
        {/* Identity — full width */}
        <section className={`${card} lg:col-span-2`}>
          <h2 className="font-display font-bold text-ink">{t("admin.settings.identity")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>{t("admin.settings.siteName")}</label>
              <input name="siteName" defaultValue={s.siteName} className={input} />
            </div>
            <div>
              <label className={label}>{t("admin.settings.logo")}</label>
              <div className="flex items-center gap-3">
                {s.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt={t("admin.settings.logoAlt")} className="h-11 w-11 rounded-lg border border-line object-contain" />
                )}
                <input type="file" name="logo" accept="image/*" className="text-sm" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className={label}>{t("admin.settings.announcement")}</label>
            <input name="announcement" defaultValue={s.announcement ?? ""} className={input} placeholder={t("admin.settings.announcementPlaceholder")} />
          </div>
        </section>

        {/* Contact */}
        <section className={card}>
          <h2 className="font-display font-bold text-ink">{t("admin.settings.contact")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>{t("admin.settings.phone1")}</label>
              <input name="phone1" defaultValue={s.phone1} className={input} />
            </div>
            <div>
              <label className={label}>{t("admin.settings.phone2")}</label>
              <input name="phone2" defaultValue={s.phone2 ?? ""} className={input} />
            </div>
            <div>
              <label className={label}>{t("admin.settings.whatsapp")}</label>
              <input name="whatsapp" defaultValue={s.whatsapp ?? ""} className={input} placeholder="212660781919" />
            </div>
            <div>
              <label className={label}>{t("admin.settings.email")}</label>
              <input name="email" type="email" defaultValue={s.email ?? ""} className={input} />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className={card}>
          <h2 className="font-display font-bold text-ink">{t("admin.settings.location")}</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={label}>{t("admin.settings.addressText")}</label>
              <input name="addressText" defaultValue={s.addressText ?? ""} className={input} placeholder="Agadir, Maroc" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>{t("admin.settings.mapLat")}</label>
                <input name="mapLat" defaultValue={s.mapLat ?? ""} className={input} placeholder="30.4144656" />
              </div>
              <div>
                <label className={label}>{t("admin.settings.mapLng")}</label>
                <input name="mapLng" defaultValue={s.mapLng ?? ""} className={input} placeholder="-9.5671467" />
              </div>
            </div>
          </div>
        </section>

        {/* Socials */}
        <section className={card}>
          <h2 className="font-display font-bold text-ink">{t("admin.settings.socials")}</h2>
          <p className="mt-1 text-xs text-ink-soft">{t("admin.settings.socialsHint")}</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className={label}>{t("admin.settings.facebook")}</label>
              <input name="facebook" defaultValue={s.facebook ?? ""} className={input} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className={label}>{t("admin.settings.instagram")}</label>
              <input name="instagram" defaultValue={s.instagram ?? ""} className={input} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className={label}>{t("admin.settings.tiktok")}</label>
              <input name="tiktok" defaultValue={s.tiktok ?? ""} className={input} placeholder="https://tiktok.com/@..." />
            </div>
          </div>
        </section>

        {/* Delivery */}
        <section className={card}>
          <h2 className="font-display font-bold text-ink">{t("admin.settings.delivery")}</h2>
          <div className="mt-4 grid items-end gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>{t("admin.settings.deliveryFee")}</label>
              <input name="deliveryFee" type="number" min={0} defaultValue={s.deliveryFee} className={input} />
            </div>
            <div>
              <label className={label}>{t("admin.settings.freeDeliveryThreshold")}</label>
              <input name="freeDeliveryThreshold" type="number" min={0} defaultValue={s.freeDeliveryThreshold} className={input} />
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            {t("admin.settings.freeDeliveryHint")}
          </p>
        </section>

        <div className="lg:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {t("admin.settings.save")}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <AdminAccountForm currentEmail={session?.email ?? ""} />
      </div>
    </div>
  );
}
