import { expect, test } from "@playwright/test";
import { consentCookie } from "./helpers";

// v1 defect 5: the viewer must be a real dialog opened by buttons, keyboard-operable, with focus return and swipe.
test.beforeEach(async ({ context }) => { await context.addCookies([consentCookie(false)]); });

// The portfolio's first photo sits next to the name (talent block); the rest are in the #portfolio grid.
const portfolioButtons = (page: import("@playwright/test").Page) => page.locator(".talent .frame button, #portfolio .frame button");

test("keyboard: open with Enter, arrows step and wrap, Escape closes and returns focus", async ({ page }) => {
  await page.goto("/en");
  const third = portfolioButtons(page).nth(2);
  await expect(third).toHaveAccessibleName(/^View larger: Walking down outdoor steps/);
  await third.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Image viewer: Portfolio" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("3 of 10")).toBeVisible();
  const shown = dialog.getByRole("img");
  await expect(shown).toHaveAccessibleName(/Walking down outdoor steps/);
  await expect.poll(() => shown.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
  // focus is inside the dialog (modal: the page behind is inert)
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("4 of 10")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText("2 of 10")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText("10 of 10")).toBeVisible(); // wraps
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(third).toBeFocused();
});

test("Tab stays inside the open dialog; buttons close and navigate", async ({ page }) => {
  await page.goto("/en");
  await portfolioButtons(page).first().click();
  const dialog = page.getByRole("dialog");
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !document.activeElement || document.activeElement === document.body || !!document.activeElement.closest("dialog"));
    expect(inside, `tab ${i}`).toBe(true);
  }
  await dialog.getByRole("button", { name: "Next image" }).click();
  await expect(dialog.getByText("2 of 10")).toBeVisible();
  await dialog.getByRole("button", { name: "Previous image" }).click();
  await expect(dialog.getByText("1 of 10")).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  await expect(portfolioButtons(page).first()).toBeFocused();
});

test("polaroids open their own set; swipe left/right changes image @mobile", async ({ page }) => {
  await page.goto("/ro");
  await page.locator("#polaroids").getByRole("button").first().click();
  const dialog = page.getByRole("dialog", { name: "Vizualizare imagine: Polaroiduri" });
  await expect(dialog.getByText("1 din 6")).toBeVisible();
  const box = await dialog.locator(".lb-stage").boundingBox();
  if (!box) throw new Error("no image area");
  const y = box.y + box.height / 2;
  const swipe = async (from: number, to: number) => {
    await page.mouse.move(from, y); await page.mouse.down(); await page.mouse.move(to, y, { steps: 6 }); await page.mouse.up();
  };
  await swipe(box.x + box.width * 0.8, box.x + box.width * 0.2); // swipe left → next
  await expect(dialog.getByText("2 din 6")).toBeVisible();
  await swipe(box.x + box.width * 0.2, box.x + box.width * 0.8); // swipe right → previous
  await expect(dialog.getByText("1 din 6")).toBeVisible();
  await swipe(box.x + box.width * 0.5, box.x + box.width * 0.5 + 20); // 20 px drag (< 50 px threshold) → nothing
  await expect(dialog.getByText("1 din 6")).toBeVisible();
});

test("closing the viewer releases the page scroll lock", async ({ page }) => {
  await page.goto("/en");
  await portfolioButtons(page).nth(1).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden"); // scroll lock released
});
