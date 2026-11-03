import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, LOCALE_COOKIE, type Locale } from "./config";

export function preferredLocale(request: NextRequest): Locale {
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (chosen && isLocale(chosen)) return chosen;
  const languages = new Negotiator({
    headers: { "accept-language": request.headers.get("accept-language") ?? "" },
  }).languages();
  try {
    return match(languages, [...locales], defaultLocale) as Locale;
  } catch {
    return defaultLocale;
  }
}
