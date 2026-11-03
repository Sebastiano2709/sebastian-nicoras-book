import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { gaMeasurementId } from "@/config/site";
import { getDictionary } from "../dictionaries";
import { LegalPage } from "@/components/LegalPage";
import { CookiesContent } from "@/content/legal/cookies";
import { CookieSettingsButton } from "@/components/ConsentManager";

export async function generateMetadata({ params }: PageProps<"/[lang]/cookies">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.legal.cookies, alternates: alternatesFor(lang, "/cookies") };
}

export default async function Page({ params }: PageProps<"/[lang]/cookies">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const settings = gaMeasurementId ? <CookieSettingsButton label={t.consent.settings} className="btn-secondary" /> : null;
  return <LegalPage lang={lang} t={t} title={t.legal.cookies}><CookiesContent lang={lang} settings={settings} /></LegalPage>;
}
