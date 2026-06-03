import Link from "next/link";
import {
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
} from "@/components/social-icons";
import { BrandName } from "@/components/brand-name";
import { getT } from "@/i18n/server";
import type { SiteSettings } from "@/lib/data";

const TRUST = [
  { icon: Truck, titleKey: "footer.trust.delivery.title", textKey: "footer.trust.delivery.text" },
  { icon: ShieldCheck, titleKey: "footer.trust.warranty.title", textKey: "footer.trust.warranty.text" },
  { icon: RotateCcw, titleKey: "footer.trust.return.title", textKey: "footer.trust.return.text" },
  { icon: Headphones, titleKey: "footer.trust.support.title", textKey: "footer.trust.support.text" },
];

function formatPhone(p: string) {
  return p.replace(/\s/g, "").replace(/^(\d{4})(\d{3})(\d{3})$/, "$1 $2 $3");
}

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { t } = await getT();

  const socials = [
    settings.facebook && { Icon: FacebookIcon, href: settings.facebook, label: "Facebook" },
    settings.instagram && { Icon: InstagramIcon, href: settings.instagram, label: "Instagram" },
    settings.tiktok && { Icon: TiktokIcon, href: settings.tiktok, label: "TikTok" },
    settings.whatsapp && { Icon: MessageCircle, href: `https://wa.me/${settings.whatsapp}`, label: "WhatsApp" },
  ].filter((x): x is { Icon: typeof MessageCircle; href: string; label: string } => Boolean(x));

  const phones = [settings.phone1, settings.phone2].filter(Boolean) as string[];

  return (
    <footer className="mt-24 border-t border-line bg-neutral-50 text-ink-soft">
      {/* Trust strip */}
      <div className="border-b border-line">
        <div className="container-page grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.titleKey} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-brand-600">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-ink">{t(item.titleKey)}</p>
                <p className="text-sm text-ink-soft">{t(item.textKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            <BrandName name={settings.siteName} />
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {t("footer.blurb")}
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:border-neutral-300 hover:text-ink"
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-ink">{t("footer.categories")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?cat=${c.slug}`} className="text-ink-soft transition-colors hover:text-ink">
                  {t(`cat.${c.slug}.name`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-ink">{t("footer.info")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/about" className="text-ink-soft hover:text-ink">{t("nav.about")}</Link></li>
            <li><Link href="/contact" className="text-ink-soft hover:text-ink">{t("nav.contact")}</Link></li>
            <li><Link href="/shop" className="text-ink-soft hover:text-ink">{t("nav.shop")}</Link></li>
            <li><span className="text-ink-soft">{t("footer.info.deliveryPayment")}</span></li>
            <li><span className="text-ink-soft">{t("footer.info.warrantyReturns")}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-ink">{t("footer.contact")}</h4>
          <ul className="mt-4 space-y-3 text-sm">
            {phones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-500" />
                <a href={`tel:${p.replace(/\s/g, "")}`} className="text-ink-soft hover:text-ink">
                  {formatPhone(p)}
                </a>
              </li>
            ))}
            {settings.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-500" />
                <a href={`mailto:${settings.email}`} className="break-all text-ink-soft hover:text-ink">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" /> {t("footer.orderWhatsapp")}
            </a>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-soft sm:flex-row">
          <p>{t("footer.copyright")}</p>
          <p>{t("footer.codLine")}</p>
        </div>
      </div>
    </footer>
  );
}
