import { z } from "zod";
import type ro from "@/dictionaries/ro.json";

// Field rules for the canonical action (05 §10.9). Normalise BEFORE validating email (Zod 4: .pipe(z.email())).
// Fields: Phase 1 Q3 default — name, email, agency/company (optional), message.
export function contactSchema(msg: (typeof ro)["contact"]["errors"]) {
  return z.object({
    name: z.string().trim().min(1, msg.name).max(100),
    email: z.string().trim().toLowerCase().max(254).pipe(z.email(msg.email)),
    company: z.string().trim().max(120, msg.company).transform((v) => (v === "" ? null : v)),
    message: z.string().trim().min(10, msg.message).max(5000),
    website: z.string().max(0).optional(), // honeypot
    locale: z.enum(["en", "ro"]),
  });
}

export type ContactField = "name" | "email" | "company" | "message";
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string[]>>;
  values?: Partial<Record<ContactField, string>>;
};
