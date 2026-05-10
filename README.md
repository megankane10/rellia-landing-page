![Project Snapshot](public/ogimage.png)
# Rellia Health — marketing site

React SPA for **Rellia Health**, connecting founders, clinicians, and health systems around the future of care.

**Production**: [relliahealth.com](https://www.relliahealth.com) <br>
**Stage 2 plan**: [STAGE-2.md](./STAGE-2.md)

---

## Branches and workflow

| Branch | Role |
|--------|------|
| **`main`** | Production; deploys to the live site. |
| **`Additions`** | Integration branch for new work before merge to `main`. |

Do day-to-day work on **`Additions`**. After review, merge into **`main`** for production.

---

## Tech stack

- **UI:** React 18, TypeScript, Vite, Tailwind CSS, Radix-based components
- **Routing:** React Router
- **Content:** Sanity — reads go through **`POST /api/sanity/query`** (whitelisted `queryId`; no raw GROQ from the browser). Editors use **Sanity Studio** in `website-cms/`.
- **CMS gating:** On `relliahealth.com` / `www.relliahealth.com`, the client treats CMS as off unless **`VITE_ENABLE_CMS_ON_PROD`** is set; **`VITE_DISABLE_CMS=true`** forces defaults everywhere. See `client/lib/sanity.ts`.
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
| `scripts/vercel-api-entry.ts` | Bundled to **`api/index.js`** (gitignored) for Vercel; do not edit `api/index.js` by hand |
| `api/` | Build output target only — **`api/index.js`** is produced by **`pnpm run build:api`** and ignored by git (see `.gitignore`) |
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
| `pnpm test` | Vitest |
| `pnpm typecheck` | TypeScript (`tsc`) |
| `pnpm format.fix` | Prettier write |

`npm run <script>` works as well if you use npm.

---

## Environment variables

**Summary:** Client-safe vars use the **`VITE_`** prefix (embedded in the browser bundle). Secrets belong only in server/Vercel env (never `VITE_*`).

| Area | Examples |
|------|----------|
| Site / SEO | `VITE_SITE_URL` (no trailing slash); build may also use `VERCEL_URL` / `VERCEL_GIT_COMMIT_SHA` for OG cache-bust — see `vite.config.ts` |
| CMS (client) | `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_DISABLE_CMS`, `VITE_ENABLE_CMS_ON_PROD` |
| Checkout | `VITE_STRIPE_MONTHLY_PLAN_LINK`, `VITE_STRIPE_ANNUAL_PLAN_LINK`, `VITE_QMS_PAYMENT_LINK` |
| Server / Sanity API | `SANITY_API_PROJECT_ID`, `SANITY_API_DATASET`, `SANITY_ENFORCE_VERCEL_DATASET`, `SANITY_ALLOWED_DATASETS`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `SANITY_STUDIO_URL`, `SANITY_STUDIO_PREVIEW_URL` (Studio) |
| HubSpot (contact proxy) | `HUBSPOT_CONTACT_FORM_GUID`, `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORMS_API_BASE` |
| API hardening | `ALLOWED_ORIGINS`, `REQUIRE_API_CSRF` |
| Diagnostics (server) | `ANTHROPIC_API_KEY` — used by `POST /api/diagnostic-report` when AI report generation runs; omit locally if unused (see `server/index.ts`) |
| Server runtime | `PORT` (default `3000` for `pnpm start`), `VERCEL`, `NODE_ENV` (platform / tooling) |

Full commentary and environment presets: **`.env.example`**.

---

## HTTP API (Express / Vercel)

All **`/api/*`** routes are served by the same serverless entry (`api/index.js`). **`vercel.json`** rewrites `/api/(.*)` → `/api`; Express restores the path via `fixVercelRewrittenApiPath` in `server/index.ts`.

| Method | Path | Purpose | Called from (app code) |
|--------|------|---------|-------------------------|
| `GET` | `/health` | Health check | External monitors / ops |
| `GET` | `/api/csrf-token` | Issues CSRF cookie + token | `client/lib/apiCsrf.ts` |
| `POST` | `/api/sanity/query` | Whitelisted Sanity reads | `client/lib/sanity.ts` |
| `POST` | `/api/contact-hubspot` | Proxies contact form to HubSpot Forms API | `client/pages/Contact.tsx` |
| `POST` | `/api/diagnostic-report` | Diagnostic survey report (body validated with Zod); AI path uses `ANTHROPIC_API_KEY`; optional Sanity write with `SANITY_API_WRITE_TOKEN` | `client/pages/DiagnosticSurvey.tsx` |
| `GET` | `/api/studio` | Redirects to `SANITY_STUDIO_URL` | **Not linked from the React app** — bookmark or docs only |
| `GET` | `/api/draft-mode/enable` | Sanity Presentation / draft preview cookie | Sanity Studio Presentation (iframe), not direct user navigation |
| `GET` | `/api/draft-mode/disable` | Clears draft preview cookie | Same |

**Membership / apply flows:** Stripe uses **Payment Links** (client env). **Fillout** embeds run in the browser (e.g. apply/careers). **HubSpot** is used both via the v2 script (`client/lib/hubspotForms.ts`) and via **`/api/contact-hubspot`** for the contact page server proxy.

---

## Orphaned or unused code (housekeeping backlog)

These are **not wired into the running UI** or **not referenced by `package.json`** as of the last repo scan — safe to remove or integrate after confirmation.

| Item | Notes |
|------|--------|
| `client/components/sanity/VisualEditingOverlay.tsx` | Exports `VisualEditingOverlay`; **never imported** in `App.tsx` or elsewhere. `@sanity/visual-editing` is only pulled in here. |
| `client/lib/sanityImage.ts` | Exports `urlForImage`; **no imports** anywhere in the repo. |
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
