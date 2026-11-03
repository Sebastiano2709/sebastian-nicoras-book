// The ONE place for identity data (09 §5.13.5). Every value is a confirmed fact from the Phase 1 brief (13 N2).
// Provider block (Law 365/2002) and ANPC SAL pictogram are OFF: Q4 default — personal book, no invoicing entity
// declared. [LEGAL] counsel confirms; switch `provider` on with real data if that changes.
export const person = {
  name: "Sebastiano Nicoras",
  email: "sebastiano.nicoras@gmail.com",
  instagramHandle: "@sebastiano.nicoras",
  instagramUrl: "https://instagram.com/sebastiano.nicoras",
  compCard: "/Sebastiano_Nicoras_CompCard.pdf",
  city: "Cluj-Napoca",
  countryCode: "RO",
} as const;

export const provider = null; // [CLIENT/LEGAL: provider data only if invoicing as PFA/company — Phase 1 Q4]
export const showSal = false; // [LEGAL: ANPC SAL — probably not applicable, counsel confirms]

// Measurements — confirmed values (brief). Labels come from the dictionaries.
export const measurements = [
  { key: "height", value: "181 cm", alt: "5'11\"" },
  { key: "weight", value: "74 kg", alt: "162 lbs" },
  { key: "chest", value: "99 cm", alt: "39\"" },
  { key: "waist", value: "81 cm", alt: "31.5\"" },
  { key: "hips", value: "95 cm", alt: "37\"" },
  { key: "suit", value: "50 EU", alt: null },
  { key: "shoes", value: "42 EU", alt: "9–9.5 US" },
  { key: "hair", value: null, alt: null },
  { key: "eyes", value: null, alt: null },
] as const;
export type MeasurementKey = (typeof measurements)[number]["key"];

// GA4 is configured per environment (Production only); without it no banner and no request (ADR SN-03).
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Routes that exist in every locale; used by navigation, sitemap and alternates.
export const routes = ["", "/contact", "/privacy", "/cookies", "/accessibility"] as const;
export type RoutePath = (typeof routes)[number];
