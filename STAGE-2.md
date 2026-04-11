# Stage 2 documentation

Scope and checklist for the next phase of the Rellia marketing site. Work typically lands on **`Additions`** and merges to **`main`** when ready for production.

See also: [README.md](./README.md) for setup, stack, and day-to-day workflow.

---

Stage 2 extends what is already live: the team continues to author content in **Sanity**, the app keeps fetching it at runtime, and **code-level defaults** in `shared/cms/defaults.ts` remain a safety net when content is missing or offline. New work adds a **public partner directory** (browse, filter, detail views backed by new partner documents), finishes **diagnostics** routes and UX, tightens **security and dependencies**, keeps **SEO** aligned with routes, and refreshes **design and user flow** where agreed—including **redesigning** [Home](https://www.relliahealth.com/) toward a more **image-based** layout and **clearer visibility**, evolving the [Membership](https://www.relliahealth.com/membership) page in the same direction, and **maintaining brand continuity** (type, color, and components) everywhere those surfaces are touched.

---

## Checklist — Sanity and content

- [ ] Datasets, **CORS**, and allowed origins for production, preview, and local dev.
- [ ] **Publish** documents the app already reads (Home, [About](https://www.relliahealth.com/about), [FAQ](https://www.relliahealth.com/faq), [Programs & Events](https://www.relliahealth.com/programs), [QMS program](https://www.relliahealth.com/programs/qms), [Network](https://www.relliahealth.com/network), [Contact](https://www.relliahealth.com/contact), membership / payment, global settings, not found) so production copy comes from Studio, not defaults.
- [ ] Add a **partner** schema, publish partner entries, and align field descriptions with the front end (Stripe links, alt text, CTAs, discovery links).
- [ ] Production should rarely depend on **`shared/cms/defaults.ts`** except as fallback; optional **dev-only warning** when important fields fall back.
- [ ] Keep **`paymentUrl`** per program in Sanity; optional env overrides for staging (e.g. `VITE_QMS_PAYMENT_LINK`).
- [ ] Ensure website can be indexed by Google for SEO & implement pre-rendering or SSG/SSR so SEO can index and crawl the website properly

---

## Checklist — Industry partners directory

Public route where visitors explore Rellia’s partner network: **searchable and categorized**, with **expandable cards or a modal / drawer** for full detail without leaving the page. Partners are **Sanity documents** (add, edit, remove, reorder); the app reads **published** data only.

**Experience**

- [ ] **Filter bar** — Categories such as Clinical, Legal, Regulatory, Technical, Commercialization (multi-select, tabs, or similar); optional name search if spec’d.
- [ ] **Partner grid** — Responsive layout: logo, name, short tags; keyboard-accessible cards.
- [ ] **Detail view** — Full bio and value proposition; member perks or discounts where applicable; website, contact, or **Book a discovery** CTA per partner fields.
- [ ] **Route and SEO** — Choose path (e.g. `/partners` or `/network/partners`), add to `client/config/seo.ts`, `public/sitemap.xml`, and `App.tsx`.
- [ ] **Loading and empty states** — Skeleton or copy when there are no partners; clear error state on fetch failure.
- [ ] **Navigation** — Link from Network and/or main nav when live.

**Data and client**

- [ ] **Partner fields** (example): name, logo, category/categories, short summary, full description (rich or plain text), website URL, optional CTA label/URL, optional perks (portable text), optional order or featured flag.
- [ ] **GROQ** — Fetch published partners; filter in the query or in React depending on list size.
- [ ] **Types** — Add types under `shared/cms/`; defaults only for empty or error cases.
- [ ] **TanStack Query** — e.g. `usePartnersDirectory()` with stable `queryKey` and `staleTime` consistent with other CMS hooks.
- [ ] Reuse **`client/lib/sanity.ts`**, **`@portabletext/react`** where copy is portable text, and existing UI primitives (buttons, dialogs, sheets).

**Optional**

- [ ] **`client/lib/partnersQueries.ts`** or a small **`client/features/partners/`** area for queries and hooks; split `client/lib/cmsQueries.ts` by domain if it grows.

---

## Checklist — Diagnostics and survey

- [ ] Register routes in **`client/App.tsx`**; match **`client/config/seo.ts`** (finalize slugs, e.g. `/diagnostics`, `/diagnosticSurvey`).
- [ ] Replace **`alert()`** with inline error UI and retry.
- [ ] Verify **`POST /api/diagnostic-report`** on Vercel with **`ANTHROPIC_API_KEY`**; confirm rate limits and response shape.
- [ ] Branded **loading / processing** states; test **mobile** layout and **keyboard** order.

---

## Checklist — Cleanup and hardening

**Code**

- [ ] Consistent formatting with project conventions.
- [ ] Remove or gate **production console** noise where inappropriate.
- [ ] Drop **unused** dependencies if confirmed unused (`framer-motion`, `@react-three/*`, `three`, `recharts` unless you ship charts).

**Security**

- [ ] **CORS** limited to known origins on the Express API.
- [ ] Do not return raw upstream error bodies from Anthropic to the browser; **validate LLM JSON** (e.g. Zod) before responding.
- [ ] **CSP** in phases, accounting for HubSpot, Fillout, and Vercel.

**SEO and performance**

- [ ] Keep **`seo.ts`**, **`sitemap.xml`**, and routes aligned (directory, diagnostics).
- [ ] Set **`VITE_SITE_URL`** per environment to the canonical domain.
- [ ] **Lighthouse** on key URLs; tune LCP; watch **INP**.

**Dependencies**

- [ ] **`pnpm audit`**; upgrade **React Router**, **Vite / Rollup**, and transitive issues as needed; document any accepted risk.

---

## Checklist — Redesign and brand

- [ ] **Home** — Stronger **image-led** sections (photography/illustration, cards, or media blocks), improved **hierarchy and scanability**, and parity with the published landing page once shipped.
- [ ] **Membership** — Align the membership checkout experience with the refreshed visual language (clarity, trust, and continuity with Network / Programs CTAs).
- [ ] Clarify journeys (e.g. Home → Programs → membership checkout; Network → partners / forms; Contact).
- [ ] Consistent **Host Grotesk / Urbanist** and **rellia-teal / mint / cream** on touched pages.
- [ ] Clear **primary CTA** per major section; reuse **`RelliaButton`** / **`RelliaAction`**.
- [ ] **Spacing and max-width** rhythm across updated pages.
- [ ] **`prefers-reduced-motion`**, visible **focus**, sensible **heading** order.

---

## Suggested sequence

1. Open **`Additions`** from **`main`**.
2. Publish and extend **Sanity** (existing pages, then partner schema and data).
3. Build the **partner directory** UI and wire route, SEO, and nav.
4. Ship **diagnostics** (routes, UX, API checks).
5. **Security**, **`pnpm audit`**, and **dependency** cleanup.
6. **Redesign** agreed surfaces.
7. **QA**: Lighthouse, keyboard pass, staging on Vercel, `pnpm test`, `pnpm typecheck`.

---

## Environment variables

| Where | Variables |
|-------|-----------|
| Client (`VITE_*`) | `VITE_SITE_URL`, `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_STRIPE_MONTHLY_PLAN_LINK`, `VITE_STRIPE_ANNUAL_PLAN_LINK`, `VITE_QMS_PAYMENT_LINK` (and similar overrides if you add them) |
| Server / Vercel | `ANTHROPIC_API_KEY` (diagnostics API only; never expose as `VITE_*`), plus platform vars such as `VERCEL`, `NODE_ENV`, `PORT` locally |

Details: [README.md](./README.md) and `.env.example`.

---

## Definition of done

- [ ] Marketing copy and global settings in production come from **published Sanity**; defaults are exceptional.
- [ ] **Partner directory** is live, filterable, accessible, SEO-complete, and editable in Studio.
- [ ] **Diagnostics** are routed with solid loading, errors, and API behavior.
- [ ] Security and dependency items are done or **documented** with rationale.
- [ ] Redesigned areas meet **a11y** and **responsive** expectations.

---

*Living document for the Stage 2 workstream.*
