import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import type { RoutePath } from "@/config/site";

// Self-canonical + every alternate + x-default (07 §2.14, 03 §8.7.5). Resolved against metadataBase.
export function alternatesFor(lang: Locale, path: RoutePath): Metadata["alternates"] {
  return {
    canonical: `/${lang}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
      "x-default": path === "" ? "/" : `/${defaultLocale}${path}`,
    },
  };
}
