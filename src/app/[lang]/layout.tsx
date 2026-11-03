import "../globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { gaMeasurementId, siteUrl } from "@/config/site";
import { getDictionary } from "./dictionaries";
import { preload } from "react-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { ConsentManager } from "@/components/ConsentManager";

// Self-hosted fonts (ADR-005 / SN-05), Latin + Romanian subsets, licences in src/fonts. No request to Google.
// Loader variables are named after the family (03 §10.6, 13 §3.1).
const inter = localFont({
  src: [{ path: "../../fonts/InterVariable-ro.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
  variable: "--font-inter",
});
// Bodoni Moda is declared in globals.css (split latin / latin-ext with unicode-range, files in public/fonts).
// The two faces every page uses first are preloaded so the large type does not wait for the CSS.
const BODONI_PRELOAD = ["/fonts/bm96-latin-normal-400.woff2", "/fonts/bm28-latin-normal-400.woff2"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#ffffff", viewportFit: "cover" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  const env = process.env.VERCEL_ENV ?? process.env.SITE_ENV ?? "development";
  const og = { url: `/og/og-${lang}.jpg`, width: 1200, height: 630, alt: t.meta.ogAlt };
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.title, template: `%s · ${t.meta.siteName}` },
    description: t.meta.description,
    robots: env === "production" ? undefined : { index: false, follow: false }, // previews never indexed (10 §17A.2)
    // Child objects replace parents (07 §6.2): every page that sets openGraph repeats images via ogFor().
    openGraph: {
      type: "website",
      siteName: t.meta.siteName,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "ro" ? "ro_RO" : "en_GB",
      alternateLocale: lang === "ro" ? ["en_GB"] : ["ro_RO"],
      url: `/${lang}`,
      images: [og],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description, images: [og.url] },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  for (const href of BODONI_PRELOAD) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  // Each page renders <SiteHeader> itself: on the book the cover photo comes before the sticky bar.
  return (
    <html lang={lang} className={inter.variable}>
      <body className="font-sans antialiased">
        <a href="#main" className="skip">{t.nav.skip}</a>
        {children}
        <SiteFooter lang={lang} t={t} />
        {gaMeasurementId ? <ConsentManager measurementId={gaMeasurementId} lang={lang} t={t.consent} /> : null}
      </body>
    </html>
  );
}
