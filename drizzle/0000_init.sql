CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"locale" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notified_at" timestamp with time zone,
	"claimed_at" timestamp with time zone,
	"notify_attempts" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_submissions_unnotified_idx" ON "contact_submissions" USING btree ("created_at") WHERE notified_at is null;