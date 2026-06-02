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
import { BrandLogo } from "@/components/brand-logo";
import { getT } from "@/i18n/server";

const TRUST = [
  { icon: Truck, titleKey: "footer.trust.delivery.title", textKey: "footer.trust.delivery.text" },
  { icon: ShieldCheck, titleKey: "footer.trust.warranty.title", textKey: "footer.trust.warranty.text" },
  { icon: RotateCcw, titleKey: "footer.trust.return.title", textKey: "footer.trust.return.text" },
  { icon: Headphones, titleKey: "footer.trust.support.title", textKey: "footer.trust.support.text" },
];

export async function SiteFooter() {
  const { t } = await getT();
  return (
    <footer className="mt-20 bg-brand-950 text-brand-100">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="container-page grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.titleKey} className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-aqua-300">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display font-semibold text-white">{t(item.titleKey)}</p>
                <p className="text-sm text-brand-200">{t(item.textKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandLogo className="h-11 w-11" />
            <span className="font-display text-lg font-extrabold text-white">
              Filtre<span className="text-aqua-400">Maroc</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-200">
            {t("footer.blurb")}
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="https://tiktok.com"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <TiktokIcon className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/212634585463"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white">{t("footer.categories")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?cat=${c.slug}`}
                  className="text-brand-200 transition-colors hover:text-white"
                >
                  {t(`cat.${c.slug}.name`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white">{t("footer.info")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/about" className="text-brand-200 hover:text-white">{t("nav.about")}</Link></li>
            <li><Link href="/contact" className="text-brand-200 hover:text-white">{t("nav.contact")}</Link></li>
            <li><Link href="/shop" className="text-brand-200 hover:text-white">{t("nav.shop")}</Link></li>
            <li><span className="text-brand-200">{t("footer.info.deliveryPayment")}</span></li>
            <li><span className="text-brand-200">{t("footer.info.warrantyReturns")}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white">{t("footer.contact")}</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-aqua-300" />
              <a href="tel:0634585463" className="text-brand-100 hover:text-white">0634 585 463</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-aqua-300" />
              <a href="tel:0760629315" className="text-brand-100 hover:text-white">0760 629 315</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-aqua-300" />
              <a href="mailto:filter.water.maoc@gmail.com" className="break-all text-brand-100 hover:text-white">
                filter.water.maoc@gmail.com
              </a>
            </li>
          </ul>
          <a
            href="https://wa.me/212634585463"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <MessageCircle className="h-4 w-4" /> {t("footer.orderWhatsapp")}
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-300 sm:flex-row">
          <p>{t("footer.copyright")}</p>
          <p>{t("footer.codLine")}</p>
        </div>
      </div>
    </footer>
  );
}
