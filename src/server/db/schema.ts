import { sql } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Contact submissions = the source of truth for leads (05 §10.9) and the notification outbox (00 §A1).
export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"), // agency or company — optional (Phase 1 Q3)
    message: text("message").notNull(),
    locale: text("locale").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    notifyAttempts: integer("notify_attempts").notNull().default(0),
  },
  (t) => [index("contact_submissions_unnotified_idx").on(t.createdAt).where(sql`notified_at is null`)],
);
