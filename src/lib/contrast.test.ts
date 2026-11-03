import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Recomputes the Phase 1 contrast table from the real tokens in globals.css (01 §3.6 method), so a token
// change that breaks WCAG 1.4.3 / 1.4.11 fails the unit tests instead of shipping.
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const token = (name: string) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m?.[1]) throw new Error(`token --color-${name} not found`);
  return m[1];
};
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x! + 0.05) / (y! + 0.05); };

const text: [string, string][] = [
  ["ink", "paper"], ["ink", "surface"], ["ink", "surface-sunken"],
  ["ink-muted", "paper"], ["ink-muted", "surface"], ["ink-muted", "surface-sunken"],
  ["brand-ink", "brand"], ["danger", "surface"], ["success", "surface"], ["on-dark-muted", "ink"],
];
const boundaries: [string, string][] = [["line", "surface"], ["line", "paper"], ["ink", "paper"]];

describe("design tokens meet WCAG 2.2 AA", () => {
  it.each(text)("text %s on %s ≥ 4.5:1", (fg, bg) => expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5));
  it.each(boundaries)("control boundary / focus %s on %s ≥ 3:1", (fg, bg) => expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(3));
  it("matches the computed v2.1 values", () => {
    expect(ratio(token("ink"), token("paper"))).toBeCloseTo(21, 1);
    expect(ratio(token("ink-muted"), token("surface-sunken"))).toBeCloseTo(4.68, 1);
  });
});
