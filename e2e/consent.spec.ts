import { expect, test, type Page } from "@playwright/test";

// ADR SN-03 acceptance (brief): no GA request before acceptance, GA after acceptance, withdrawal works.
// Google is never contacted from the test machine: every Google request is answered by a local stub and counted.
const GOOGLE = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com/;

async function countGoogle(page: Page) {
  const hits: string[] = [];
  await page.route(GOOGLE, (route) => {
    hits.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "/* stub */" });
  });
  page.on("request", (r) => { if (GOOGLE.test(r.url()) && !hits.includes(r.url())) hits.push(r.url()); });
  return hits;
}

const banner = (page: Page) => page.getByRole("region", { name: "Analytics cookies" });

test("first visit: banner shown, accept and reject have equal prominence, no request to Google @mobile", async ({ page }) => {
  const hits = await countGoogle(page);
  await page.goto("/en");
  await expect(banner(page)).toBeVisible();
  const accept = page.getByRole("button", { name: "Accept analytics" });
  const reject = page.getByRole("button", { name: "Reject" });
  const style = (el: typeof accept) => el.evaluate((b) => {
    const s = getComputedStyle(b);
    return [s.fontSize, s.fontWeight, s.borderTopWidth, s.borderTopColor, s.backgroundColor, s.color, s.minHeight].join("|");
  });
  expect(await style(accept)).toBe(await style(reject));
  const [a, r] = [await accept.boundingBox(), await reject.boundingBox()];
  expect(Math.abs((a?.height ?? 0) - (r?.height ?? 0))).toBeLessThanOrEqual(1);
  await page.waitForTimeout(1500);
  expect(hits).toEqual([]);
});

test("reject: no request to Google now or after reload; choice stored", async ({ page, context }) => {
  const hits = await countGoogle(page);
  await page.goto("/en");
  await page.getByRole("button", { name: "Reject" }).click();
  await expect(banner(page)).toBeHidden();
  await page.reload();
  await expect(banner(page)).toBeHidden();
  await page.waitForTimeout(1500);
  expect(hits).toEqual([]);
  const stored = (await context.cookies()).find((c) => c.name === "sn_consent");
  expect(JSON.parse(decodeURIComponent(stored!.value))).toMatchObject({ v: 1, analytics: false });
});

test("accept: GA4 loads with the configured ID, and again on the next page without a banner", async ({ page }) => {
  const hits = await countGoogle(page);
  await page.goto("/en");
  expect(hits).toEqual([]);
  await page.getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(() => hits.some((u) => u.includes("gtag/js?id=G-CGNJVQNKZS"))).toBe(true);
  await page.goto("/ro/contact");
  await expect(page.getByRole("region", { name: "Cookies de analiză" })).toBeHidden();
  await expect.poll(() => hits.filter((u) => u.includes("gtag/js")).length).toBeGreaterThanOrEqual(2);
});

test("withdrawal: Cookie settings re-opens the banner; Reject deletes _ga cookies and Google stops loading", async ({ page, context }) => {
  const hits = await countGoogle(page);
  await page.goto("/en");
  await page.getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(() => hits.length).toBeGreaterThan(0);
  // what GA would have set (the stub does not set cookies)
  await context.addCookies([
    { name: "_ga", value: "GA1.1.123.456", domain: "localhost", path: "/" },
    { name: "_ga_CGNJVQNKZS", value: "GS1.1.1.1", domain: "localhost", path: "/" },
  ]);
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await expect(banner(page)).toBeVisible();
  await expect(page.getByText("Current choice: analytics accepted.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reject" })).toBeFocused(); // focus moved into the banner on request
  hits.length = 0;
  await Promise.all([page.waitForLoadState("load"), page.getByRole("button", { name: "Reject" }).click()]);
  await page.waitForTimeout(1500);
  expect(hits).toEqual([]);
  const names = (await context.cookies()).map((c) => c.name);
  expect(names).not.toContain("_ga");
  expect(names).not.toContain("_ga_CGNJVQNKZS");
  await page.goto("/ro");
  await page.waitForTimeout(1000);
  expect(hits).toEqual([]);
});

test("cookie policy page offers the same settings control", async ({ page }) => {
  await page.goto("/en/cookies");
  await page.getByRole("button", { name: "Reject" }).click();
  await page.locator("main").getByRole("button", { name: "Cookie settings" }).click();
  await expect(page.getByText("Current choice: analytics rejected.")).toBeVisible();
});

test("without JavaScript there is no banner and no request to Google", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  const hits = await countGoogle(page);
  await page.goto("http://localhost:3123/en");
  await expect(page.getByRole("region", { name: "Analytics cookies" })).toHaveCount(0);
  expect(hits).toEqual([]);
  await ctx.close();
});
