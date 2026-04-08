# Rellia Health — Marketing Site

Single-page application (SPA) for [Rellia Health](https://relliahealth.com): React + Vite frontend, optional Express server bundle for static hosting and future API routes, and Sanity Studio for structured content. Deployed on **Vercel**; repository is **private**.

## Overview

- **Frontend:** React 18, TypeScript, Vite 7, Tailwind CSS, React Router, Radix UI  
- **CMS:** Sanity (read-only client in the browser; Studio in `website-cms/`)  
- **Payments:** Stripe **Payment Links** only (URLs in env or CMS — no Stripe secret keys in this repo)  
- **Contact:** HubSpot embedded form  
- **Analytics:** Vercel Analytics, Speed Insights  

The **`/programs`** route lists program cards from Sanity; each program detail page (e.g. **`/programs/qms`**) uses a shared layout and its own **`paymentUrl`**. The **`/payment`** route handles membership-style plan links separately.

## Requirements

| Tool | Notes |
|------|--------|
| **Node.js** | LTS (20.x or 22.x recommended) |
| **pnpm** | Enforced via `packageManager` in `package.json` — run `corepack enable` once |
| **Git** | For clone and version control |

## Getting started

```bash
git clone https://github.com/Agrolax/rellia-landing-page.git
cd rellia-landing-page
corepack enable
pnpm install
cp .env.example .env
```

Edit `.env` locally. **Do not commit `.env`.** See `.env.example` for optional `VITE_*` variables (Sanity overrides, Stripe Payment Link URLs).

```bash
pnpm dev
```

The dev server URL is printed by Vite (typically `http://localhost:5173`).

**SSH clone:** `git clone git@github.com:Agrolax/rellia-landing-page.git`

### Sanity Studio (local)

For schema or content editing against the configured project:

```bash
cd website-cms
pnpm install
pnpm dev
```

Run in a separate terminal from the root app. See `website-cms/README.md` for Studio-specific notes.

### After a force-pushed history rewrite

If `git pull` fails after the remote history was rewritten: **re-clone**, or `git fetch origin && git checkout main && git reset --hard origin/main` (repeat per branch), then remove `node_modules` and run `pnpm install` again at the repo root and under `website-cms/` if needed.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Build client (`dist/spa`) and server (`dist/server`) |
| `pnpm start` | Run production Node server (after `pnpm build`) |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Vitest |
| `pnpm format.fix` | Prettier (write) |

## Project structure

| Path | Description |
|------|-------------|
| `client/` | React application (pages, components, hooks) |
| `server/` | Express `createServer()` — static + API placeholder for Vercel |
| `api/` | Vercel serverless entry exporting the Express app |
| `shared/` | Shared types, CMS defaults, GROQ queries |
| `public/` | Static assets |
| `website-cms/` | Sanity Studio project (schemas, config) |

Application routes are defined in `client/App.tsx`.

## Security

- Never commit `.env` or third-party API secrets.  
- Stripe integration is limited to **public Payment Link URLs** in environment or CMS fields — not `sk_*` or server-side Checkout Session creation in this codebase.
- Diagnostic report generation (if enabled) must use **server-only** env vars (e.g. `ANTHROPIC_API_KEY`) behind `/api/*` routes — never in `VITE_*`.

## Deployment

Production and preview targets are configured in **Vercel** and tied to **Git** branches; confirm branch → environment mapping with the team before changing deploy settings or environment variables.
