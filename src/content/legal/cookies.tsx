import { CONSENT_COOKIE } from "@/lib/consent";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { Pending } from "@/components/LegalPage";

// Cookie declaration built from what the code sets (09 §5.13.3). The two Google rows come from Google's own
// documentation (support.google.com/analytics/answer/11397207, read 2026-11-02): _ga and _ga_<container-id>,
// 2 years each. Re-run the empty-profile check on the production build after every new integration.
type Row = { name: string; provider: string; purpose: string; category: string; duration: string };

const rows: Record<Locale, Row[]> = {
  en: [
    { name: LOCALE_COOKIE, provider: "This site", purpose: "Remembers the language you chose with the language switcher", category: "Strictly necessary", duration: "1 year" },
    { name: CONSENT_COOKIE, provider: "This site", purpose: "Stores your cookie choice (analytics yes/no), the policy version and the time of the choice", category: "Strictly necessary", duration: "About 6 months" },
    { name: "_ga", provider: "Google (Google Analytics 4)", purpose: "Distinguishes visitors — set only after you accept analytics", category: "Analytics", duration: "2 years" },
    { name: "_ga_<container-id>", provider: "Google (Google Analytics 4)", purpose: "Keeps the visit (session) state — set only after you accept analytics", category: "Analytics", duration: "2 years" },
  ],
  ro: [
    { name: LOCALE_COOKIE, provider: "Acest site", purpose: "Reține limba aleasă cu selectorul de limbă", category: "Strict necesar", duration: "1 an" },
    { name: CONSENT_COOKIE, provider: "Acest site", purpose: "Reține alegerea ta privind cookie-urile (analiză da/nu), versiunea politicii și momentul alegerii", category: "Strict necesar", duration: "Circa 6 luni" },
    { name: "_ga", provider: "Google (Google Analytics 4)", purpose: "Deosebește vizitatorii — setat doar după ce accepți analiza", category: "Analiză", duration: "2 ani" },
    { name: "_ga_<container-id>", provider: "Google (Google Analytics 4)", purpose: "Păstrează starea vizitei (sesiunea) — setat doar după ce accepți analiza", category: "Analiză", duration: "2 ani" },
  ],
};

const head = {
  en: ["Name", "Provider", "Purpose", "Category", "Duration"],
  ro: ["Nume", "Furnizor", "Scop", "Categorie", "Durată"],
};

export function CookiesContent({ lang, settings }: { lang: Locale; settings: React.ReactNode }) {
  const intro = lang === "ro"
    ? "Lista de mai jos conține tot ce stochează site-ul în browserul tău. Site-ul nu folosește localStorage și nu încarcă reclame, pixeli sau conținut încorporat de la terți."
    : "The table lists everything this site stores in your browser. The site does not use localStorage and loads no ads, pixels or third-party embeds.";
  const consentText = lang === "ro"
    ? "Cookie-urile Google Analytics sunt setate doar dacă alegi „Accept analiza”. Poți schimba sau retrage alegerea oricând; la retragere, cookie-urile _ga sunt șterse și pagina se reîncarcă fără Google Analytics."
    : "Google Analytics cookies are set only if you choose “Accept analytics”. You can change or withdraw your choice at any time; on withdrawal the _ga cookies are deleted and the page reloads without Google Analytics.";
  return (
    <>
      <p>{intro}</p>
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={lang === "ro" ? "Tabel cookie-uri (derulează orizontal)" : "Cookie table (scrolls horizontally)"}>
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <caption className="sr-only">{lang === "ro" ? "Cookie-uri folosite de site" : "Cookies used by this site"}</caption>
          <thead>
            <tr className="border-b border-ink">{head[lang].map((h) => <th key={h} scope="col" className="py-2 pr-4 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows[lang].map((r) => (
              <tr key={r.name} className="border-b border-hairline align-top">
                <th scope="row" className="py-3 pr-4 font-mono font-normal">{r.name}</th>
                <td className="py-3 pr-4">{r.provider}</td>
                <td className="py-3 pr-4">{r.purpose}</td>
                <td className="py-3 pr-4">{r.category}</td>
                <td className="py-3">{r.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{consentText}</p>
      <div>{settings}</div>
      <p><Pending>{lang === "ro" ? "LEGAL: confirmați intervalul după care bannerul este afișat din nou (implicit circa 6 luni)" : "LEGAL: confirm the re-prompt interval (default about 6 months)"}</Pending></p>
    </>
  );
}
