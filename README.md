<img src="public/ogimage.png" alt="Rellia Health" width="100%" style="border-radius:16px;" />
> Marketing website for **Rellia Health** — connecting founders, clinicians, and health systems to build the future of care.
- **Live**: `https://relliahealth.com`
- **Open Graph image**: `public/ogimage.png` (served at `https://relliahealth.com/ogimage.png`)

## Branches

- **main**: production-ready code deployed to `https://relliahealth.com`
- **Additions**: active development branch used for edits and new work before merging into `main`

## Workflow

Unapproved changes should be made on **`Additions`** branch - deployments can be previewed on [staging url](https://relliahealth.vercel.app). Once reviewed/approved, merge into **`main`** for production.

## Tech stack

- **Frontend**: React + TypeScript, Vite, React Router, Tailwind CSS, Radix UI
- **Content**: Sanity (read-only fetching in the app; Studio lives in `website-cms/`)
- **Server**: Express (optional server build / Vercel API entry)
- **Analytics**: Vercel Analytics, Vercel Speed Insights

## Key dependencies

From `package.json`:

- `react`, `react-dom`
- `react-router-dom`
- `tailwindcss`
- `@sanity/client`, `@portabletext/react`
- `express`

# Getting Started
> Follow these steps to clone a local copy of the repo and to install the prequsites for this project

## Cloning

```bash
# HTTPS
git clone https://github.com/Agrolax/rellia-landing-page.git

# or SSH
git clone git@github.com:Agrolax/rellia-landing-page.git

cd rellia-landing-page

```

## Local installation

Prerequesites: **Node.js (LTS)** and **pnpm** (enable via Corepack).

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

## Environment variables

The app is designed to run without secrets locally. Optional variables (see `.env.example`):

- `VITE_SITE_URL`: canonical URL for SEO/OG/JSON-LD (defaults to `https://relliahealth.com`)
- `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`: override Sanity project/dataset
- `VITE_STRIPE_MONTHLY_PLAN_LINK`, `VITE_STRIPE_ANNUAL_PLAN_LINK`: Stripe Payment Links for `/payment`
- `VITE_QMS_PAYMENT_LINK`: Stripe Payment Link override for `/programs/qms`
- `ANTHROPIC_API_KEY`: server-only (diagnostics report generation), never `VITE_*`

Other runtime env vars used by the server:

- `PORT`: server port when running the Node build locally (defaults to `3000`)
- `VERCEL`: set by Vercel in deployed environments (used to detect platform runtime)
- `NODE_ENV`: standard Node environment (set by tooling/platform)

## Repo structure

- `client/`: React app (routes, components, styles)
- `server/`: Express server (serves the built SPA and API wiring)
- `api/`: Vercel function entrypoint
- `shared/`: shared CMS defaults / utilities used by client + server
- `public/`: static assets (includes `ogimage.png`)
- `website-cms/`: Sanity Studio project
