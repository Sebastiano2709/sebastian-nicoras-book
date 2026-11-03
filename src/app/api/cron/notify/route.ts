import { timingSafeEqual } from "node:crypto";
import { deleteExpired, notifyPending } from "@/server/contact/notify";
import { env } from "@/server/env";

export const dynamic = "force-dynamic";

// Scheduled re-send of un-notified submissions (outbox, 00 §A1). The host's scheduler calls this with
// "Authorization: Bearer <CRON_SECRET>" [ASSUMPTION — confirm the header for your host; Vercel documents it].
export async function GET(request: Request) {
  const secret = env().CRON_SECRET;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret ?? ""}`;
  const ok = !!secret && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return Response.json({ error: "unauthorized" }, { status: 401 });
  const result = await notifyPending();
  const expired = await deleteExpired();
  return Response.json({ ...result, expired });
}
