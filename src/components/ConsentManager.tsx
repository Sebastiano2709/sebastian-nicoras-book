"use client";
import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  analyticsCookieNames, CONSENT_OPEN_EVENT, parseConsent, serializeConsent, type StoredConsent,
} from "@/lib/consent";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const GA_ID_RE = /^G-[A-Z0-9]+$/;
const CONSENT_CHANGED_EVENT = "sn:consent-changed";
function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
}

/**
 * Consent banner + consent-gated GA4 (ADR SN-03; 07 §12.11 basic mode; 09 §5.11, §5.13.3).
 * - No request to Google before the visitor accepts (the scripts are not rendered at all).
 * - Accept and Reject are equal-weight buttons on the first layer; no pre-ticked choices.
 * - "Cookie settings" (footer, cookie page) re-opens the banner; rejecting after accepting withdraws consent:
 *   consent update → GA cookies deleted → reload, so no Google script stays on the page.
 * - Not modal: a card in the corner; html.consent-open adds scroll padding so it never hides focused content.
 */
export function ConsentManager({ measurementId, lang, t }: { measurementId: string; lang: "en" | "ro"; t: Dictionary["consent"] }) {
  // The cookie is an external store: read it with useSyncExternalStore (server snapshot = null → banner hidden in HTML).
  const cookie = useSyncExternalStore(subscribeConsent, () => document.cookie, () => null);
  const decision: StoredConsent | null | undefined = cookie === null ? undefined : parseConsent(cookie);
  const [manualOpen, setManualOpen] = useState(false);
  const open = manualOpen || decision === null;
  const firstButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setManualOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("consent-open", open);
    if (manualOpen) firstButton.current?.focus(); // only when the visitor asked for it
  }, [open, manualOpen]);

  const choose = useCallback((analytics: boolean) => {
    const wasGranted = decision?.analytics === true;
    document.cookie = serializeConsent(analytics);
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    setManualOpen(false);
    if (!analytics && wasGranted) {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      const host = window.location.hostname;
      const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
      for (const name of analyticsCookieNames(document.cookie)) {
        for (const d of domains) document.cookie = `${name}=; Path=/; Max-Age=0${d ? `; Domain=${d}` : ""}`;
      }
      window.location.reload(); // removes the already-loaded Google script from memory
    }
  }, [decision]);

  const granted = decision?.analytics === true && GA_ID_RE.test(measurementId);

  return (
    <>
      {granted ? (
        <>
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `}</Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
        </>
      ) : null}

      {open ? (
        <section role="region" aria-labelledby="consent-title" className="consent">
          <h2 id="consent-title">{t.title}</h2>
          <p>
            {t.text} <Link className="link-underline text-ink" href={`/${lang}/cookies`}>{t.policy}</Link>
          </p>
          {manualOpen && decision ? (
            <p className="text-ink">{decision.analytics ? t.statusAccepted : t.statusRejected}</p>
          ) : null}
          {/* Equal prominence: same component, same size, same weight (EDPB taskforce; 09 §5.13.3) */}
          <div className="row">
            <button ref={firstButton} type="button" onClick={() => choose(false)} className="btn-secondary">{t.reject}</button>
            <button type="button" onClick={() => choose(true)} className="btn-secondary">{t.accept}</button>
          </div>
        </section>
      ) : null}
    </>
  );
}

/** Persistent, keyboard-accessible way to change or withdraw consent (09 §5.11 item 4). */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      {label}
    </button>
  );
}
