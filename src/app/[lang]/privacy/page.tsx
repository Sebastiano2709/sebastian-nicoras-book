import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { getDictionary } from "../dictionaries";
import { LegalPage } from "@/components/LegalPage";
import { PrivacyContent } from "@/content/legal/privacy";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.legal.privacy, alternates: alternatesFor(lang, "/privacy") };
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return <LegalPage lang={lang} t={t} title={t.legal.privacy}><PrivacyContent lang={lang} /></LegalPage>;
}
