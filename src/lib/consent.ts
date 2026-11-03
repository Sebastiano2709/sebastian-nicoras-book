// Consent storage (ADR SN-03; 09 §5.11, §5.13.3). One strictly necessary first-party cookie that holds only
// the choice, the policy version and a timestamp. Bump CONSENT_POLICY_VERSION when purposes or vendors
// change: an older stored version counts as "no decision" and the banner is shown again.
export const CONSENT_COOKIE = "sn_consent";
export const CONSENT_POLICY_VERSION = 1;
export const CONSENT_MAX_AGE_SEC = 60 * 60 * 24 * 182; // ≈ 6 months [ASSUMPTION — privacy owner confirms the re-prompt interval]
export const CONSENT_OPEN_EVENT = "sn:consent-open";

export type StoredConsent = { v: number; analytics: boolean; at: string };

export function parseConsent(cookieHeader: string): StoredConsent | null {
  const raw = cookieHeader.split(/;\s*/).find((c) => c.startsWith(`${CONSENT_COOKIE}=`))?.slice(CONSENT_COOKIE.length + 1);
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw)) as Partial<StoredConsent>;
    if (value.v !== CONSENT_POLICY_VERSION || typeof value.analytics !== "boolean" || typeof value.at !== "string") return null;
    return { v: value.v, analytics: value.analytics, at: value.at };
  } catch {
    return null;
  }
}

export function serializeConsent(analytics: boolean, now = new Date()): string {
  const value: StoredConsent = { v: CONSENT_POLICY_VERSION, analytics, at: now.toISOString() };
  return `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${CONSENT_MAX_AGE_SEC}; SameSite=Lax`;
}

/** Names of the Google Analytics cookies to remove on withdrawal (_ga and _ga_<container-id>). */
export function analyticsCookieNames(cookieHeader: string): string[] {
  return cookieHeader
    .split(/;\s*/)
    .map((c) => c.split("=")[0] ?? "")
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
}
