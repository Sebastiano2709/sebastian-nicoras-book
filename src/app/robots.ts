import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const env = process.env.VERCEL_ENV ?? process.env.SITE_ENV ?? "development";
  if (env !== "production") return { rules: { userAgent: "*", disallow: "/" } }; // staging never indexable (13 Stage 12)
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
