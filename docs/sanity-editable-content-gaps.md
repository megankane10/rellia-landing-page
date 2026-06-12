# Sanity editable content gaps

Last updated: June 2026

Audit of public-facing pages (admin routes excluded) against Sanity schemas, GROQ queries, and frontend rendering.

**Related:** [cms-legacy-audit.md](./cms-legacy-audit.md) · [website-management-guide.md](./website-management-guide.md)

---

## Recently fixed (June 2026)

| Item | Resolution |
|------|------------|
| **`programsLayoutPage`** | Wired via `useProgramsLayoutPage` + `applyProgramsLayoutDefaults` — shared section titles/pillars fill in when a program field is empty. GROQ query fixed to fetch layout fields (was incorrectly querying `sections[]`). |
| **Program hero image** | Sanity `program.image` now wins over code defaults (`resolveProgramCardImageSrc`). |
| **Waitlist / open enrollment** | Driven by `program.status` in Studio (`available` / `waitlist` / `hidden`). Removed hardcoded `isWaitlist` props from routes. |
| **Pillars, how-it-works, timeline** | CMS arrays are source of truth when populated — add/remove/reorder in Studio. Code static files only provide icon/image fallbacks per slot. |
| **`Programs*.tsx` hardcoded CMS** | Moved to `shared/cms/programs/programFallbackContent.ts` — used only when Sanity fields are empty. |
| **About CTA links** | `ctaFounderHref` + `ctaTeamHref` added to schema/GROQ/merge. |
| **Diagnostic survey text** | `mergeDiagnosticSurvey` uses `cmsCleanText` so Presentation overlay edits apply; intro/report titles already in `diagnosticSurveyContent`. |
| **Icon fields (home focus areas, etc.)** | `resolveLucideIcon` + Studio dropdown (`iconKeyField`); stega-safe icon key parsing. |
| **`sectionHero`** | Added to `pageSectionMembers` for catch-all pages. |
| **`/programs` grid overrides** | Removed code `IMAGE_OVERRIDES` / `STATUS_OVERRIDES` — trust CMS. |

---

## Reference: `sectionHero`

`sectionHero` is a modular page block (dark `PageHeader`-style hero with tag, portable headline, CTAs, background image). It was defined for the legacy `pageBuilder` array type but was **not** included in `pageSectionMembers`, so editors could not add it on generic `page` documents. It is now available on catch-all CMS pages alongside the other 13 section types.

---

## Reference: `marketingPage`

`website-cms/schemaTypes/documents/marketingPage.ts` is an **orphan schema** — a simple `{ slug, title, subtitle, body }` document type that is **not registered** in `schemaTypes/index.ts`, so it does not appear in Studio. The site uses typed singletons (`homePage`, `aboutPage`, …) and collection `page` documents instead. Safe to delete the file or register it if you want a generic markdown-style page type.

---

## Reference: per-route `Programs*.tsx` fallbacks

Each program route used to embed a large `const CMS = { … }` object passed into `ProgramPageLayout`. That object was merged **on top of** Sanity when fields were empty, so:

- Editors could change copy in Studio, but the code object was the hidden default.
- New programs required a new React file + hardcoded object.

Now: one `ProgramDetailPage` + `programFallbackContent.ts` + Sanity `program` documents. Add a program in **Collections → Programs** with matching slug; optional new route in `AppRoutes.tsx` if the URL is new.

---

## Still not fully CMS-editable

| Page / area | Gap |
|-------------|-----|
| **`/programs`, `/founders`** | `DiagnosticSurveySection` promo copy (title, body, CTA) — hardcoded component, not `sectionDiagnosticSurvey`. |
| **`/events`** | “Browse Events” heading; filter tab labels; `eventsLandingPage.sections[]` not rendered. |
| **`/stories`** | “Browse stories” heading; filter tabs from code list, not `storyFilter` collection. |
| **`/about`** | Values parallax background image (Pexels URL). |
| **`/advisors`** | Schedule section side image. |
| **`/investors`** | Founders cluster section chrome; portfolio split section; notify form copy. |
| **`/industry-partners`** | Benefits + directory section images. |
| **`/industry-partners/directory`** | Redirect only — no CMS page. |
| **`/apply`, `/careers`** | Fillout form IDs (env/code). |
| **Diagnostic survey** | Question **structure** (count, scoring types, section ids) fixed in code — CMS overlays text per matching id/index only. |
| **Integrations** | Contact submit API, Stripe checkout, GetProven URL, home JSON-LD. |

Empty CMS fields still fall back to code defaults (`shared/cms/defaults.ts`, `programFallbackContent.ts`, etc.) while content is being migrated.

---

## Deploy checklist

1. **Sanity Studio schema** — `pnpm sanity:studio:deploy` (or your Studio deploy command) so new fields (`ctaFounderHref`, program `iconKey` on pillars, home icon dropdown, etc.) appear for editors.
2. **Vercel / frontend** — Owner merges PR and deploys so API + React changes go live (`api/index.js` rebuilt via `pnpm build:api`).
3. **Optional seed** — `pnpm sanity:seed` (or partial seed) to backfill program `status`, layout page, about CTA hrefs if documents are empty.

---

## Scope notes

- **Excluded:** `/admin/*`, auth callbacks, invite acceptance.
- **Pattern:** Sanity-first with merge-with-defaults so pages never render empty during migration.
