"use client";
import type { AnchorHTMLAttributes } from "react";
import { trackEvent, type EventName } from "@/lib/analytics";

// A plain <a> that reports one analytics event on click (no-op without consent). Navigation is never blocked.
export function TrackedLink({ event, location, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { event: EventName; location: string }) {
  return <a {...props} onClick={(e) => { trackEvent(event, { cta_location: location }); props.onClick?.(e); }} />;
}
