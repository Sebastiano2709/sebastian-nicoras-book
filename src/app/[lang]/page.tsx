import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { measurements, person, siteUrl } from "@/config/site";
import { cover, polaroids, portfolio, src, type Photo } from "@/content/images";
import { getDictionary, type Dictionary } from "./dictionaries";
import { Frame, PhotoGroup, type GalleryPhoto } from "@/components/Gallery";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedLink } from "@/components/TrackedLink";
import { CopyEmail } from "@/components/CopyEmail";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { alternates: alternatesFor(lang, "") };
}

const toGallery = (lang: Locale) => (p: Photo): GalleryPhoto => ({ src: src(p), width: p.width, height: p.height, alt: p.alt[lang], lqip: p.lqip });

// Board words are fitted to the column: --w is each word's advance width in em, measured from Bodoni Moda
// (opsz 96, uppercase) with fontTools. Change a label → re-measure its width.
const BOARD_W: Record<Locale, { portfolio: string; polaroids: string; contact: string; instagram: string }> = {
  en: { portfolio: "5.6025", polaroids: "5.6795", contact: "4.7885", instagram: "5.988" },
  ro: { portfolio: "6.299", polaroids: "6.875", contact: "4.7885", instagram: "5.988" },
};

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const w = BOARD_W[lang];
  const rest = portfolio.slice(1); // portfolio[0] is the lead photo in the talent block

  // Person structured data describes only what is visible on the page (07 — structured data rules).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: t.meta.jobTitle,
    url: `${siteUrl}/${lang}`,
    image: `${siteUrl}${src(cover)}`,
    email: `mailto:${person.email}`,
    height: { "@type": "QuantitativeValue", value: 181, unitCode: "CMT" },
    address: { "@type": "PostalAddress", addressLocality: person.city, addressCountry: person.countryCode },
    sameAs: [person.instagramUrl],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Cover — the LCP image: eager, high priority, never hidden; anchored to the top so the head is never cut. */}
      <div className="cover" role="img" aria-label={cover.alt[lang]} style={{ "--lq": `url(${cover.lqip})` } as CSSProperties}>
        <Image src={src(cover)} alt="" fill loading="eager" fetchPriority="high"
          sizes="(min-aspect-ratio: 3/2) 100vw, 150svh" />
        <p className="cover-name" aria-hidden="true"><span>SEBASTIANO</span></p>
      </div>

      <SiteHeader lang={lang} t={t} />

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <PhotoGroup photos={portfolio.map(toGallery(lang))} labels={t.gallery} title={t.sections.portfolio}>
          <section className="talent" aria-labelledby="hero-name">
            <div className="container-book talent-row">
              <div className="talent-copy">
                <h1 className="name" id="hero-name"><span className="first">Sebastiano</span> <span className="last">Nicoras</span></h1>
                <p className="sr-only">{t.home.role}</p>
                <nav aria-label={t.home.board}>
                  <ul className="board">
                    <li><a href="#portfolio" style={{ "--w": w.portfolio } as CSSProperties}>{t.nav.portfolio}</a></li>
                    <li><a href="#polaroids" style={{ "--w": w.polaroids } as CSSProperties}>{t.nav.polaroids}</a></li>
                    <li><a href="#booking" style={{ "--w": w.contact } as CSSProperties}>{t.nav.contact}</a></li>
                    <li>
                      <TrackedLink event="click_instagram" location="board" href={person.instagramUrl} target="_blank" rel="noopener noreferrer"
                        style={{ "--w": w.instagram } as CSSProperties}>Instagram</TrackedLink>
                    </li>
                  </ul>
                </nav>
                <Measurements t={t} />
              </div>
              <div className="lead-photo">
                <Frame index={0} sizes="(min-width: 992px) 520px, calc(100vw - 32px)" />
              </div>
            </div>
          </section>

          <section id="portfolio" aria-labelledby="portfolio-title" className="book scroll-mt-20">
            <h2 id="portfolio-title" className="sr-only">{t.sections.portfolio}</h2>
            <div className="container-book">
              <ul className="grid-book">
                {rest.map((p, i) => (
                  <li key={p.file}><Frame index={i + 1} sizes="(min-width: 1240px) 548px, (min-width: 768px) 45vw, calc(100vw - 32px)" /></li>
                ))}
              </ul>
            </div>
          </section>
        </PhotoGroup>

        <section id="polaroids" aria-labelledby="polaroids-title" className="polaroids scroll-mt-20">
          <div className="container-book">
            <div className="heading">
              <h2 id="polaroids-title">{t.sections.polaroids}</h2>
              <p className="t-label">{t.home.digitals}</p>
            </div>
            <PhotoGroup photos={polaroids.map(toGallery(lang))} labels={t.gallery} title={t.sections.polaroids}>
              <ul className="pgrid">
                {polaroids.map((p, i) => (
                  <li key={p.file}><Frame index={i} sizes="(min-width: 1080px) 340px, (min-width: 768px) 31vw, 46vw" /></li>
                ))}
              </ul>
            </PhotoGroup>
          </div>
        </section>

        <section id="booking" aria-labelledby="booking-title" className="booking scroll-mt-20">
          <div className="container-book">
            <p className="t-label mb-[18px]">{t.home.kicker}</p>
            <h2 id="booking-title">{t.home.book} <em>sebastiano</em></h2>
            <p className="mail">
              <TrackedLink event="click_email" location="book_contact" href={`mailto:${person.email}`}>{person.email}</TrackedLink>
              <CopyEmail email={person.email} label={t.home.copy} done={t.home.copied} />
            </p>
            <div className="actions">
              <Link href={`/${lang}/contact`} className="btn-primary">{t.home.enquiry}</Link>
              <TrackedLink event="download_comp_card" location="book_contact" href={person.compCard} download className="btn-secondary">
                {t.hero.compCard} <span className="sr-only">({t.book.compCardFile})</span>
              </TrackedLink>
            </div>
            <TrackedLink event="click_instagram" location="book_contact" href={person.instagramUrl} rel="noopener noreferrer"
              className="ig t-label text-ink! link-underline">Instagram · {person.instagramHandle}</TrackedLink>
          </div>
        </section>
      </main>
    </>
  );
}

function Measurements({ t }: { t: Dictionary }) {
  const label = (key: (typeof measurements)[number]["key"]) => t.measurements[key];
  const metric = measurements.filter((m) => m.value);
  const imperial = measurements.filter((m) => m.alt);
  return (
    <details className="meas" id="measurements" open>
      <summary className="t-label">{t.measurements.title}</summary>
      <div className="meas-lines">
        <dl aria-label={t.home.metric}>
          {metric.map((m) => <div key={m.key}><dt>{label(m.key)}</dt><dd>{m.value}</dd></div>)}
        </dl>
        <dl aria-label={t.home.imperial}>
          {imperial.map((m) => <div key={m.key}><dt>{label(m.key)}</dt><dd>{m.alt}</dd></div>)}
        </dl>
        <dl>
          <div><dt>{t.measurements.hair}</dt><dd>{t.measurements.hairValue}</dd></div>
          <div><dt>{t.measurements.eyes}</dt><dd>{t.measurements.eyesValue}</dd></div>
        </dl>
      </div>
    </details>
  );
}
