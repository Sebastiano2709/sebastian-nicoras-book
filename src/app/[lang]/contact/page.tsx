import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { person } from "@/config/site";
import { getDictionary } from "../dictionaries";
import { ContactForm } from "./ContactForm";
import { TrackedLink } from "@/components/TrackedLink";
import { SiteHeader } from "@/components/SiteHeader";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.contact.title, description: t.book.contactLead, alternates: alternatesFor(lang, "/contact") };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return (
    <>
    <SiteHeader lang={lang} t={t} />
    <main id="main" tabIndex={-1} className="focus:outline-none">
    <section aria-labelledby="contact-title" className="container-book grid gap-12 py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:py-28">
      <div>
        <p className="t-label">{t.home.kicker}</p>
        <h1 id="contact-title" className="t-display mt-4 text-[clamp(2.6rem,1.6rem+4vw,5rem)]">{t.contact.title}</h1>
        {/* Direct channels stay available even if the form is down (13 §4.1) */}
        <p className="mt-6 max-w-[30rem] text-lg text-ink-muted">
          {t.contact.intro}{" "}
          <TrackedLink event="click_email" location="contact_page" href={`mailto:${person.email}`} className="link-underline [overflow-wrap:anywhere] text-ink">
            {person.email}
          </TrackedLink>.
        </p>
        <ul className="mt-8 grid gap-3 text-base">
          <li>
            <span className="t-label mr-3">{t.book.instagram}</span>
            <TrackedLink event="click_instagram" location="contact_page" href={person.instagramUrl} rel="noopener noreferrer" className="link-underline">
              {person.instagramHandle}
            </TrackedLink>
          </li>
          <li>
            <span className="t-label mr-3">{t.book.compCard}</span>
            <TrackedLink event="download_comp_card" location="contact_page" href={person.compCard} download className="link-underline">
              {t.hero.compCard}
            </TrackedLink>{" "}
            <span className="text-ink-muted">({t.book.compCardFile})</span>
          </li>
        </ul>
      </div>
      <ContactForm lang={lang} t={t.contact} />
    </section>
    </main>
    </>
  );
}
