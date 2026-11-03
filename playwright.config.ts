import { defineConfig, devices } from "@playwright/test";

// E2E against the PRODUCTION build with a real Postgres + Redis (10 §4). Build first with `npm run build:e2e`
// so NEXT_PUBLIC_* values (GA ID, site URL) match what the tests expect — they are inlined at build time.
// Test-only services: e2e/mock-resend.mjs replaces the email API via RESEND_BASE_URL.
const PORT = 3123;
const E2E_SITE_URL = "https://book.example.com"; // = SITE in e2e/helpers.ts
const env = {
  DATABASE_URL: process.env.E2E_DATABASE_URL ?? "postgres://postgres@localhost:5433/sn_test?host=/tmp",
  REDIS_URL: process.env.E2E_REDIS_URL ?? "redis://localhost:6380",
  RESEND_API_KEY: "re_test_key",
  RESEND_BASE_URL: "http://localhost:4010",
  CONTACT_TO_EMAIL: "owner@example.com",
  CONTACT_FROM_EMAIL: "Book <noreply@notify.example.com>",
  CLIENT_IP_SOURCE: "xff-trusted-hops",
  TRUSTED_PROXY_HOPS: "1",
  CRON_SECRET: "test-cron-secret-0123456789abcdef0123",
  SITE_ENV: "preview",
  NEXT_PUBLIC_SITE_URL: E2E_SITE_URL,
  NEXT_PUBLIC_GA_ID: "G-CGNJVQNKZS",
};

const config = defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    extraHTTPHeaders: { "x-forwarded-for": "203.0.113.10" }, // what a trusted proxy would append
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
  ],
  webServer: [
    { command: "node e2e/mock-resend.mjs", port: 4010, reuseExistingServer: false },
    { command: `npx next start -p ${PORT}`, port: PORT, env, reuseExistingServer: false, timeout: 120_000 },
  ],
});
export default config;
