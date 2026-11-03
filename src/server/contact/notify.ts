import "server-only";
import { and, eq, isNull, lt, or, sql } from "drizzle-orm";
import { Resend } from "resend";
import { getDb } from "@/server/db/client";
import { contactSubmissions } from "@/server/db/schema";
import { env } from "@/server/env";
import { logger } from "@/server/lib/logger";

const CLAIM_TIMEOUT_SEC = 300;
const MAX_ATTEMPTS = 10;

/**
 * Outbox delivery (00 §A1): claims one un-notified submission atomically, emails the owner, marks it notified.
 * Called from after() right after the response, and again by the scheduled job for anything left behind.
 * The claim prevents two workers from emailing the same row at the same time.
 */
export async function notifySubmission(id: string): Promise<"sent" | "skipped" | "failed"> {
  const [row] = await getDb()
    .update(contactSubmissions)
    .set({ claimedAt: sql`now()`, notifyAttempts: sql`${contactSubmissions.notifyAttempts} + 1` })
    .where(and(
      eq(contactSubmissions.id, id),
      isNull(contactSubmissions.notifiedAt),
      lt(contactSubmissions.notifyAttempts, MAX_ATTEMPTS),
      or(isNull(contactSubmissions.claimedAt), lt(contactSubmissions.claimedAt, sql`now() - make_interval(secs => ${CLAIM_TIMEOUT_SEC})`)),
    ))
    .returning();
  if (!row) return "skipped";

  try {
    await sendEmail({ name: row.name, email: row.email, company: row.company, message: row.message, locale: row.locale, id: row.id });
    await getDb().update(contactSubmissions).set({ notifiedAt: sql`now()`, claimedAt: null }).where(eq(contactSubmissions.id, row.id));
    return "sent";
  } catch (err) {
    await getDb().update(contactSubmissions).set({ claimedAt: null }).where(eq(contactSubmissions.id, row.id));
    logger.error({ err, submissionId: row.id, attempt: row.notifyAttempts }, "contact notification failed");
    return "failed";
  }
}

/** Re-sends everything still un-notified (scheduled job). */
export async function notifyPending(limit = 20): Promise<{ sent: number; failed: number }> {
  const pending = await getDb()
    .select({ id: contactSubmissions.id })
    .from(contactSubmissions)
    .where(and(isNull(contactSubmissions.notifiedAt), lt(contactSubmissions.notifyAttempts, MAX_ATTEMPTS),
      lt(contactSubmissions.createdAt, sql`now() - interval '1 minute'`)))
    .limit(limit);
  let sent = 0, failed = 0;
  for (const { id } of pending) {
    const r = await notifySubmission(id);
    if (r === "sent") sent++;
    if (r === "failed") failed++;
  }
  return { sent, failed };
}

type Lead = { id: string; name: string; email: string; company: string | null; message: string; locale: string };

async function sendEmail(lead: Lead) {
  const e = env();
  if (!e.RESEND_API_KEY) {
    // Development/test only (env() requires the key in production).
    logger.info({ submissionId: lead.id }, "email not sent — RESEND_API_KEY not set (dev)");
    return;
  }
  const resend = new Resend(e.RESEND_API_KEY);
  // From = verified sending domain; Reply-To = visitor; user content as plain text only (05 §10.9).
  const { error } = await resend.emails.send({
    from: e.CONTACT_FROM_EMAIL,
    to: e.CONTACT_TO_EMAIL,
    replyTo: lead.email,
    subject: `Booking enquiry from ${lead.name.slice(0, 80)}${lead.company ? ` (${lead.company.slice(0, 60)})` : ""}`,
    text: `Name: ${lead.name}\nEmail: ${lead.email}\nAgency/company: ${lead.company ?? "—"}\nLanguage: ${lead.locale}\n\n${lead.message}\n\n— Submission ${lead.id}`,
  });
  if (error) throw new Error(`Resend: ${error.name}`);
}

/**
 * Retention (ADR SN-04, 09 §5.13.2): delete submissions older than RETENTION_DAYS once they were notified.
 * Un-notified rows are kept so a lead is never lost before the owner has seen it.
 * [LEGAL] the period is the owner's decision; default 365 days until confirmed.
 */
export async function deleteExpired(): Promise<number> {
  const days = env().RETENTION_DAYS;
  const deleted = await getDb()
    .delete(contactSubmissions)
    .where(and(
      sql`${contactSubmissions.notifiedAt} is not null`,
      lt(contactSubmissions.createdAt, sql`now() - make_interval(days => ${days})`),
    ))
    .returning({ id: contactSubmissions.id });
  if (deleted.length) logger.info({ count: deleted.length, days }, "expired contact submissions deleted");
  return deleted.length;
}
