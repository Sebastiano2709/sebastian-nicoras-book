"use client";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";

// Links to the EQUIVALENT page in the other locale and remembers the choice (03 §8.7.5).
// Visible text is the language code; the accessible name is the full language name (WCAG 2.5.3: the name
// contains no conflicting visible label because the code is hidden from assistive tech).
export function LanguageSwitcher({ current, target, label, className }: { current: Locale; target: Locale; label: string; className?: string }) {
  const pathname = usePathname() ?? `/${current}`;
  const href = pathname.replace(new RegExp(`^/${current}(?=/|$)`), `/${target}`);
  return (
    <a href={href} hrefLang={target} lang={target} className={className}
      onClick={() => { document.cookie = `${LOCALE_COOKIE}=${target}; Path=/; Max-Age=31536000; SameSite=Lax`; }}>
      <span aria-hidden="true">{target.toUpperCase()}</span>
      <span className="sr-only">{label}</span>
    </a>
  );
}
