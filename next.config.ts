import type { NextConfig } from "next";

// ADR-002 (starter) + SN-01: static CSP without nonces so pages stay prerendered (09 §6.1 strategy table).
// SN-03: Google Analytics origins are allowed only when a GA4 ID is configured. Hosts per Google's CSP guide
// for the Google tag (developers.google.com/tag-platform/security/guides/csp, read 2026-11-02). The browser
// still makes no request to them before consent — the scripts are not rendered until the visitor accepts.
const gaEnabled = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "");
const isDev = process.env.NODE_ENV === "development";
const gtm = "https://www.googletagmanager.com";
const ga = "https://*.google-analytics.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${gaEnabled ? ` ${gtm}` : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data:${gaEnabled ? ` ${gtm} ${ga}` : ""}`,
  "font-src 'self'",
  `connect-src 'self'${gaEnabled ? ` ${gtm} ${ga} https://*.analytics.google.com https://*.google.com` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// HSTS: start short and raise after HTTPS is confirmed on every host name (10 §17A.3).
const hstsMaxAge = process.env.HSTS_MAX_AGE ?? "86400";

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: `max-age=${hstsMaxAge}` },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1200, 1600, 2048],
    qualities: [75, 85],
  },
  async redirects() {
    // Comp card renamed to the confirmed spelling; links shared before v2 keep working (Phase 1 brief).
    return [{ source: "/Sebastian_Nicoras_CompCard.pdf", destination: "/Sebastiano_Nicoras_CompCard.pdf", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/Sebastiano_Nicoras_CompCard.pdf", headers: [{ key: "Content-Disposition", value: 'inline; filename="Sebastiano_Nicoras_CompCard.pdf"' }] },
    ];
  },
};

export default nextConfig;
