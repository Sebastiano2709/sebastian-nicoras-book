import { beforeEach, expect, it, vi } from "vitest";

const calls: string[] = [];
const insertValues = vi.fn();
vi.mock("next/server", () => ({ after: vi.fn((fn: () => unknown) => { calls.push("after"); return fn(); }) }));
vi.mock("@/server/lib/client-ip", () => ({ getClientIp: vi.fn(async () => "203.0.113.7") }));
vi.mock("@/server/lib/rate-limit", () => ({ rateLimit: vi.fn(async () => ({ ok: true, remaining: 4 })) }));
vi.mock("@/server/lib/logger", () => ({ logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() } }));
vi.mock("@/server/contact/notify", () => ({ notifySubmission: vi.fn(async () => { calls.push("notify"); return "sent"; }) }));
vi.mock("@/server/db/client", () => ({
  getDb: () => ({ insert: () => ({ values: (v: unknown) => { insertValues(v); calls.push("insert"); return { returning: async () => [{ id: "sub_1" }] }; } }) }),
}));

import { submitContact } from "./actions";
import { rateLimit } from "@/server/lib/rate-limit";

const form = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
beforeEach(() => { calls.length = 0; insertValues.mockClear(); });

it("persists before notifying and normalises email", async () => {
  const res = await submitContact({ status: "idle" }, form({ name: " Ana ", email: " ANA@Example.com ", message: "I would like a quote.", locale: "en" }));
  expect(res).toEqual({ status: "success" });
  expect(calls).toEqual(["insert", "after", "notify"]);
  expect(insertValues).toHaveBeenCalledWith({ name: "Ana", email: "ana@example.com", company: null, message: "I would like a quote.", locale: "en" });
});

it("returns localized field errors and stores nothing", async () => {
  const res = await submitContact({ status: "idle" }, form({ name: "", email: "x", message: "short", locale: "ro" }));
  expect(res.status).toBe("error");
  expect(res.fieldErrors?.email?.[0]).toBe("Scrie o adresă de email validă.");
  expect(calls).toEqual([]);
});

it("honeypot reports success but stores nothing", async () => {
  const res = await submitContact({ status: "idle" }, form({ name: "Bot", email: "bot@example.com", message: "Buy links now please", website: "x", locale: "en" }));
  expect(res).toEqual({ status: "success" });
  expect(calls).toEqual([]);
});

it("fails closed when the limiter store is unavailable", async () => {
  vi.mocked(rateLimit).mockResolvedValueOnce({ ok: false, remaining: 0, reason: "unavailable" });
  const res = await submitContact({ status: "idle" }, form({ name: "Ana", email: "ana@example.com", message: "I would like a quote.", locale: "en" }));
  expect(res).toMatchObject({ status: "error", message: expect.stringMatching(/try again in a few minutes/i) });
  expect(calls).toEqual([]);
});

it("stores the trimmed company and rejects one longer than 120 characters", async () => {
  const ok = await submitContact({ status: "idle" }, form({ name: "Ana", email: "ana@example.com", company: "  Example Models ", message: "Editorial in Milan, March.", locale: "en" }));
  expect(ok).toEqual({ status: "success" });
  expect(insertValues).toHaveBeenCalledWith(expect.objectContaining({ company: "Example Models" }));
  calls.length = 0;
  const bad = await submitContact({ status: "idle" }, form({ name: "Ana", email: "ana@example.com", company: "x".repeat(121), message: "Editorial in Milan, March.", locale: "en" }));
  expect(bad.status).toBe("error");
  expect(bad.fieldErrors?.company?.[0]).toBe("Please use at most 120 characters.");
  expect(bad.values?.company).toBe("x".repeat(121));
  expect(calls).toEqual([]);
});

it("unknown locale values fall back to English messages", async () => {
  const res = await submitContact({ status: "idle" }, form({ name: "", email: "x", message: "short", locale: "de" }));
  expect(res.fieldErrors?.name?.[0]).toBe("Please enter your name.");
});
