import { expect, test } from "@playwright/test";
import { consentCookie, PAGES, SITE } from "./helpers";

test.beforeEach(async ({ context }) => { await context.addCookies([consentCookie(false)]); });

test("/ negotiates the locale (cookie → Accept-Language → en) and varies the response", async ({ request }) => {
  const ro = await request.get("/", { headers: { "accept-language": "ro-RO,ro;q=0.9" }, maxRedirects: 0 });
  expect(ro.status()).toBe(307); expect(ro.headers().location).toBe("/ro"); expect(ro.headers().vary).toContain("Accept-Language");
  const en = await request.get("/", { headers: { "accept-language": "en-GB,en;q=0.9" }, maxRedirects: 0 });
  expect(en.headers().location).toBe("/en");
  const other = await request.get("/", { headers: { "accept-language": "it-IT,it;q=0.9" }, maxRedirects: 0 });
  expect(other.headers().location).toBe("/en"); // ADR SN-02: English is the fallback
  const cookie = await request.get("/", { headers: { "accept-language": "en", cookie: "locale=ro" }, maxRedirects: 0 });
  expect(cookie.headers().location).toBe("/ro");
});

test("localized URLs are never redirected by language; unprefixed URLs go to /en once", async ({ request }) => {
  const en = await request.get("/en/contact", { headers: { "accept-language": "ro" }, maxRedirects: 0 });
  expect(en.status()).toBe(200);
  const legacy = await request.get("/contact", { maxRedirects: 0 });
  expect(legacy.status()).toBe(308); expect(legacy.headers().location).toBe("/en/contact");
});

test("old comp-card URL redirects permanently to the corrected file", async ({ request }) => {
  const old = await request.get("/Sebastian_Nicoras_CompCard.pdf", { maxRedirects: 0 });
  expect(old.status()).toBe(308);
  expect(old.headers().location).toBe("/Sebastiano_Nicoras_CompCard.pdf");
  const pdf = await request.get("/Sebastiano_Nicoras_CompCard.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
});

test("unknown page inside a locale returns 404", async ({ request }) => {
  expect((await request.get("/en/does-not-exist")).status()).toBe(404);
});

for (const path of PAGES) {
  test(`SEO basics on ${path}`, async ({ page, request }) => {
    const lang = path.split("/")[1] as "en" | "ro";
    const rest = path.slice(3);
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${path}`);
    await expect(page.locator('link[rel="alternate"][hreflang="ro"]')).toHaveAttribute("href", `${SITE}/ro${rest}`);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", `${SITE}/en${rest}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", rest === "" ? new RegExp(`^${SITE.replace(/\./g, "\\.")}/?$`) : `${SITE}/en${rest}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(og).toBe(`${SITE}/og/og-${lang}.jpg`);
    const ogFile = await request.get(new URL(og!).pathname); // v1 defect 4: the file must exist
    expect(ogFile.status()).toBe(200);
    // heading levels never skip (h1 → h2 → h3 …)
    const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!, `${path} heading order`).toBeLessThanOrEqual(1);
  });
}

test("titles are unique per page", async ({ page }) => {
  const titles = new Set<string>();
  for (const path of PAGES) { await page.goto(path); titles.add(await page.title()); }
  expect(titles.size).toBe(PAGES.length);
});

test("Person structured data matches the visible facts", async ({ page }) => {
  await page.goto("/en");
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(data).toMatchObject({ "@type": "Person", name: "Sebastiano Nicoras", address: { addressLocality: "Cluj-Napoca" }, sameAs: ["https://instagram.com/sebastiano.nicoras"] });
});

test("robots.txt blocks non-production; sitemap lists both locales", async ({ request }) => {
  expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow: \//);
  const sm = await (await request.get("/sitemap.xml")).text();
  expect(sm).toContain(`${SITE}/ro/contact`); expect(sm).toContain(`${SITE}/en/contact`); expect(sm).toContain(`${SITE}/en<`);
});

test("security headers are present; CSP allows only the Google Analytics hosts it needs", async ({ request }) => {
  const h = (await request.get("/en")).headers();
  const csp = h["content-security-policy"] ?? "";
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toMatch(/script-src 'self' 'unsafe-inline' https:\/\/www\.googletagmanager\.com/);
  expect(csp).toMatch(/connect-src 'self' .*https:\/\/\*\.google-analytics\.com/);
  expect(h["strict-transport-security"]).toMatch(/max-age=\d+/);
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("cron endpoint rejects a missing or wrong secret", async ({ request }) => {
  expect((await request.get("/api/cron/notify")).status()).toBe(401);
  expect((await request.get("/api/cron/notify", { headers: { authorization: "Bearer wrong" } })).status()).toBe(401);
});
