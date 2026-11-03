// Dependency-free: imported by proxy.ts, layouts and components (03 §8.7.3).
// ADR SN-02: English is the default (international agencies); Romanian second.
export const locales = ["en", "ro"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "locale"; // explicit choice from the language switcher (strictly necessary preference)

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
