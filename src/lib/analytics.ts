// 07 §12.11 — events are no-ops unless GA was loaded after consent (gtag only exists then).
export type EventName = "generate_lead" | "download_comp_card" | "click_email" | "click_instagram";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: EventName, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
