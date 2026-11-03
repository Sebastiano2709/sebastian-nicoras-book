import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { consentCookie, PAGES } from "./helpers";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  return violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id}: ${v.nodes.length} — ${v.nodes[0]?.target}`);
}

// Every page and locale, desktop (chromium project) and mobile (@mobile → Pixel 7 project).
// The consent banner is part of the first view, so it is scanned too (09 §5.11 item 6).
for (const path of PAGES) {
  test(`axe: no serious or critical violations on ${path} (with consent banner) @mobile`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("region").first()).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
  });
}

test("axe: open lightbox and form error state have no serious violations @mobile", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.goto("/en");
  await page.locator("#portfolio .frame button").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
  await page.goto("/ro/contact");
  await page.getByRole("button", { name: "Trimite cererea" }).click();
  await expect(page.getByText("Verifică câmpurile marcate.")).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});

test("v1 defects stay fixed: one h1, unique ids, labels ≥ 13 px", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.goto("/en");
  await expect(page.locator("h1")).toHaveText(/Sebastiano\s*Nicoras/i);
  const dupes = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
    return ids.filter((id, i) => ids.indexOf(id) !== i);
  });
  expect(dupes).toEqual([]);
  await expect(page.locator("#measurements")).toHaveCount(1);
  const smallest = await page.evaluate(() =>
    Math.min(...[...document.querySelectorAll("header a, header button, .t-label, dt")].map((e) => parseFloat(getComputedStyle(e).fontSize))));
  expect(smallest).toBeGreaterThanOrEqual(13);
});

test("skip link is the first Tab stop and moves focus to main", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.goto("/ro");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Sari la conținut" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("focus is visible on navigation links (outline ≥ 2 px)", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en");
  await page.keyboard.press("Tab"); // skip link
  await page.keyboard.press("Tab"); // menu button
  await page.keyboard.press("Tab"); // wordmark (home link)
  const outline = await page.evaluate(() => { const s = getComputedStyle(document.activeElement!); return [s.outlineStyle, parseFloat(s.outlineWidth)]; });
  expect(outline[0]).toBe("solid");
  expect(outline[1]).toBeGreaterThanOrEqual(2);
});

test("aria-current: the menu marks the page you are on", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/contact");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const nav = page.getByRole("dialog").getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link", { name: "Booking enquiry" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Polaroids" })).not.toHaveAttribute("aria-current", /.*/);
});

test("menu is a modal dialog; Escape closes it and returns focus @mobile", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const toggle = page.getByRole("button", { name: "Menu", exact: true });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("dialog", { name: "Main navigation" });
  await expect(menu.getByRole("link", { name: "Polaroids" })).toBeVisible();
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
});

for (const width of [360, 390]) {
  test(`mobile bar stays one row and the language switch is reachable at ${width}px @mobile`, async ({ page, context }) => {
    await context.addCookies([consentCookie(false)]);
    await page.setViewportSize({ width, height: 800 });
    for (const path of ["/en", "/ro"]) {
      await page.goto(path);
      const lang = path === "/en" ? "Română" : "English";
      expect((await page.locator("header.bar > div").boundingBox())!.height, path).toBeLessThanOrEqual(72);
      await expect(page.locator("header.bar .bar-right").getByRole("link", { name: lang })).toBeVisible();
      await page.getByRole("button", { name: path === "/en" ? "Menu" : "Meniu", exact: true }).click();
      await expect(page.getByRole("dialog").getByRole("link", { name: lang })).toBeVisible();
    }
  });
}

test("mobile: the cover photo fills the first screen and the head is not cropped @mobile", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const box = await page.locator(".cover img").boundingBox();
  expect(box!.y).toBeLessThanOrEqual(1);
  await expect(page.locator(".cover img")).toHaveCSS("object-position", "46% 0%");
});

/** Horizontal overflow in px plus the widest offenders, so a failure names the element. */
async function overflowReport(page: Page) {
  return page.evaluate(() => {
    const W = window.innerWidth;
    const offenders = [...document.querySelectorAll("body *")]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && r.right > W + 1)
      .sort((a, b) => b.r.right - a.r.right)
      .slice(0, 3)
      .map(({ el, r }) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).slice(0, 40)} right=${Math.round(r.right)}`);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n && offenders.length < 6; n = walker.nextNode()) {
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (r.right > W + 1) { offenders.push(`text "${(n.textContent ?? "").trim().slice(0, 30)}" in <${n.parentElement?.tagName.toLowerCase()}> right=${Math.round(r.right)}`); break; }
      }
    }
    return { overflow: document.documentElement.scrollWidth - W, offenders };
  });
}

