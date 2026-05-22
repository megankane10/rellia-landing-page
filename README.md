![Project Snapshot](public/ogimage.png)
# Rellia Health — marketing site

React SPA for **Rellia Health**, connecting founders, clinicians, and health systems around the future of care.

**Production**: [relliahealth.com](https://www.relliahealth.com) <br>
**Stage 2 plan**: [STAGE-2.md](./STAGE-2.md)

---

## Branches and workflow

| Branch | Git role | Typical Vercel deploy | Sanity dataset (`VITE_SANITY_DATASET`) |
|--------|----------|----------------------|----------------------------------------|
| **`main`** | Production code | `www.relliahealth.com` | **`production`** |
| **`Additions`** | Integration / review before `main` | `relliahealth.vercel.app` (preview) | **`preview`** |

Do day-to-day work on **`Additions`**. After review, merge into **`main`** for production.

### Sanity: two datasets (not the same as “drafts”)

Sanity stores **two separate content databases** in one project:

| Dataset | What it is | Who sees it |
|---------|------------|-------------|
| **`preview`** | Staging copy for experiments, seed scripts, and pre-launch pages | Preview site (`relliahealth.vercel.app`) when env uses `preview` |
| **`production`** | Live copy for the public marketing site | `www.relliahealth.com` when env uses `production` |

**Important:** Content you **publish** in Studio on the `preview` dataset is **published on preview**, not hidden drafts. It does **not** automatically appear on `www` until the same content exists in the **`production`** dataset (copy, re-publish, or migrate).

The admin dashboard **Content drafts** panel shows:

- **Unpublished draft** documents (`drafts.*` IDs) in the dataset the admin app is configured to read
- **Recently edited published** documents in that same dataset

It does **not** mean “everything on preview that is missing from main.” Stories, alumni, and advisor profiles on the preview site are usually **published documents in the `preview` dataset**, not draft queue items.

### Promote preview → production (events)

When preview has correct `startsAt` / `endsAt` but production does not:

```bash
pnpm sanity:promote:dry
pnpm sanity:promote -- --apply-production
```

To remove an event entirely: `pnpm sanity:delete-event -- digital-health-salon-toronto --datasets=production,preview`

To remove advisor/alumni from www only (keep on preview), unpublish those types in Studio on the **production** dataset.

### Static seed fallbacks (code defaults)

`client/lib/deploymentEnv.ts` controls hardcoded fallbacks in `shared/cms/defaults.ts` (sample events, stories, alumni/advisor seed directories, etc.):

- **Allowed** when `VITE_SANITY_DATASET` is **`preview`** (preview deploy + local dev with preview env)
- **Never** when `VITE_SANITY_DATASET` is **`production`** — the live site must use Sanity production only, or show empty sections if CMS is down (no silent revert to old baked-in events)

If production showed removed events (e.g. an old salon) or missing dates, typical causes were: CMS fetch failing/empty and the events page falling back to defaults, or outdated documents still **published** in the **production** dataset. Fix content in Studio on the **production** dataset, or unpublish/delete there.

### What still needs finalizing (project checklist)

| Area | Status / action |
|------|------------------|
| **Vercel env** | Production: `VITE_SANITY_DATASET=production`, `SANITY_API_DATASET=production`, `SANITY_API_READ_TOKEN`, `SANITY_ENFORCE_VERCEL_DATASET=true`. Preview: same keys with `preview`. |
| **Studio env** | `SANITY_STUDIO_DATASET=preview` for daily editing; `SANITY_STUDIO_PREVIEW_URL` = preview site URL. |
| **Production CMS content** | Audit **production** dataset: events (`startsAt` / `endsAt` filled), remove retired events, confirm alumni/advisor docs should be live on www before publishing there. |
| **Supabase admin** | Run `scripts/supabase_admin_policies.sql` if status/delete on submissions is needed. |
| **Admin signup** | `ADMIN_SIGNUP_ENABLED` + `SUPABASE_SERVICE_ROLE_KEY` on server env; disable signup after invites. |
| **Stripe** | Membership checkout env on server (see `.env.example`); not surfaced in admin dashboard. |
| **HubSpot / investor form** | Still external; not in admin. Could move to Supabase later (same pattern as contact form). |
| **Email alerts** | Not built — optional Supabase webhook → email on new contact/diagnostic rows. |
| **Sanity private datasets** | Free tier = treat as public API; mitigations documented in `.env.example`. |

Diagnostic survey routes (`/diagnostics`, `/diagnostic-survey`) use Supabase, not Sanity page content.

---

## Tech stack

- **UI:** React 18, TypeScript, Vite, Tailwind CSS, Radix-based components
- **Routing:** React Router (`client/AppRoutes.tsx`; `client/App.tsx` wraps providers only)
- **Content:** Sanity — reads go through **`POST /api/sanity/query`** (whitelisted `queryId`; no raw GROQ from the browser). Editors use **Sanity Studio** in `website-cms/`.
- **CMS gating:** CMS is on when **`VITE_SANITY_PROJECT_ID`** and **`VITE_SANITY_DATASET`** are set. Set **`VITE_DISABLE_CMS=true`** only to force hardcoded defaults everywhere. See `client/lib/sanity.ts`.
- **Data loading:** TanStack Query for CMS-backed pages
- **Server:** Express app — mounted under Vercel as a single serverless function (`api/index.js`) for **`/api/*`** and **`/health`**; optional local full-stack via **`pnpm build`** + **`pnpm start`** (Node serves built SPA + API from `dist/server`).
- **Prerender:** `vite-prerender-plugin` + `client/prerender.tsx` for static HTML on listed routes (`client/config/seo.ts`).
- **Analytics:** Vercel Analytics, Vercel Speed Insights
- **Deployment:** Vercel — **`vercel.json`** runs **`pnpm run build:client && pnpm run build:api`** (static `dist/spa` + API bundle). The **`build:server`** step is for local/production Node runs, not required for that Vercel static+functions setup.

---

## Repository layout

| Path | Purpose |
|------|---------|
| `client/` | React app: pages, components, hooks, styles |
| `server/` | Express application (`createServer()` in `server/index.ts`) |
| `scripts/vercel-api-entry.ts` | Source for the Vercel serverless API bundle |
| `api/index.js` | Committed Vercel **`/api/*`** handler (rebuild with **`pnpm run build:api`** after server changes) |
| `shared/` | Shared CMS types, GROQ helpers, query whitelist (`shared/cms/sanityQueryRegistry.ts`), merge helpers, default fallbacks |
| `public/` | Static files (`robots.txt`, `sitemap.xml`, images, `favicon.ico`, `ogimage.png`) |
| `website-cms/` | Sanity Studio (separate `package.json`; run its own install for Studio dev) |
| `data/` | Optional local artifacts (e.g. `contact-submissions.jsonl` in `.gitignore`); not part of the runtime app bundle |
| `design-system/` | Design notes (e.g. `design-system/rellia-health/MASTER.md`); verify against live Tailwind tokens in `tailwind.config.ts` before treating as source of truth |

---

## Getting started

**Requirements:** Node.js (LTS) and **pnpm** (recommended). Enable pnpm via Corepack:

```bash
corepack enable
```

**Clone and install**

```bash
git clone https://github.com/Agrolax/rellia-landing-page.git
cd rellia-landing-page
pnpm install
```

**Environment**

```bash
cp .env.example .env
```

Edit `.env` for Sanity, HubSpot, CORS, CSRF, Stripe links, and site URL. **Authoritative list and staging vs production notes:** `.env.example`.

**Run the Vite dev server** (Express API is attached in dev — see `vite.config.ts`)

```bash
pnpm dev
```

**Sanity Studio** (content editing UI), from the studio package:

```bash
cd website-cms
pnpm install
pnpm dev
```

**Production-like build** (client + server + Vercel API bundle)

```bash
pnpm build
pnpm start
```

Starts the Node server that serves the built SPA and API (default port from `PORT` or `3000`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Vite dev server (hot reload) + Express middleware |
| `pnpm build` | Build SPA, Node server bundle, and `api/index.js` |
| `pnpm start` | Run production Node server locally (`dist/server/node-build.mjs`) |
| `pnpm sanity:seed` | Seed Sanity (`scripts/sanity-seed.ts`) |
| `pnpm sanity:cleanup` | Remove obsolete docs + duplicate singletons/slugs (`scripts/sanity-cleanup.ts`) |
| `pnpm test` | Vitest |
| `pnpm typecheck` | TypeScript (`tsc`) |
| `pnpm format.fix` | Prettier write |

`npm run <script>` works as well if you use npm.

---

## Admin portal (`/admin`)

Internal dashboard for **contact** and **startup diagnostic** submissions (Supabase), plus **Sanity draft** visibility.

| Route | Purpose |
|-------|---------|
| `/admin/login` | Supabase Auth sign-in |
| `/admin/signup` | Self-serve admin account when enabled |
| `/admin/dashboard` | Metrics, submission hubs, CMS drafts |
| `/admin/contacts` | Contact inbox with status filters |
| `/admin/diagnostics` | Diagnostic list with status filters |

**Supabase setup:** run `scripts/supabase_setup.sql`, `scripts/supabase_diagnostic_setup.sql`, and `scripts/supabase_admin_policies.sql` in the SQL editor.

**Admin signup env (server-side only — not `VITE_`):**

```bash
ADMIN_SIGNUP_ENABLED=true
SUPABASE_SERVICE_ROLE_KEY=...   # required for POST /api/admin/signup
```

Set the same variables on **Vercel → Settings → Environment Variables** for **Production** and **Preview**, then redeploy. The build must run **`pnpm run build:api`** (included in `vercel.json` `buildCommand`).

**If signup shows “API unavailable”:** open **`/api/health`** on the same host (or **`/health`**, which Vercel rewrites to the API). You should see `{"ok":true}` as JSON — not the SPA HTML. If you get HTML or “Cannot GET”, the serverless API is not running (check deploy logs for `build:api`, and that `api/index.js` exists). Local `pnpm start` also serves **`/health`** directly. Dev loads `.env` and `.env.local` via `server/loadEnv.ts`.

**CMS status on the dashboard:** **Database** pings Supabase; **CMS** runs the same **`sanityDrafts`** query as the drafts panel (dataset from **`VITE_SANITY_DATASET`**). **Offline** usually means missing **`SANITY_API_READ_TOKEN`** on the server or a dataset mismatch (`preview` vs `production`). Preview edits do not appear when the admin app queries `production`.

**Seed / defaults:** See **Static seed fallbacks** under [Branches and workflow](#branches-and-workflow). Production dataset never uses code defaults; preview dataset may when CMS is empty.

---

## Design system (frontend)

| Concern | Location |
|---------|----------|
| Typography scale | `client/lib/typography.ts` (`HEADING_PAGE`, `HEADING_SECTION`, `HEADING_CTA_BAND_*`) |
| Buttons / CTA hovers | `client/components/RelliaAction.tsx` — use `relliaCtaPrimary` / `relliaCtaSecondary` on cream and grey-teal bands; `heroSolidOnTeal` / `heroGhostOnTeal` on teal heroes and mobile nav |
| Page heroes | `client/components/PageHeader.tsx`, `client/components/SectionHeading.tsx` |

---

## Sanity Visual Editing

1. Mount **`VisualEditingOverlay`** in `client/App.tsx` (enables `@sanity/visual-editing` comlink + overlays inside the Presentation iframe).
2. Studio **`presentationTool`** uses `previewMode.enable` / `disable` → `/api/draft-mode/*` (see `website-cms/sanity.config.ts`).
3. Preview deploy must set **`SANITY_STUDIO_URL`** (stega) and **`SANITY_API_READ_TOKEN`** (draft GROQ). The iframe also sends `x-sanity-presentation: 1` so `/api/sanity/query` returns stega even before the HttpOnly cookie is visible to JS.
4. Set **`SANITY_STUDIO_PREVIEW_URL`** on the hosted Studio to your preview deployment origin.
4. Seed preview content: `pnpm sanity:seed` (requires `SANITY_API_WRITE_TOKEN` and matching project/dataset env).
5. After schema changes: `pnpm sanity:cleanup` on the **`preview`** dataset (removes `diagnosticSubmission` orphans and duplicate docs).

**Deploy Studio schema:** from `website-cms/`:

```bash
rm -rf node_modules && pnpm install
pnpm exec sanity schema deploy
pnpm exec sanity deploy
```

If deploy fails with `Cannot find module ... studioWorkerLoader.worker.js`, your `node_modules` is stale (often after upgrading `sanity` without a clean install). Remove `node_modules` and reinstall.

Hosted Studio: https://relliahealth.sanity.studio/

### Visual Editing checklist (Presentation)

| Where | Variable | Purpose |
|-------|----------|---------|
| **Vercel Preview** | `SANITY_API_READ_TOKEN` | **Required** — draft-mode + preview GROQ with stega |
| **Vercel Preview** | `SANITY_STUDIO_URL` | Your hosted Studio URL (e.g. `https://<project>.sanity.studio`) — stega + draft API |
| **Vercel Preview** | `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET=preview` | Client CMS reads |
| **Vercel Preview** | `SANITY_API_PROJECT_ID` / `SANITY_API_DATASET=preview` | Server `/api/sanity/query` |
| **Sanity Studio env** (sanity.io → Project → Studio) | `SANITY_STUDIO_PREVIEW_URL` | Exact preview site origin (e.g. `https://relliahealth.vercel.app`) |
| **Sanity Studio env** | `SANITY_STUDIO_DATASET=preview` | Match Additions / preview deploy |

Create the read token in [sanity.io/manage](https://sanity.io/manage) → API → Tokens → **Viewer** (or read-only with draft access). Redeploy Vercel Preview after adding tokens.

**Studio sidebar:** Page singletons live under **Pages** (not scattered at the top level).

---

## Verification checklist

```bash
pnpm install
cd website-cms && pnpm install && cd ..
pnpm typecheck
pnpm test
pnpm build
pnpm dev   # smoke-test key routes and button hovers
```

In Sanity Studio: open **Presentation** → confirm iframe loads the preview URL → edit a field → confirm click-to-edit overlay on the preview site.

---

## Environment variables

**Summary:** Client-safe vars use the **`VITE_`** prefix (embedded in the browser bundle). Secrets belong only in server/Vercel env (never `VITE_*`).

| Area | Examples |
|------|----------|
| Site / SEO | `VITE_SITE_URL` (no trailing slash); build may also use `VERCEL_URL` / `VERCEL_GIT_COMMIT_SHA` for OG cache-bust — see `vite.config.ts` |
| CMS (client) | `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_DISABLE_CMS` |
| Checkout | `VITE_STRIPE_MONTHLY_PLAN_LINK`, `VITE_STRIPE_ANNUAL_PLAN_LINK`, `VITE_QMS_PAYMENT_LINK` |
| Server / Sanity API | `SANITY_API_PROJECT_ID`, `SANITY_API_DATASET`, `SANITY_ENFORCE_VERCEL_DATASET`, `SANITY_ALLOWED_DATASETS`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `SANITY_STUDIO_URL`, `SANITY_STUDIO_PREVIEW_URL` (Studio) |
| HubSpot (contact proxy) | `HUBSPOT_CONTACT_FORM_GUID`, `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORMS_API_BASE` |
| API hardening | `ALLOWED_ORIGINS`, `REQUIRE_API_CSRF` |

Full commentary and environment presets: **`.env.example`**.

---

## HTTP API (Express / Vercel)

All **`/api/*`** routes are served by the serverless entry **`api/index.js`** (built from `scripts/vercel-api-entry.ts`). **`vercel.json`** rewrites `/api/(.*)` → `/api`; Express restores the real path via `fixVercelRewrittenApiPath` in `server/index.ts`.

| Method | Path | Purpose | Called from (app code) |
|--------|------|---------|-------------------------|
| `GET` | `/api/health`, `/health` | Health check (`/health` rewrites to API on Vercel) | Signup troubleshooting / monitors |
| `GET` | `/api/csrf-token` | Issues CSRF cookie + token | `client/lib/apiCsrf.ts` |
| `POST` | `/api/sanity/query` | Whitelisted Sanity reads | `client/lib/sanity.ts` |
| `POST` | `/api/contact-hubspot` | Proxies contact form to HubSpot Forms API | `client/pages/Contact.tsx` |
| `POST` | `/api/diagnostic-report` | Diagnostic survey report (Supabase) | `client/pages/DiagnosticSurvey.tsx` |
| `GET` | `/api/studio` | Redirects to `SANITY_STUDIO_URL` | **Not linked from the React app** — bookmark or docs only |
| `GET` | `/api/draft-mode/enable` | Sanity Presentation / draft preview cookie | Sanity Studio Presentation (iframe), not direct user navigation |
| `GET` | `/api/draft-mode/disable` | Clears draft preview cookie | Same |

**Membership / apply flows:** Stripe uses **Payment Links** (client env). **Fillout** embeds run in the browser (e.g. apply/careers). **HubSpot** is used both via the v2 script (`client/lib/hubspotForms.ts`) and via **`/api/contact-hubspot`** for the contact page server proxy.

---

## Orphaned or unused code (housekeeping backlog)

These are **not wired into the running UI** or **not referenced by `package.json`** as of the last repo scan — safe to remove or integrate after confirmation.

| Item | Notes |
|------|--------|
| `client/lib/sanityImage.ts` | Exports `urlForImage`; **no imports** in app routes yet (optional helper for CMS images). |
| `client/components/ui/beams.tsx` | Exports `BackgroundBeams`; **no imports** anywhere. |
| `three`, `@react-three/fiber`, `@react-three/drei` | Listed in `package.json` **devDependencies** but **no TS/TSX imports** found; likely removable if you confirm no dynamic/runtime use (see also [STAGE-2.md](./STAGE-2.md)). |
| `scripts/fix-homepage-data.ts`, `scripts/thorough-cleanup.ts`, `scripts/debug-sanity.ts`, `scripts/cleanup-programs.ts`, `scripts/sanity-fix-homepage-draft.ts` | **No `pnpm` scripts** point at these; ad-hoc maintenance only. |
| `design-system/rellia-health/MASTER.md` | Palette/fonts (e.g. Outfit/Work Sans, sky/orange) **do not match** live `tailwind.config.ts` (Host Grotesk, Urbanist, `rellia.teal` / mint). Treat as **draft or outdated** unless reconciled. |

---

## Security notes and fixes to prioritize

This is a **codebase review checklist**, not a penetration test. Address in order of risk for your threat model.

1. **CORS defaults** — If **`ALLOWED_ORIGINS`** is empty in production, `server/index.ts` allows **any** browser `Origin` for the `cors()` middleware (with a console warning). **Fix:** set explicit comma-separated origins for every deployed hostname (preview + prod).
2. **HubSpot portal fallback** — `HUBSPOT_PORTAL_ID` falls back to a **hardcoded** default in `server/index.ts` if unset. **Fix:** require the env var in production so submissions cannot be misrouted to the wrong portal.
3. **CSRF escape hatch** — **`REQUIRE_API_CSRF=false`** disables CSRF on POST APIs. **Fix:** never set in production except a documented break-glass; rotate tokens if it was ever used on a shared environment.
4. **Sanity dataset exposure** — Public datasets are readable without your app; the app mitigates with a **query whitelist** and server proxy, but **secrets and embargoed copy do not belong** in public datasets. **Fix:** align with `.env.example` (private datasets + read tokens where the plan allows).
5. **Preview / draft endpoints** — Draft-mode routes trust **Origin/Referer** heuristics and Sanity domains (`server/index.ts`). **Fix:** keep **`SANITY_API_READ_TOKEN`** scoped and rotated; restrict **`ALLOWED_ORIGINS`**; monitor abuse of `/api/draft-mode/*`.
6. **Dependency surface** — Unused heavy deps (e.g. Three.js stack if confirmed unused) increase supply-chain risk and bundle audit noise. **Fix:** remove or justify per [STAGE-2.md](./STAGE-2.md).
7. **CSP** — Global CSP in `vercel.json` only sets **`frame-ancestors`** (for Sanity framing). **Fix:** if you tighten `Content-Security-Policy` further, regression-test HubSpot, Fillout, Luma embeds, and Stripe checkout flows ([STAGE-2.md](./STAGE-2.md) calls this out).

---

## License / privacy

Repository **`website-cms/package.json`** declares `"license": "UNLICENSED"`. Confirm licensing with the project owner for both app and Studio packages.
