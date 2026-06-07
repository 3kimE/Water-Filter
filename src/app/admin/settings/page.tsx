import { getSettings } from "@/lib/data";
import { updateSettingsAction } from "@/lib/settings-actions";
import { getSession } from "@/lib/auth";
import { AdminAccountForm } from "@/components/admin/account-form";

export const dynamic = "force-dynamic";

const label = "mb-1.5 block text-sm font-semibold text-ink";
const input =
  "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
const card = "rounded-2xl border border-line bg-white p-6 shadow-sm";

export default async function AdminSettingsPage() {
  const s = await getSettings();
  const session = await getSession();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Paramètres</h1>
        <p className="text-sm text-ink-soft">
          Informations de la boutique — modifiez-les ici, elles s&apos;appliquent
          partout sur le site.
        </p>
      </div>

      <form action={updateSettingsAction} className="grid items-start gap-6 lg:grid-cols-2">
        {/* Identity — full width */}
        <section className={`${card} lg:col-span-2`}>
          <h2 className="font-display font-bold text-ink">Identité</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Nom du site</label>
              <input name="siteName" defaultValue={s.siteName} className={input} />
            </div>
            <div>
              <label className={label}>Logo</label>
              <div className="flex items-center gap-3">
                {s.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt="logo" className="h-11 w-11 rounded-lg border border-line object-contain" />
                )}
                <input type="file" name="logo" accept="image/*" className="text-sm" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className={label}>Bandeau d&apos;annonce (haut du site)</label>
            <input name="announcement" defaultValue={s.announcement ?? ""} className={input} placeholder="Ex : Livraison gratuite dès 1 000 MAD" />
          </div>
        </section>

        {/* Contact */}
        <section className={card}>
          <h2 className="font-display font-bold text-ink">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Téléphone 1</label>
              <input name="phone1" defaultValue={s.phone1} className={input} />
            </div>
            <div>
              <label className={label}>Téléphone 2</label>
              <input name="phone2" defaultValue={s.phone2 ?? ""} className={input} />
            </div>
            <div>
              <label className={label}>WhatsApp</label>
              <input name="whatsapp" defaultValue={s.whatsapp ?? ""} className={input} placeholder="212660781919" />
            </div>
            <div>
              <label className={label}>Email</label>
              <input name="email" type="email" defaultValue={s.email ?? ""} className={input} />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className={card}>
          <h2 className="font-display font-bold text-ink">Localisation</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={label}>Adresse (texte)</label>
              <input name="addressText" defaultValue={s.addressText ?? ""} className={input} placeholder="Agadir, Maroc" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Latitude carte</label>
                <input name="mapLat" defaultValue={s.mapLat ?? ""} className={input} placeholder="30.4144656" />
              </div>
              <div>
                <label className={label}>Longitude carte</label>
                <input name="mapLng" defaultValue={s.mapLng ?? ""} className={input} placeholder="-9.5671467" />
              </div>
            </div>
          </div>
        </section>

        {/* Socials */}
        <section className={card}>
          <h2 className="font-display font-bold text-ink">Réseaux sociaux</h2>
          <p className="mt-1 text-xs text-ink-soft">Laissez vide pour masquer un réseau.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className={label}>Facebook</label>
              <input name="facebook" defaultValue={s.facebook ?? ""} className={input} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className={label}>Instagram</label>
              <input name="instagram" defaultValue={s.instagram ?? ""} className={input} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className={label}>TikTok</label>
              <input name="tiktok" defaultValue={s.tiktok ?? ""} className={input} placeholder="https://tiktok.com/@..." />
            </div>
          </div>
        </section>

        {/* Delivery */}
        <section className={card}>
          <h2 className="font-display font-bold text-ink">Livraison</h2>
          <div className="mt-4 grid items-end gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Frais de livraison (MAD)</label>
              <input name="deliveryFee" type="number" min={0} defaultValue={s.deliveryFee} className={input} />
            </div>
            <div>
              <label className={label}>Livraison gratuite à partir de (MAD)</label>
              <input name="freeDeliveryThreshold" type="number" min={0} defaultValue={s.freeDeliveryThreshold} className={input} />
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Mettez « Livraison gratuite à partir de » très haut pour désactiver la livraison gratuite.
          </p>
        </section>

        <div className="lg:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Enregistrer les paramètres
          </button>
        </div>
      </form>

      <div className="mt-6">
        <AdminAccountForm currentEmail={session?.email ?? ""} />
      </div>
    </div>
  );
}
