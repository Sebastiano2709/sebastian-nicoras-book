"use client";
import { useState } from "react";

/** Copies the booking email. Rendered next to the mailto link, which keeps working without JavaScript. */
export function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className="copy t-label" aria-live="polite"
      onClick={() => {
        navigator.clipboard?.writeText(email).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        }, () => undefined);
      }}>
      {copied ? done : label}
    </button>
  );
}
