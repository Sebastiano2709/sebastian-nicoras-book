// Copied from 09 §4.6 — the ONLY place that decides which client-IP source to trust.
import "server-only";
import { headers as nextHeaders } from "next/headers";
import { isIP } from "node:net";

export async function getClientIp(source?: Headers): Promise<string> {
  const h = source ?? (await nextHeaders());
  switch (process.env.CLIENT_IP_SOURCE) {
    case "vercel":
      return valid(h.get("x-vercel-forwarded-for") ?? h.get("x-forwarded-for"));
    case "cloudflare":
      return valid(h.get("cf-connecting-ip"));
    case "xff-trusted-hops": {
      const hops = Number(process.env.TRUSTED_PROXY_HOPS ?? "1");
      const chain = (h.get("x-forwarded-for") ?? "").split(",").map((v) => v.trim()).filter(Boolean);
      return valid(Number.isInteger(hops) && hops >= 1 && chain.length >= hops ? chain[chain.length - hops] : null);
    }
    default:
      if (process.env.NODE_ENV === "production") throw new Error("CLIENT_IP_SOURCE is not configured");
      return "127.0.0.1";
  }
}

function valid(value: string | null | undefined): string {
  const ip = value?.split(",")[0]?.trim();
  if (!ip || isIP(ip) === 0) throw new Error("Client IP unavailable from the configured trusted source");
  return ip;
}
