// 05 §10.9 limiter — FAILS CLOSED: missing store in production or an unreachable store refuses the request.
import "server-only";
import Redis from "ioredis";
import { env } from "@/server/env";
import { logger } from "./logger";

let redis: Redis | null | undefined;
function client(): Redis | null {
  if (redis !== undefined) return redis;
  const url = env().REDIS_URL;
  redis = url ? new Redis(url, { maxRetriesPerRequest: 1, enableOfflineQueue: false, lazyConnect: false }) : null;
  redis?.on("error", (err) => logger.error({ err }, "redis error"));
  return redis;
}

/**
 * With enableOfflineQueue:false, commands sent before the first connection is ready are rejected at once.
 * On a cold serverless instance that would refuse the first visitor. Wait briefly for "ready", then fail closed.
 */
async function whenReady(r: Redis, timeoutMs = 1000): Promise<void> {
  if (r.status === "ready") return;
  await new Promise<void>((resolve, reject) => {
    const cleanup = () => { clearTimeout(timer); r.off("ready", onReady); };
    const onReady = () => { cleanup(); resolve(); };
    const timer = setTimeout(() => { cleanup(); reject(new Error(`redis not ready (status ${r.status})`)); }, timeoutMs);
    r.once("ready", onReady);
  });
}

export type RateLimitResult = { ok: boolean; remaining: number; reason?: "limited" | "unavailable" };

export async function rateLimit(key: string, { limit, windowSec }: { limit: number; windowSec: number }): Promise<RateLimitResult> {
  const r = client();
  if (!r) {
    if (env().NODE_ENV === "production") {
      logger.error({ key }, "rate limiter has no store in production — failing closed");
      return { ok: false, remaining: 0, reason: "unavailable" };
    }
    return { ok: true, remaining: limit }; // development/test only
  }
  try {
    await whenReady(r);
    const fullKey = `rl:${key}`;
    // Atomic fixed window: the TTL is set only when the key is created, so the window never slides.
    const res = await r.multi().set(fullKey, 0, "EX", windowSec, "NX").incr(fullKey).exec();
    const count = Number(res?.[1]?.[1]);
    if (!Number.isFinite(count)) throw new Error("unexpected rate-limit reply");
    return count <= limit ? { ok: true, remaining: limit - count } : { ok: false, remaining: 0, reason: "limited" };
  } catch (err) {
    logger.error({ err, key }, "rate limiter unavailable — failing closed");
    return { ok: false, remaining: 0, reason: "unavailable" };
  }
}
