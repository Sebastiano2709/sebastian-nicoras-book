import { person } from "@/config/site";
import { Pending } from "@/components/LegalPage";
import type { Locale } from "@/lib/i18n/config";

// 09 §5.13.4 structure, written from the checks recorded in the v2 delivery report (2026-11-03).
// Only checks that were actually executed are listed; screen-reader testing was NOT performed and says so.
export function AccessibilityContent({ lang }: { lang: Locale }) {
  const mail = <a href={`mailto:${person.email}`}>{person.email}</a>;
  if (lang === "ro") {
    return (
      <>
        <p>Această declarație se aplică site-ului {person.name} (book-ul de model, paginile de contact și paginile legale), în română și engleză.</p>
        <h2>Standard și stadiu</h2>
        <p>Ținta este WCAG 2.2, nivelul AA. Stadiul de conformitate nu este încă stabilit complet: verificările de mai jos nu au găsit bariere, dar site-ul nu a fost încă testat cu cititoare de ecran și nici de o persoană independentă.</p>
        <h2>Cum a fost verificat</h2>
        <ul>
          <li>Teste automate axe-core (reguli WCAG 2.0–2.2 A/AA) pe toate paginile, în ambele limbi, pe desktop și pe mobil, inclusiv cu bannerul de cookies, vizualizatorul de imagini deschis și formularul cu erori.</li>
          <li>Teste automate de tastatură: link de salt la conținut, meniul mobil, vizualizatorul de imagini (săgeți, Escape, întoarcerea focusului), focus vizibil.</li>
          <li>Afișare fără depășire orizontală la lățimi între 320 și 1440 px și cu textul mărit la 200% și spațiere crescută (WCAG 1.4.10, 1.4.4, 1.4.12).</li>
          <li>Contrast calculat pentru toate combinațiile de culori text/fundal (minimum 5,9:1 pentru text).</li>
          <li>Conținut vizibil fără JavaScript și fără animații când este activată reducerea mișcării.</li>
        </ul>
        <h2>Limitări cunoscute</h2>
        <ul>
          <li>Nu a fost făcut încă un test cu cititoare de ecran (NVDA, VoiceOver, TalkBack).</li>
          <li>Fotografiile au descrieri text; comp card-ul PDF nu are încă etichete de accesibilitate (PDF fără structură). Măsurile din comp card sunt disponibile ca text pe pagina principală.</li>
        </ul>
        <h2>Feedback</h2>
        <p>Dacă întâmpini o barieră sau ai nevoie de conținut într-un alt format, scrie la {mail}. <Pending>CLIENT: termenul de răspuns pe care îl poți respecta</Pending></p>
        <h2>Autoritate competentă</h2>
        <p><Pending>LEGAL: autoritatea de supraveghere aplicabilă, dacă este cazul — confirmă juristul</Pending></p>
        <p>Pregătită pe 3 noiembrie 2026. Se revizuiește după fiecare modificare importantă a site-ului.</p>
      </>
    );
  }
  return (
    <>
      <p>This statement applies to the {person.name} website (the model book, the contact page and the legal pages), in English and Romanian.</p>
      <h2>Standard and status</h2>
      <p>The target is WCAG 2.2 level AA. The conformance status is not yet fully established: the checks below found no barriers, but the site has not yet been tested with screen readers or by an independent person.</p>
      <h2>How it was checked</h2>
      <ul>
        <li>Automated axe-core tests (WCAG 2.0–2.2 A/AA rules) on every page, in both languages, on desktop and mobile, including the cookie banner, the open image viewer and the form error state.</li>
        <li>Automated keyboard tests: skip link, mobile menu, image viewer (arrow keys, Escape, focus return), visible focus.</li>
        <li>No horizontal scrolling at widths from 320 to 1440 px, and with text enlarged to 200% and increased spacing (WCAG 1.4.10, 1.4.4, 1.4.12).</li>
        <li>Computed contrast for every text/background colour pair (at least 5.9:1 for text).</li>
        <li>Content visible without JavaScript, and no animation when reduced motion is requested.</li>
      </ul>
      <h2>Known limitations</h2>
      <ul>
        <li>No screen-reader test has been done yet (NVDA, VoiceOver, TalkBack).</li>
        <li>All photos have text descriptions; the comp-card PDF is not yet tagged for accessibility. The measurements it contains are available as text on the home page.</li>
      </ul>
      <h2>Feedback</h2>
      <p>If you meet a barrier or need content in another format, write to {mail}. <Pending>CLIENT: the response time you can commit to</Pending></p>
      <h2>Enforcement</h2>
      <p><Pending>LEGAL: the competent authority, if applicable — counsel confirms</Pending></p>
      <p>Prepared on 3 November 2026. Reviewed after every significant change to the site.</p>
    </>
  );
}
