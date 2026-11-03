import pg from "pg";
const { Pool } = pg;
import { readFileSync, writeFileSync } from "node:fs";

const pool = new Pool({ connectionString: process.env.E2E_DATABASE_URL ?? "postgres://postgres@localhost:5433/sn_test?host=/tmp", max: 2 });

export async function rowsFor(email: string) {
  const { rows } = await pool.query<{ id: string; notified_at: Date | null; locale: string; notify_attempts: number; company: string | null }>(
    "select id, notified_at, locale, notify_attempts, company from contact_submissions where email = $1", [email]);
  return rows;
}
export async function ageRows(email: string) {
  await pool.query("update contact_submissions set created_at = now() - interval '5 minutes', claimed_at = null where email = $1", [email]);
}
export function emails(): { to: string | string[]; from: string; reply_to?: string | string[]; subject: string; text: string }[] {
  return readFileSync(".e2e-tmp/emails.jsonl", "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
}
export function setEmailMode(mode: "ok" | "fail") { writeFileSync(".e2e-tmp/resend-mode.txt", mode); }
export const uniqueEmail = (tag: string) => `e2e+${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.local`;
export const SITE = "https://book.example.com"; // must equal NEXT_PUBLIC_SITE_URL used by `npm run build:e2e`
export const PAGES = ["/en", "/ro", "/en/contact", "/ro/contact", "/en/privacy", "/ro/privacy", "/en/cookies", "/ro/cookies", "/en/accessibility", "/ro/accessibility"] as const;
/** Pre-sets a consent decision so tests that are not about the banner see the page without it. */
export const consentCookie = (analytics: boolean) => ({
  name: "sn_consent", value: encodeURIComponent(JSON.stringify({ v: 1, analytics, at: "2026-11-02T00:00:00.000Z" })),
  domain: "localhost", path: "/",
});