const WIDTHS = [320, 390, 768, 1024, 1280, 1440];
for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px on every page`, async ({ page, context }) => {
    await context.addCookies([consentCookie(false)]);
    await page.setViewportSize({ width, height: 900 });
    for (const path of PAGES) {
      await page.goto(path);
      const { overflow, offenders } = await overflowReport(page);
      expect(overflow, `${path} ${offenders.join(" | ")}`).toBeLessThanOrEqual(0);
    }
  });
}

for (const width of [768, 1280]) {
  test(`200% text size and WCAG 1.4.12 spacing: no overflow at ${width}px`, async ({ page, context }) => {
    await context.addCookies([consentCookie(false)]);
    await page.setViewportSize({ width, height: 900 });
    for (const path of PAGES) {
      await page.goto(path);
      await page.addStyleTag({ content: "html{font-size:200% !important} *{line-height:1.5 !important;letter-spacing:0.12em !important;word-spacing:0.16em !important} p{margin-bottom:2em !important}" });
      const { overflow, offenders } = await overflowReport(page);
      expect(overflow, `${path} ${offenders.join(" | ")}`).toBeLessThanOrEqual(0);
    }
  });
}

test("every photo is in the server HTML and visible without JavaScript (v1 defect 1)", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3123/en");
  await expect(page.locator(".talent .frame img, #portfolio img")).toHaveCount(10);
  await expect(page.locator("#polaroids img")).toHaveCount(6);
  for (const img of await page.locator(".frame img").all()) {
    await expect(img).toHaveCSS("opacity", "1");
    expect((await img.getAttribute("alt"))?.length).toBeGreaterThan(10);
  }
  await ctx.close();
});

test("images: next/image AVIF/WebP, only the cover is eager; every frame shows the whole photo", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.goto("/en");
  const imgs = await page.locator(".cover img, main img").evaluateAll((els) => els.map((e) => ({
    src: (e as HTMLImageElement).currentSrc || (e as HTMLImageElement).src,
    loading: e.getAttribute("loading"), priority: e.getAttribute("fetchpriority"),
  })));
  expect(imgs[0]?.priority).toBe("high");
  expect(imgs[0]?.loading).not.toBe("lazy");
  expect(imgs.slice(1).every((i) => i.loading === "lazy")).toBe(true);
  expect(imgs.every((i) => i.src.includes("/_next/image"))).toBe(true);
  const res = await page.request.get(imgs[0]!.src, { headers: { accept: "image/avif,image/webp,*/*" } });
  expect(res.headers()["content-type"]).toMatch(/image\/(avif|webp)/);
  // Owner's request 2026-11-03: no photo is cropped — each frame has the photo's own proportions.
  const mismatched = await page.locator(".frame").evaluateAll((els) => els.filter((f) => {
    const r = f.getBoundingClientRect();
    const [w, h] = (f as HTMLElement).style.aspectRatio.split("/").map(Number);
    return !w || !h || Math.abs(r.width / r.height - w / h) > 0.01;
  }).length);
  expect(mismatched).toBe(0);
});

test("no console errors or failed requests on the main pages", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  const problems: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") problems.push(`console: ${m.text()}`); });
  page.on("response", (r) => { if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });
  for (const path of ["/en", "/ro", "/en/contact", "/ro/cookies"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.mouse.wheel(0, 20000);
    await page.waitForTimeout(500);
  }
  expect(problems).toEqual([]);
});

test("language switcher links to the equivalent page and remembers the choice", async ({ page, context }) => {
  await context.addCookies([consentCookie(false)]);
  await page.goto("/ro/contact");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/contact$/);
  expect((await context.cookies()).find((c) => c.name === "locale")?.value).toBe("en");
});

test("reduced motion: reveal is never armed", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  await ctx.addCookies([consentCookie(false)]);
  const page = await ctx.newPage();
  await page.goto("http://localhost:3123/en");
  await expect(page.locator(".reveal--armed")).toHaveCount(0);
  await ctx.close();
});
