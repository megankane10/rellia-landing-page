![Project Snapshot](public/ogimage.png)
# Rellia Health — marketing site

React SPA for **Rellia Health**, connecting founders, clinicians, and health systems around the future of care.

**Production**: [relliahealth.com](https://www.relliahealth.com)

**Status (June 2026):** Initial build and CMS handoff are **complete**. The site is live on Vercel; editors publish via [Sanity Studio](https://relliahealth.sanity.studio). Use **`main`** for production and **`Additions`** for integration preview. Ongoing work is content and optional enhancements only — see [Editor guide](./docs/website-management-guide.md).

---

## Branches and workflow

| Branch | Git role | Typical Vercel deploy | Sanity dataset (`VITE_SANITY_DATASET`) |
|--------|----------|----------------------|----------------------------------------|
| **`main`** | Production code | `www.relliahealth.com` | **`production`** |
| **`Additions`** | Integration / review before `main` | `relliahealth.vercel.app` (preview) | **`production`** + **drafts** perspective |

The legacy **`preview`** dataset is optional for local seed experiments only.

Do day-to-day work on **`Additions`**. After review, merge into **`main`** for production.

### Sanity: Studio → live site (editor workflow)

Sanity Studio at [relliahealth.sanity.studio](https://relliahealth.sanity.studio) edits the **`production`** dataset — the same database **`www.relliahealth.com`** reads. **Publish in Studio = live site update** within ~30 seconds (refresh the page).

| Who | Dataset | Where changes appear |
|-----|---------|----------------------|
| **Editors (Studio)** | **`production`** | **Publish** → `www.relliahealth.com` (published only) |
| **Editors (draft review)** | **`production`** + drafts | `relliahealth.vercel.app` or Studio **Presentation** |
| **Developers (Additions)** | **`production`** + drafts | Code QA on Vercel preview URL |

Use **Presentation** in Studio (iframe → `relliahealth.vercel.app`) to preview unpublished work. The admin **Content drafts** panel lists draft documents.

**One-time migration** (if staging had content production lacks):

```bash
pnpm sanity:sync-to-production:dry
pnpm sanity:sync-to-production -- --apply
```

Legacy event-only sync (rarely needed):

```bash
pnpm sanity:promote:dry
pnpm sanity:promote -- --apply-production
```

### Static seed fallbacks (code defaults)

`client/lib/deploymentEnv.ts` controls hardcoded fallbacks in `shared/cms/defaults.ts` (sample events, stories, alumni/advisor seed directories, etc.):

- **Allowed** when `VITE_SANITY_DATASET` is **`preview`** (preview deploy + local dev with preview env)
- **Never** when `VITE_SANITY_DATASET` is **`production`** — the live site must use Sanity production only, or show empty sections if CMS is down (no silent revert to old baked-in events)

If production showed removed events (e.g. an old salon) or missing dates, typical causes were: CMS fetch failing/empty and the events page falling back to defaults, or outdated documents still **published** in the **production** dataset. Fix content in Studio on the **production** dataset, or unpublish/delete there.

### Client handoff checklist

Use this when transferring the site to the Rellia team. Items marked **editor** are safe for non-developers; **dev** need engineering access.

#### Before handoff (developer)

| # | Task | Why it matters |
|---|------|----------------|
| 1 | **Vercel production env** — `VITE_SANITY_DATASET=production`, `SANITY_API_DATASET=production`, `SANITY_API_READ_TOKEN`, `SANITY_ENFORCE_VERCEL_DATASET=true`, Supabase + Stripe keys from `.env.example` | Live site reads the correct CMS dataset and APIs work |
| 2 | **Vercel preview env** — `production` dataset + `SANITY_VERCEL_PREVIEW_DATASET=production`; `SANITY_STUDIO_PREVIEW_URL` = `https://relliahealth.vercel.app` | Draft review on Vercel; www stays published-only |
| 3 | **Sanity Studio** — deployed (`pnpm sanity:studio:deploy`); Looker embed URL in **Site settings → Analytics** | Editors use https://relliahealth.sanity.studio |
| 4 | **Seed starter content** — `pnpm sanity:seed:starters` on **production** (terms, privacy, guide) if singletons are empty | Editors see legal pages in Studio |
| 5 | **Production CMS audit** — events have `startsAt`/`endsAt`; publish only what should be on www | Prevents wrong dates or ghost events on live site |
| 6 | **One-time sync** — `pnpm sanity:sync-to-production -- --apply` if preview had content production lacks | Aligns live site before client handoff |
| 7 | **Supabase** — run `scripts/supabase_admin_policies.sql` for inbox status updates; run `scripts/supabase_revert_admin_role_policies.sql` if strict admin-role RLS was ever applied | Any invited user can sign in and read submissions |
| 8 | **Admin access** — invite users in Supabase Auth; set `ADMIN_SIGNUP_ENABLED=false` on Vercel after onboarding | No public self-signup on `/admin/signup` |
| 9 | **Smoke test** — www + preview: home, contact submit, diagnostic submit, admin login → Overview + Inbox | Confirms end-to-end paths |
| 10 | **Dependabot** — review or dismiss GitHub security alerts on the repo | Hygiene, not blocking launch |

#### Editor onboarding (30–60 min)

| Topic | Where |
|-------|--------|
| Edit marketing pages | Sanity Studio → Site / Pages groups |
| SEO per page | Each document → **SEO** tab (ignore paid SEO Health Dashboard) |
| Legal copy | Studio → **Terms of use**, **Privacy policy** |
| Form leads | Admin → **Inbox** (Web forms + Startup diagnostic) |
| Unpublished CMS work | Admin → **Sanity drafts** + Studio |
| Analytics | Studio top bar → **Analytics** (Looker) |
| Help & links | Admin → **Help** |

#### Optional enhancements (not required for launch)

| Area | Notes |
|------|--------|
| **More modular CMS pages** | Page builder + showcase sections are available; additional routes can adopt **Use modular CMS layout** when needed. |
| **Stripe in admin** | Membership checkout works on the site; admin does not show payment history. |
| **Email alerts on new submissions** | Optional Supabase webhook → email later. |
| **Dependabot alerts** | Review GitHub security advisories periodically. |

**Operational docs:** [website-management-guide.md](./docs/website-management-guide.md) (editors) · [sanity-dataset-sync-guide.md](./docs/sanity-dataset-sync-guide.md) (preview ↔ production sync)

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
| [`website-cms/`](./website-cms/README.md) | Sanity Studio CMS package containing schemas, visual editing presentation settings, and setup instructions. |
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
| `pnpm sanity:seed` | Full seed — singletons, events, stories, directories, logo marquees, careers image scroll, membership copy aligned with `/membership` (deletes/replaces advisors & alumni) |
| `pnpm sanity:seed:starters` | Safe starter seed — terms, privacy, CMS guide, consulting/diagnostic shells (no directory wipe) |
| `pnpm sanity:seed:story-filters` | Seed story category tags (Founder Story, Industry Insight, Program Update) — safe to re-run |
| `pnpm sanity:migrate:story-seo` | Migrate story SEO fields to `seoFields` shape and default titles — safe to re-run |
| `pnpm sanity:cleanup` | Remove obsolete docs + duplicate singletons/slugs (`scripts/sanity-cleanup.ts`) |

After schema changes, run **`pnpm sanity:seed`** on **preview** first, verify the site, then **`pnpm sanity:sync-to-production -- --apply`** (or seed production directly) so www does not rely on code fallbacks.
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
| `/admin/overview` | Personalized home — KPIs, charts, recent submissions |
| `/admin/inbox` | Web forms + startup diagnostic (status filters) |
| `/admin/team` | Dashboard members |
| `/admin/drafts` | Unpublished Sanity documents |
| `/admin/help` | Editor guides and tool links |

**Supabase setup:** run `scripts/supabase_setup.sql`, `scripts/supabase_diagnostic_setup.sql`, and `scripts/supabase_admin_policies.sql` in the SQL editor.

**Supabase Auth URLs (required for invites):** In Supabase → Authentication → URL configuration, set **Site URL** to `https://www.relliahealth.com` and add **Redirect URLs** for `/admin/auth/callback` and `/accept-invite` on both `www` and apex hosts (see `.env.example`). Invite emails should redirect to `/accept-invite?confirmation_url={{ .ConfirmationURL }}` so scanners do not consume the token before the user clicks **Continue**.

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

**Deploy Studio** (Sanity CLI is installed under `website-cms/`, not globally — do not run bare `sanity deploy`):

From repo root:

```bash
pnpm sanity:studio:deploy
```

Or from `website-cms/`:

```bash
cd website-cms && pnpm install
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
| `POST` | `/api/contact` | Contact form submissions (Supabase) | `client/pages/Contact.tsx` |
| `POST` | `/api/diagnostic-report` | Diagnostic survey report (Supabase) | `client/pages/DiagnosticSurvey.tsx` |
| `GET` | `/api/studio` | Redirects to `SANITY_STUDIO_URL` | **Not linked from the React app** — bookmark or docs only |
| `GET` | `/api/draft-mode/enable` | Sanity Presentation / draft preview cookie | Sanity Studio Presentation (iframe), not direct user navigation |
| `GET` | `/api/draft-mode/disable` | Clears draft preview cookie | Same |

**Membership / apply flows:** Stripe uses **Payment Links** (client env). **Fillout** embeds run in the browser (e.g. apply/careers). Contact submissions go to **Supabase** via `/api/contact`.

---

## Security notes and fixes to prioritize

This is a codebase review checklist, not a penetration test. Address in order of risk for your threat model.

1. **CORS defaults** — If **`ALLOWED_ORIGINS`** is empty in production, `server/index.ts` allows **any** browser `Origin` for the `cors()` middleware (with a console warning). **Fix:** set explicit comma-separated origins for every deployed hostname (preview + prod).
2. **CSRF escape hatch** — **`REQUIRE_API_CSRF=false`** disables CSRF on POST APIs. **Fix:** never set in production except a documented break-glass; rotate tokens if it was ever used on a shared environment.
3. **Sanity dataset exposure** — Public datasets are readable without your app; the app mitigates with a **query whitelist** and server proxy, but **secrets and embargoed copy do not belong** in public datasets. **Fix:** align with `.env.example` (private datasets + read tokens where the plan allows).
4. **Preview / draft endpoints** — Draft-mode routes trust **Origin/Referer** heuristics and Sanity domains (`server/index.ts`). **Fix:** keep **`SANITY_API_READ_TOKEN`** scoped and rotated; restrict **`ALLOWED_ORIGINS`**; monitor abuse of `/api/draft-mode/*`.
5. **CSP** — Global CSP in `vercel.json` only sets **`frame-ancestors`** (for Sanity framing). **Fix:** if you tighten `Content-Security-Policy` further, regression-test HubSpot, Fillout, Luma embeds, and Stripe checkout flows.

---

## License / privacy

Repository **`website-cms/package.json`** declares `"license": "UNLICENSED"`. Confirm licensing with the project owner for both app and Studio packages.
