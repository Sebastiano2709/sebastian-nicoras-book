import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { SiteHeader } from "./SiteHeader";

export const LEGAL_UPDATED = "2026-11-03";

// Shared shell for privacy / cookies / accessibility (09 §5.13). Typography for long-form reading (measure ≤ 68ch).
export function LegalPage({ lang, t, title, children }: { lang: Locale; t: Dictionary; title: string; children: ReactNode }) {
  const updated = new Intl.DateTimeFormat(lang === "ro" ? "ro-RO" : "en-GB", { dateStyle: "long", timeZone: "Europe/Bucharest" })
    .format(new Date(`${LEGAL_UPDATED}T12:00:00Z`));
  return (
    <>
    <SiteHeader lang={lang} t={t} />
    <main id="main" tabIndex={-1} className="focus:outline-none">
    <article className="container-book py-16 md:py-24">
      <div className="mx-auto max-w-[68ch]">
        <h1 className="t-display text-[clamp(2.4rem,1.6rem+3.4vw,4.4rem)] leading-[1.02]">{title}</h1>
        <p className="t-label mt-6">{t.legal.updated}: <time dateTime={LEGAL_UPDATED}>{updated}</time></p>
        <p role="note" className="mt-6 border-l-2 border-ink pl-4 text-sm text-ink-muted">{t.legal.draft}</p>
        <div className="legal-prose mt-10 grid gap-5 text-base leading-relaxed [&_h2]:mt-8 [&_h2]:text-sm [&_h2]:font-medium [&_h2]:tracking-[0.12em] [&_h2]:uppercase [&_a]:underline [&_a]:underline-offset-4 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
          {children}
        </div>
        <p className="mt-14"><Link className="link-underline" href={`/${lang}`}>{t.legal.back}</Link></p>
      </div>
    </article>
    </main>
    </>
  );
}

/** Visible, named placeholder for a decision that belongs to the owner or counsel (13 §7.5). */
export function Pending({ children }: { children: ReactNode }) {
  return <mark className="bg-surface-sunken px-1 text-ink">[{children}]</mark>;
}
