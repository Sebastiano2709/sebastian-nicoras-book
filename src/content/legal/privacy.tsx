import { person } from "@/config/site";
import { Pending } from "@/components/LegalPage";
import type { Locale } from "@/lib/i18n/config";

// Inputs per 09 §5.13.2, written from what the code actually does (contact flow 05 §10.9, consent SN-03).
// [LEGAL] Every bracketed item is decided by the owner or counsel — never by the developer.
export function PrivacyContent({ lang }: { lang: Locale }) {
  const mail = <a href={`mailto:${person.email}`}>{person.email}</a>;
  if (lang === "ro") {
    return (
      <>
        <p>Această politică explică ce date personale prelucrează site-ul {person.name}, de ce și cât timp le păstrează.</p>
        <h2>Cine răspunde de date</h2>
        <p>Operatorul este {person.name}, persoană fizică, cu baza în Cluj-Napoca, România. Contact: {mail}. <Pending>LEGAL: confirmați datele operatorului; dacă facturați ca PFA sau firmă, se adaugă datele acesteia</Pending></p>
        <h2>Cereri de booking (formularul de contact)</h2>
        <ul>
          <li>Date: nume, email, agenție sau companie (opțional), mesaj, limba paginii și momentul trimiterii.</li>
          <li>Scop: răspunsul la cerere și discutarea proiectului.</li>
          <li>Temei legal: <Pending>LEGAL: proprietarul alege temeiul (de ex. demersuri înainte de un contract sau interes legitim)</Pending></li>
          <li>Păstrare: cererile sunt șterse automat după <Pending>LEGAL: perioada de păstrare — implicit 365 de zile</Pending>, după ce au fost livrate prin email. Notificarea ajunge în căsuța de email a proprietarului.</li>
        </ul>
        <h2>Protecție împotriva abuzului</h2>
        <p>Pentru a limita mesajele automate, adresa IP este folosită ca cheie temporară (maximum 5 mesaje în 10 minute). Cheia expiră după 10 minute și nu este salvată împreună cu cererea.</p>
        <h2>Statistici de vizitare (doar cu acordul tău)</h2>
        <p>Dacă accepți în bannerul de cookies, site-ul încarcă Google Analytics 4 pentru a număra vizitele și descărcările comp card-ului. Fără acord, nu se trimite nicio cerere către Google. Îți poți retrage acordul oricând din „Setări cookies”, în subsolul fiecărei pagini. Detalii: politica de cookies.</p>
        <h2>Găzduire</h2>
        <p>Furnizorul de găzduire prelucrează date tehnice ale cererilor (inclusiv adresa IP) pentru a livra site-ul și a-l proteja. <Pending>LEGAL: confirmați durata de păstrare a jurnalelor la furnizor</Pending></p>
        <h2>Destinatari și împuterniciți</h2>
        <ul>
          <li>Vercel — găzduirea site-ului și rularea formularului;</li>
          <li>Neon — baza de date în care sunt stocate cererile;</li>
          <li>Upstash — stocarea temporară pentru limitarea mesajelor;</li>
          <li>Resend — trimiterea emailului de notificare;</li>
          <li>Google — Google Analytics (doar cu acord) și căsuța de email care primește notificările.</li>
        </ul>
        <p><Pending>LEGAL: acorduri de prelucrare (art. 28 GDPR) și mecanismul pentru transferurile în afara SEE, pentru fiecare furnizor</Pending></p>
        <h2>Drepturile tale</h2>
        <p>Ai dreptul de acces, rectificare, ștergere, restricționare, opoziție și portabilitate, precum și dreptul de a-ți retrage consimțământul. Scrie la {mail}. Poți depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), <a href="https://www.dataprotection.ro" rel="noopener noreferrer">dataprotection.ro</a>.</p>
      </>
    );
  }
  return (
    <>
      <p>This policy explains which personal data the {person.name} website processes, why, and for how long.</p>
      <h2>Who is responsible</h2>
      <p>The controller is {person.name}, a private individual based in Cluj-Napoca, Romania. Contact: {mail}. <Pending>LEGAL: confirm the controller details; if invoicing as a PFA or company, its details are added</Pending></p>
      <h2>Booking enquiries (contact form)</h2>
      <ul>
        <li>Data: name, email, agency or company (optional), message, page language and time of sending.</li>
        <li>Purpose: answering the enquiry and discussing the project.</li>
        <li>Legal basis: <Pending>LEGAL: the owner chooses the basis (e.g. steps prior to a contract, or legitimate interest)</Pending></li>
        <li>Retention: enquiries are deleted automatically after <Pending>LEGAL: retention period — default 365 days</Pending>, once they have been delivered by email. The notification reaches the owner&apos;s mailbox.</li>
      </ul>
      <h2>Abuse protection</h2>
      <p>To limit automated messages, the IP address is used as a temporary key (at most 5 messages in 10 minutes). The key expires after 10 minutes and is not stored with the enquiry.</p>
      <h2>Visit statistics (only with your consent)</h2>
      <p>If you accept in the cookie banner, the site loads Google Analytics 4 to count visits and comp-card downloads. Without consent, no request is sent to Google. You can withdraw consent at any time through &ldquo;Cookie settings&rdquo; in the footer of every page. Details: cookie policy.</p>
      <h2>Hosting</h2>
      <p>The hosting provider processes technical request data (including the IP address) to deliver and protect the site. <Pending>LEGAL: confirm the provider&apos;s log retention period</Pending></p>
      <h2>Recipients and processors</h2>
      <ul>
        <li>Vercel — hosting the site and running the form;</li>
        <li>Neon — the database where enquiries are stored;</li>
        <li>Upstash — temporary storage for message limiting;</li>
        <li>Resend — sending the notification email;</li>
        <li>Google — Google Analytics (only with consent) and the mailbox that receives notifications.</li>
      </ul>
      <p><Pending>LEGAL: processing agreements (GDPR Art. 28) and the transfer mechanism for any processing outside the EEA, per provider</Pending></p>
      <h2>Your rights</h2>
      <p>You have the right of access, rectification, erasure, restriction, objection and portability, and the right to withdraw consent. Write to {mail}. You can complain to the Romanian supervisory authority (ANSPDCP), <a href="https://www.dataprotection.ro" rel="noopener noreferrer">dataprotection.ro</a>.</p>
    </>
  );
}
