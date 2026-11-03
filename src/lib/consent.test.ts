import { describe, expect, it } from "vitest";
import { analyticsCookieNames, CONSENT_COOKIE, CONSENT_POLICY_VERSION, parseConsent, serializeConsent } from "./consent";

const cookieOf = (setCookie: string) => setCookie.split(";")[0]!;

describe("consent cookie", () => {
  it("round-trips a decision with the current policy version", () => {
    const header = cookieOf(serializeConsent(true, new Date("2026-11-02T10:00:00Z")));
    expect(parseConsent(`locale=en; ${header}`)).toEqual({ v: CONSENT_POLICY_VERSION, analytics: true, at: "2026-11-02T10:00:00.000Z" });
  });
  it("is strictly necessary and scoped: Path=/, SameSite=Lax, ~6 months", () => {
    expect(serializeConsent(false)).toMatch(/; Path=\/; Max-Age=15724800; SameSite=Lax$/);
  });
  it("treats an older policy version, garbage or absence as no decision (banner shown again)", () => {
    const old = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify({ v: CONSENT_POLICY_VERSION - 1, analytics: true, at: "x" }))}`;
    expect(parseConsent(old)).toBeNull();
    expect(parseConsent(`${CONSENT_COOKIE}=%7Bnot-json`)).toBeNull();
    expect(parseConsent("locale=ro")).toBeNull();
  });
  it("finds only Google Analytics cookies to delete on withdrawal", () => {
    expect(analyticsCookieNames("_ga=1; locale=en; _ga_CGNJVQNKZS=2; _gat=3; sn_consent=x")).toEqual(["_ga", "_ga_CGNJVQNKZS"]);
  });
});
