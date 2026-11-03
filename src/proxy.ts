import { NextResponse, type NextRequest } from "next/server";
import { preferredLocale } from "@/lib/i18n/negotiate";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

// Locale routing (03 §8.7.3). Only "/" is negotiated; localized URLs are never redirected by language.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}`;
    const res = NextResponse.redirect(url, 307);
    res.headers.set("Vary", "Accept-Language, Cookie");
    return res;
  }
  if (!isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Skip internals, API routes and files with an extension (robots.txt, sitemap.xml, images…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
