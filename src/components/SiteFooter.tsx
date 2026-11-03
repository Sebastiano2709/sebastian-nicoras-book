import Link from "next/link";
import { gaMeasurementId } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { CookieSettingsButton } from "./ConsentManager";

// Footer on every page: confirmed copyright line (brief, exact wording), legal links, cookie settings.
// Provider identification and the ANPC SAL pictogram are intentionally absent (site.ts: Q4 default, [LEGAL]).
export function SiteFooter({ lang, t }: { lang: Locale; t: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container-book">
        <nav aria-label={t.legal.nav}>
          <ul>
            <li><Link href={`/${lang}/contact`}>{t.nav.contact}</Link></li>
            <li><Link href={`/${lang}/privacy`}>{t.legal.privacy}</Link></li>
            <li><Link href={`/${lang}/cookies`}>{t.legal.cookies}</Link></li>
            <li><Link href={`/${lang}/accessibility`}>{t.legal.accessibility}</Link></li>
            {gaMeasurementId ? <li><CookieSettingsButton label={t.consent.settings} /></li> : null}
          </ul>
        </nav>
        <p>{t.footer.copyright.replace("{year}", String(year))}</p>
      </div>
    </footer>
  );
}
