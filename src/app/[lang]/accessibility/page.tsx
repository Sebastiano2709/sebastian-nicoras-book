import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { getDictionary } from "../dictionaries";
import { LegalPage } from "@/components/LegalPage";
import { AccessibilityContent } from "@/content/legal/accessibility";

export async function generateMetadata({ params }: PageProps<"/[lang]/accessibility">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.legal.accessibility, alternates: alternatesFor(lang, "/accessibility") };
}

export default async function Page({ params }: PageProps<"/[lang]/accessibility">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return <LegalPage lang={lang} t={t} title={t.legal.accessibility}><AccessibilityContent lang={lang} /></LegalPage>;
}
