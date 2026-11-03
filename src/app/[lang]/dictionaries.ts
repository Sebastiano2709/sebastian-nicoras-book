import "server-only";
import type { Locale } from "@/lib/i18n/config";
import type ro from "@/dictionaries/ro.json";

export type Dictionary = typeof ro; // ro.json is the reference: a key missing in en.json fails type-check

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ro: () => import("@/dictionaries/ro.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
