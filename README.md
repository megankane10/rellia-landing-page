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
- **Content:** Sanity — the browser fetches published documents read-only; editors use **Sanity Studio** in `website-cms/`
- **Data loading:** TanStack Query for CMS-backed pages
- **Server:** Express app used for **`/api`** on Vercel and for optional local full-stack runs (`pnpm build` + `pnpm start`)
- **Analytics:** Vercel Analytics, Vercel Speed Insights
- **Deployment:** Vercel (static SPA + serverless API)

---

## Repository layout

| Path | Purpose |
|------|---------|
| `client/` | React app: pages, components, hooks, styles |
| `server/` | Express application and local server entry |
| `api/` | Vercel serverless handler that mounts the Express app |
| `shared/` | Shared CMS types, merge helpers, and default fallbacks |
| `public/` | Static files (`robots.txt`, `sitemap.xml`, images, `favicon.ico`, `ogimage.png`) |
| `website-cms/` | Sanity Studio (separate `package.json`; run its own install for Studio dev) |

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

Edit `.env` if you need non-default Sanity project, Stripe links, site URL, or server keys (see below).

**Run the Vite dev server**

```bash
pnpm dev
```

**Sanity Studio** (content editing UI), from the studio package:

```bash
cd website-cms
pnpm install
pnpm dev
```

**Production-like build** (client + server bundles)

```bash
pnpm build
pnpm start
```

Starts the Node server that serves the built SPA and API (default port from `PORT` or `3000`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Vite dev server (hot reload) |
| `pnpm build` | Build SPA and server |
| `pnpm start` | Run production Node server locally |
| `pnpm test` | Vitest |
| `pnpm typecheck` | TypeScript (`tsc`) |
| `pnpm format.fix` | Prettier write |

`npm run <script>` works as well if you use npm.

---

## Environment variables

Values are documented in **`.env.example`**. Nothing secret is required for a basic local UI; Sanity reads use public project id + dataset by default.

**Client (Vite — exposed to the browser; never put secrets in `VITE_*`)**

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_URL` | Canonical origin for SEO, Open Graph, JSON-LD (omit trailing slash) |
| `VITE_SANITY_PROJECT_ID` | Sanity project id |
| `VITE_SANITY_DATASET` | Sanity dataset (e.g. `production`) |
| `VITE_STRIPE_MONTHLY_PLAN_LINK` | Stripe Payment Link for `/payment` (monthly) |
| `VITE_STRIPE_ANNUAL_PLAN_LINK` | Stripe Payment Link for `/payment` (annual) |
| `VITE_QMS_PAYMENT_LINK` | Optional override for QMS program checkout URL |

**Server only**

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Used by `POST /api/diagnostic-report` on Vercel / Node; omit locally if you do not use that endpoint |
| `PORT` | HTTP port for `pnpm start` (default `3000`) |
| `VERCEL` | Set automatically on Vercel |
| `NODE_ENV` | Set by tooling / platform |

---

## API (Express / Vercel)

- **`GET /health`** — Health check  
- **`POST /api/diagnostic-report`** — Startup diagnostic report (requires `ANTHROPIC_API_KEY`, body validated with Zod)

Contact and membership flows use **HubSpot**, **Fillout**, and **Stripe Payment Links** in the client, not custom form POST routes.
