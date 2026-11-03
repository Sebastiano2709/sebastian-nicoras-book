# Sebastiano Nicoras — model book (v2)

Men's fashion model book in English (default) and Romanian, built on the **Site Starter** (portfolio & local business, RO/EN) and the ULTIMATE AI WEB DEVELOPER knowledge base. Branch `v2-starter`; `main` still holds v1 and the live site.

> Process: `13_UNIVERSAL_PREMIUM_WEBSITE_DEVELOPMENT_PROTOCOL.md`. Phase 1 plan (discovery, design direction, ADRs SN-01…05, budgets, placeholders) was approved on 2026-11-02 with the default answers.

## What changed from v1

| v1 defect (static review) | v2 |
|---|---|
| Portfolio/polaroids empty until JavaScript ran, then faded in from opacity 0 | CSS-only responsive grid; every photo in the server HTML; gated `Reveal` (09 §15.1), never armed under reduced motion |
| Raw `<img>` from `/public`, files up to 5.9 MB | `next/image` (AVIF/WebP, `sizes`, real dimensions); masters re-encoded to ≤ 2400 px (`npm run images`); only the hero is eager with `fetchPriority="high"` |
| GA loaded without consent; no privacy policy | GA4 only after consent (banner with equal Accept/Reject, "Cookie settings" to withdraw); privacy, cookie and accessibility pages in both languages |
| `og:image` pointed to a missing file | Generated OG images per locale (`public/og/`) |
| Lightbox was a clickable `div` | Buttons + native `<dialog>` (`showModal`), arrows, Escape, focus return, swipe; approved alt text for all 16 photos |
| No `<h1>`, duplicate `id="measurements"`, grey labels 2.42:1 | One h1 per page, unique ids, every text pair ≥ 5.9:1 (checked by a unit test that reads `globals.css`) |
| 9 px mobile navigation | 13 px labels; disclosure menu below 1024 px; visible focus; `aria-current` |
| Comp card printed "SEBASTIAN" and a phone number | Rebuilt as `Sebastiano_Nicoras_CompCard.pdf` from the original layout and photos, without the phone; old URL 308-redirects |
| `icon.png` was a 1367×2048 JPEG | Real 192×192 PNG |

## Decisions (project ADRs; the starter's ADR-001…005 still apply)

- **SN-01 Deployment** — Vercel Pro, Next.js on a server runtime; every page prerendered; static CSP without nonces (starter ADR-002) plus the Google tag hosts when `NEXT_PUBLIC_GA_ID` is set. The JS budget is exceeded (see "Measured budget").
- **SN-02 Languages** — `/en` and `/ro`; only `/` is negotiated (cookie → `Accept-Language` → **en**); localized URLs never redirect.
- **SN-03 Analytics and consent** — GA4 *basic* mode: no Google request before the visitor accepts. Choice in the strictly necessary cookie `sn_consent` (`{v, analytics, at}`, ≈ 6 months); bump `CONSENT_POLICY_VERSION` in `src/lib/consent.ts` when purposes change. Withdrawal deletes `_ga*` cookies and reloads.
- **SN-04 Contact form** — the starter's canonical flow (rate limit → validate → persist → notify via outbox) with an optional *Agency or company* field; enquiries are deleted after `RETENTION_DAYS` once notified.
- **SN-05 Fonts** — self-hosted Inter (starter) + Cormorant Garamond Light, Latin + Romanian subsets, 70 KB total, OFL licences in `src/fonts/`.

## Measured budget (08 §13.2 "image-heavy portfolio", 2026-11-03, production build, local server)

| Row | Budget | Measured | Result |
|---|---|---|---|
| First-party JS (gzip, first view) | ≤ 100 KB | 155.4 KiB `/en` mobile · 158.2 KiB `/ro/contact` and `/en` desktop | ❌ — Next.js/React runtime (starter ADR-001 measured 181.5 KiB) |
| Third-party JS before consent | ≤ 50 KB | 0 (no Google request) | ✅ |
| Images, first view | ≤ 600 KB | 197.9 KB `/en` mobile (hero + 4 lazy images the browser fetched early) | ✅ |
| Fonts | ≤ 100 KB | 70.0 KB, 2 files | ✅ |
| CSS | ≤ 40 KB | 7.4 KB | ✅ |
| Requests / origins | ≤ 50 / ≤ 3 | 20–27 / 1 | ✅ |
| Lab TBT, mobile (Lighthouse 13.6, simulated) | ≤ 200 ms | `/en` 220–450 ms; `/ro/contact` 360–450 ms (6 runs; one cold run 2,460 ms excluded) | ❌ |
| Lab LCP / CLS, mobile | ≤ 2.5 s / ≤ 0.1 | `/en` 1.8–3.0 s (hero image); `/ro/contact` 2.7–2.8 s (consent-banner text is the LCP element on a first visit) / CLS 0 | ⚠️ / ✅ |

Lab numbers come from a shared sandbox CPU running the server and the browser together; confirm with field data (Vercel Speed Insights or CrUX) after launch.

## Content

- Identity, measurements, GA ID: `src/config/site.ts` (confirmed facts only).
- Photos, order and alt text (EN/RO): `src/content/images.ts`.
- Interface text: `src/dictionaries/en.json`, `ro.json` (`ro.json` is the type reference).
- Legal drafts: `src/content/legal/*.tsx` — every `[LEGAL: …]` / `[CLIENT: …]` mark is a decision for the owner or counsel.
- To add a photo: put the original in a folder with `portfolio/` or `polaroids/`, add it to `images.ts`, run `npm run images -- <folder> public`, then set `width`/`height` from the output.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run typecheck` / `npm run lint` | TS 7 type check / ESLint, zero warnings |
| `npm test` | Unit tests (form action, consent cookie, token contrast) |
| `npm run build:e2e` then `npm run test:e2e` | Production build with test values, then Playwright (needs Postgres on :5433 and Redis on :6380, see `playwright.config.ts`) |
| `npm run db:migrate` | Apply Drizzle migrations (`0001_add_company` adds the company column) |
| `python3 scripts/build-comp-card.py …` / `build-og-images.py …` | Regenerate the comp card / OG images (usage in each file) |

## Deploy (10 §17A) — not done yet

1. Neon project (EU) → `DATABASE_URL`, run `npm run db:migrate`. Upstash Redis (EU) → `REDIS_URL`. Resend → key and a verified sending subdomain once the custom domain exists.
2. Vercel project on this repo; set the variables from `.env.example` **separately** for Preview and Production. `NEXT_PUBLIC_GA_ID` only in Production.
3. Deploy the `v2-starter` branch as a Preview, run the E2E suite against it, review, then merge to `main` when you approve the switch. The vercel.app URL keeps working; add the custom domain per 10 §17A.3.
4. Launch checks: 10 §17; submit the real form and confirm the email arrives.
