"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { submitContact } from "./actions";
import type { ContactField, ContactState } from "./schema";
import type { Dictionary } from "../dictionaries";

const initial: ContactState = { status: "idle" };

// Works without JavaScript (form action → Server Action). Errors: one summary, focused; fields linked by aria-describedby.
export function ContactForm({ lang, t }: { lang: "en" | "ro"; t: Dictionary["contact"] }) {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const uid = useId();
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") {
      successRef.current?.focus();
      trackEvent("generate_lead", { form: "booking_enquiry", language: lang }); // no-op without consent
    }
  }, [state, lang]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border border-ink bg-surface p-6 md:p-8">
        <p className="text-lg font-medium">{t.success}</p>
        <p className="mt-4"><Link className="link-underline" href={`/${lang}`}>{t.successBack}</Link></p>
      </div>
    );
  }

  const field = (name: ContactField) => {
    const error = state.fieldErrors?.[name]?.[0];
    const hint = name === "message" ? `${uid}-message-hint` : "";
    return {
      id: `${uid}-${name}`,
      defaultValue: state.values?.[name] ?? "",
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": [hint, error ? `${uid}-${name}-error` : ""].filter(Boolean).join(" ") || undefined,
      error,
    };
  };
  const name = field("name"), email = field("email"), company = field("company"), message = field("message");
  const inputClass =
    "mt-2 block w-full rounded-control border border-line bg-surface px-3 py-3 text-base aria-[invalid=true]:border-danger aria-[invalid=true]:border-2";
  const labelClass = "text-sm font-medium tracking-[0.08em] uppercase";
  const errorText = (id: string, error?: string) =>
    error ? <p id={id} className="mt-2 text-sm text-danger">{error}</p> : null;

  return (
    <form action={formAction} noValidate className="grid max-w-xl gap-6">
      {state.status === "error" ? (
        <p ref={summaryRef} tabIndex={-1} className="border-2 border-danger bg-surface p-4 text-danger">{state.message}</p>
      ) : null}
      <input type="hidden" name="locale" value={lang} />
      <div>
        <label htmlFor={name.id} className={labelClass}>{t.name}</label>
        <input id={name.id} name="name" autoComplete="name" required defaultValue={name.defaultValue}
          aria-invalid={name["aria-invalid"]} aria-describedby={name["aria-describedby"]} className={inputClass} />
        {errorText(`${uid}-name-error`, name.error)}
      </div>
      <div>
        <label htmlFor={email.id} className={labelClass}>{t.email}</label>
        <input id={email.id} name="email" type="email" autoComplete="email" required defaultValue={email.defaultValue}
          aria-invalid={email["aria-invalid"]} aria-describedby={email["aria-describedby"]} className={inputClass} />
        {errorText(`${uid}-email-error`, email.error)}
      </div>
      <div>
        <label htmlFor={company.id} className={labelClass}>
          {t.company} <span className="font-normal normal-case tracking-normal text-ink-muted">({t.optional})</span>
        </label>
        <input id={company.id} name="company" autoComplete="organization" defaultValue={company.defaultValue}
          aria-invalid={company["aria-invalid"]} aria-describedby={company["aria-describedby"]} className={inputClass} />
        {errorText(`${uid}-company-error`, company.error)}
      </div>
      <div>
        <label htmlFor={message.id} className={labelClass}>{t.message}</label>
        <p id={`${uid}-message-hint`} className="mt-1 text-sm text-ink-muted">{t.messageHint}</p>
        <textarea id={message.id} name="message" rows={6} required defaultValue={message.defaultValue}
          aria-invalid={message["aria-invalid"]} aria-describedby={message["aria-describedby"]} className={inputClass} />
        {errorText(`${uid}-message-error`, message.error)}
      </div>
      {/* Honeypot: off-screen, skipped by keyboard and assistive tech */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4">
        <p className="text-sm text-ink-muted">
          {t.privacy} <Link className="link-underline" href={`/${lang}/privacy`}>{t.privacyLink}</Link>
        </p>
        <button type="submit" disabled={pending} className="btn-primary justify-self-start">
          {pending ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
