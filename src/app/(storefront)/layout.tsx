import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappButton } from "@/components/whatsapp-button";
import { I18nProvider } from "@/i18n/i18n-context";
import { getLocale } from "@/i18n/server";
import { dirFor } from "@/i18n/config";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <I18nProvider locale={locale}>
      <div
        dir={dirFor(locale)}
        lang={locale}
        className="flex min-h-screen flex-col"
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsappButton />
      </div>
    </I18nProvider>
  );
}
