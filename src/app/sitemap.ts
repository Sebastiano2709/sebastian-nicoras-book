import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { routes, siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) },
    })),
  );
}
