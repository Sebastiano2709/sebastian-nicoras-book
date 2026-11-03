import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { person } from "@/config/site";
import { SiteMenu, type MenuItem } from "./SiteMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** Sticky agency bar: menu, wordmark, language, booking. The menu is a full-screen native modal dialog. */
export function SiteHeader({ lang, t }: { lang: Locale; t: Dictionary }) {
  const home = `/${lang}`;
  const items: MenuItem[] = [
    { label: t.nav.portfolio, href: `${home}#portfolio` },
    { label: t.nav.polaroids, href: `${home}#polaroids` },
    { label: t.nav.measurements, href: `${home}#measurements` },
    { label: t.nav.booking, href: `${home}#booking` },
    { label: t.nav.enquiry, href: `${home}/contact` },
    { label: t.nav.compCard, href: person.compCard, event: "download_comp_card" },
    { label: t.nav.instagram, href: person.instagramUrl, external: true, event: "click_instagram" },
  ];
  const otherLang = lang === "ro" ? "en" : "ro";
  return (
    <header className="bar">
      <div className="bar-in">
        <SiteMenu items={items} lang={lang} labels={{ open: t.nav.menu, close: t.nav.closeMenu, nav: t.nav.primary }}
          wordmark={t.meta.siteName} foot={[t.nav.where, person.email]}
          language={<LanguageSwitcher current={lang} target={otherLang} label={t.nav.language} className="t-label text-ink! px-1 py-3" />} />
        <Link href={home} className="wordmark" aria-label={t.nav.home}>{t.meta.siteName}</Link>
        <div className="bar-right">
          <LanguageSwitcher current={lang} target={otherLang} label={t.nav.language} className="lang" />
          <Link className="book-link" href={`${home}#booking`}>{t.nav.booking}</Link>
        </div>
      </div>
    </header>
  );
}
