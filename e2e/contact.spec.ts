import { expect, test } from "@playwright/test";
import { ageRows, consentCookie, emails, rowsFor, setEmailMode, uniqueEmail } from "./helpers";

test.beforeEach(async ({ context }) => {
  await context.addCookies([consentCookie(false)]); // banner decided; not under test here
  setEmailMode("ok");
  const { execSync } = await import("node:child_process");
  execSync("redis-cli -p 6380 --scan --pattern 'rl:*' | xargs -r redis-cli -p 6380 del", { shell: "/bin/bash" }); // fresh limiter window
});

test("empty submit shows localized errors, marks fields invalid and focuses the summary", async ({ page }) => {
  await page.goto("/ro/contact");
  await page.getByRole("button", { name: "Trimite cererea" }).click();
  await expect(page.getByText("Verifică câmpurile marcate.")).toBeFocused();
  await expect(page.getByLabel("Nume")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Scrie o adresă de email validă.")).toBeVisible();
  // the optional company field is never marked invalid when empty
  await expect(page.getByLabel(/Agenție sau companie/)).not.toHaveAttribute("aria-invalid", "true");
});

test("valid submission: stored with company, success shown, owner emailed with Reply-To = visitor", async ({ page }) => {
  const email = uniqueEmail("ok");
  await page.goto("/en/contact");
  await page.getByLabel("Name").fill("Ana Pop");
  await page.getByLabel("Email").fill(`  ${email.toUpperCase()} `);
  await page.getByLabel(/Agency or company/).fill("Example Models");
  await page.getByRole("textbox", { name: "Message" }).fill("Editorial shoot in Milan, 12–14 March. Are you available?");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Thank you");
  await expect.poll(async () => (await rowsFor(email))[0]?.notified_at ?? null).not.toBeNull();
  const rows = await rowsFor(email);
  expect(rows).toHaveLength(1);
  expect(rows[0]?.locale).toBe("en");
  expect(rows[0]?.company).toBe("Example Models");
  const sent = emails().find((m) => m.text.includes(email));
  expect(sent?.to).toEqual("owner@example.com");
  expect(sent?.reply_to).toEqual(email);
  expect(sent?.from).toBe("Book <noreply@notify.example.com>");
  expect(sent?.subject).toContain("Example Models");
  expect(sent?.text).toContain("Agency/company: Example Models");
});

test("company is optional: stored as null when left empty", async ({ page }) => {
  const email = uniqueEmail("nocompany");
  await page.goto("/en/contact");
  await page.getByLabel("Name").fill("Ana");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("textbox", { name: "Message" }).fill("Commercial campaign, dates to be confirmed.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toBeVisible();
  await expect.poll(async () => (await rowsFor(email)).length).toBe(1);
  expect((await rowsFor(email))[0]?.company).toBeNull();
});

test("email provider down: lead is kept, then the scheduled job delivers it", async ({ page, request }) => {
  setEmailMode("fail");
  const email = uniqueEmail("outbox");
  await page.goto("/ro/contact");
  await page.getByLabel("Nume").fill("Ion");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("textbox", { name: "Mesaj" }).fill("Vreau să discutăm o campanie.");
  await page.getByRole("button", { name: "Trimite cererea" }).click();
  await expect(page.getByRole("status")).toBeVisible();
  await expect.poll(async () => (await rowsFor(email))[0]?.notify_attempts ?? 0).toBeGreaterThan(0);
  expect((await rowsFor(email))[0]?.notified_at).toBeNull(); // stored, not yet notified
  setEmailMode("ok");
  await ageRows(email);
  const res = await request.get("/api/cron/notify", { headers: { authorization: "Bearer test-cron-secret-0123456789abcdef0123" } });
  expect(res.status()).toBe(200);
  expect((await res.json()).sent).toBeGreaterThanOrEqual(1);
  expect((await rowsFor(email))[0]?.notified_at).not.toBeNull();
  expect(emails().filter((m) => m.text.includes(email))).toHaveLength(1);
});

test("double click creates exactly one submission", async ({ page }) => {
  const email = uniqueEmail("dbl");
  await page.goto("/en/contact");
  await page.getByLabel("Name").fill("Ana");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("textbox", { name: "Message" }).fill("Testing a double click on submit.");
  await page.getByRole("button", { name: "Send enquiry" }).dblclick();
  await expect(page.getByRole("status")).toBeVisible();
  await expect.poll(async () => (await rowsFor(email)).length).toBe(1);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the form still submits and the lead is stored", async ({ page }) => {
    const email = uniqueEmail("nojs");
    await page.goto("/en/contact");
    await page.getByLabel("Name").fill("No JS");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("textbox", { name: "Message" }).fill("Submitted with JavaScript disabled.");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect.poll(async () => (await rowsFor(email)).length).toBe(1);
    await expect(page.getByText("Thank you")).toBeVisible();
  });
});

test("rate limit: the 6th submission from one IP within 10 minutes is refused", async ({ page }) => {
  const tag = uniqueEmail("rl");
  await page.setExtraHTTPHeaders({ "x-forwarded-for": "198.51.100.77" });
  for (let i = 0; i < 6; i++) {
    await page.goto("/en/contact");
    await page.getByLabel("Name").fill("Rate");
    await page.getByLabel("Email").fill(`${i}-${tag}`);
    await page.getByRole("textbox", { name: "Message" }).fill("Rate limit check message.");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    if (i < 5) await expect(page.getByRole("status")).toBeVisible();
  }
  await expect(page.getByText("Too many messages. Please try again later.")).toBeVisible();
});

test("database down: the visitor is told nothing was sent, and input is kept", async ({ page }) => {
  // Forced failure (13 §10.2): the table is renamed for the duration of the test, so the insert fails.
  const { execSync } = await import("node:child_process");
  const psql = (sql: string) => execSync(`psql -h /tmp -p 5433 -U postgres -d sn_test -c "${sql}"`, { stdio: "pipe" });
  psql("alter table contact_submissions rename to contact_submissions_off");
  try {
    await page.goto("/en/contact");
    await page.getByLabel("Name").fill("Outage");
    await page.getByLabel("Email").fill(uniqueEmail("dbdown"));
    await page.getByRole("textbox", { name: "Message" }).fill("This must not show a success message.");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText(/can't be received right now/)).toBeFocused();
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(page.getByLabel("Name")).toHaveValue("Outage");
  } finally {
    psql("alter table contact_submissions_off rename to contact_submissions");
  }
});
