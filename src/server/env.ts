import "server-only";
import { z } from "zod";

// 05 §2.9 pattern: validated once; production refuses to run without what the canonical flows need.
const Env = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.url(),
    REDIS_URL: z.url().optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    CONTACT_TO_EMAIL: z.email(),
    CONTACT_FROM_EMAIL: z.string().min(3), // e.g. "Site <noreply@notify.example.ro>" — verified sending domain
    CLIENT_IP_SOURCE: z.enum(["vercel", "cloudflare", "xff-trusted-hops"]).optional(),
    CRON_SECRET: z.string().min(32).optional(),
    RETENTION_DAYS: z.coerce.number().int().min(1).max(3650).default(365), // [LEGAL] owner confirms
  })
  .superRefine((e, ctx) => {
    if (e.NODE_ENV !== "production") return;
    for (const key of ["REDIS_URL", "RESEND_API_KEY", "CLIENT_IP_SOURCE", "CRON_SECRET"] as const) {
      if (!e[key]) ctx.addIssue({ code: "custom", path: [key], message: `${key} is required in production` });
    }
  });

export type ServerEnv = z.infer<typeof Env>;
let cached: ServerEnv | undefined;

export function env(): ServerEnv {
  if (cached) return cached;
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    // Names only — never print values.
    throw new Error(`Invalid environment: ${Object.keys(z.flattenError(parsed.error).fieldErrors).join(", ")}`);
  }
  cached = parsed.data;
  return cached;
}
