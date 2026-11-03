"use server";

import { after } from "next/server";
import { z } from "zod";
import { getDb } from "@/server/db/client";
import { contactSubmissions } from "@/server/db/schema";
import { rateLimit } from "@/server/lib/rate-limit";
import { getClientIp } from "@/server/lib/client-ip";
import { logger } from "@/server/lib/logger";
import { notifySubmission } from "@/server/contact/notify";
import ro from "@/dictionaries/ro.json";
import en from "@/dictionaries/en.json";
import { contactSchema, type ContactState } from "./schema";

/** Canonical lead flow (05 §10.9): rate limit → validate → persist → notify (outbox, 00 §A1). */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const locale = formData.get("locale") === "ro" ? "ro" : "en";
  const t = (locale === "ro" ? ro : en).contact;

  // 1. Rate limit on the trusted client IP; the limiter fails closed.
  let ip: string;
  try {
    ip = await getClientIp();
  } catch (err) {
    logger.error({ err }, "client ip unavailable");
    return { status: "error", message: t.unavailable };
  }
  const limit = await rateLimit(`contact:${ip}`, { limit: 5, windowSec: 600 });
  if (!limit.ok) return { status: "error", message: limit.reason === "unavailable" ? t.unavailable : t.limited };

  // 2. Validate on the server.
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: (formData.get("website") as string | null) ?? undefined,
    locale,
  };
  const values = { name: raw.name, email: raw.email, company: raw.company, message: raw.message };
  const parsed = contactSchema(t.errors).safeParse(raw);
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return { status: "success" }; // honeypot
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      message: t.errorSummary,
      fieldErrors: { name: fieldErrors.name, email: fieldErrors.email, company: fieldErrors.company, message: fieldErrors.message },
      values,
    };
  }

  // 3. Persist first — the database, not the inbox, is the source of truth.
  const { name, email, company, message } = parsed.data;
  let id: string;
  try {
    const [row] = await getDb().insert(contactSubmissions).values({ name, email, company, message, locale }).returning({ id: contactSubmissions.id });
    if (!row) throw new Error("insert returned no row");
    id = row.id;
  } catch (err) {
    logger.error({ err }, "failed to store contact submission");
    return { status: "error", message: t.unavailable, values };
  }

  // 4. Notify after the response; the scheduled job re-sends anything that fails here.
  after(async () => {
    try { await notifySubmission(id); } catch (err) { logger.error({ err, submissionId: id }, "after() notify crashed"); }
  });

  return { status: "success" };
}
