# Sanity Content Studio (Rellia Health CMS)

This directory contains the **Sanity Studio** (v3) configuration, schemas, and structures used to manage dynamic content for the Rellia Health website.

**Live Studio:** [relliahealth.sanity.studio](https://relliahealth.sanity.studio) · **Handoff guide:** [docs/website-management-guide.md](../docs/website-management-guide.md)

---

## Architecture & CMS Integration

Rellia Health uses a **hybrid architecture** that balances designed React templates (with CMS hooks) and dynamic CMS-built modular layouts:

1. **Pre-designed React templates (with CMS overrides)**:
   - Pages like `Index` (Home), `About`, `FAQ`, `Careers`, `/network/*` directories, and single item views read structured documents or query lists from Sanity to populate content fields (headings, testimonials, stories, open roles, etc.).
   - If Sanity dataset is unconfigured or empty in local development, these pages fall back to static code defaults (`shared/cms/defaults.ts`) to ensure the site runs out-of-the-box.
2. **CMS-built modular layouts**:
   - Customizable custom pages run through `client/pages/CmsCatchAll.tsx` and can also override pre-designed page layouts via the `useModularPage` boolean flag in `client/components/cms/CmsModularSingletonPage.tsx`.
   - When active, the page renders sections from a **Page Builder** block field using `client/components/cms/PageRenderer.tsx` which maps schemas (e.g., `sectionHero`, `sectionFeatureGrid`, `sectionFaq`) to responsive, styled React components.

---

## Datasets & Environments

The codebase divides environment scopes strictly using environment variables:

| Environment / Branch | `VITE_SANITY_DATASET` / `SANITY_API_DATASET` | Purpose | Seeding Fallback Allowed? |
| :--- | :--- | :--- | :--- |
| **`main` (Production)** | **`production`** | Live website + Studio | **No** |
| **Local Dev / seed** | **`preview`** (optional) | Developer experiments | **Yes** |

> [!IMPORTANT]
> To prevent ghost events or outdated dummy data on the live site, **no code-defaults or static seeds are permitted to load when the VITE_SANITY_DATASET is `production`**. This is enforced by `client/lib/deploymentEnv.ts` → `allowCmsSeedFallbacks()`.

---

## Security: Server-side Query Proxying

For security and cache control, the client application **never executes raw GROQ queries directly from the browser**.
Instead:
1. The client sends a `POST` request to `/api/sanity/query` specifying a whitelisted `queryId` and parameters (see `client/lib/sanity.ts`).
2. The Express server validates the `queryId` against the registry (`shared/cms/sanityQueryRegistry.ts`), formats the query, fetches the data using the read token (`SANITY_API_READ_TOKEN`), and returns the results.
3. This prevents exposure of the read token to the public client and mitigates raw query abuse.

---

## Sanity Visual Editing (Presentation)

The site integrates `@sanity/visual-editing` to enable click-to-edit overlays and live previews directly inside the Sanity Studio Presentation iframe.

### Setup Checklist

**Editors (hosted Studio)** — Studio edits **`production`**. **Publish** updates [www.relliahealth.com](https://www.relliahealth.com). **Presentation** previews drafts inside Studio only (iframe → www).

- **Sanity Studio** env:
  - `SANITY_STUDIO_DATASET=production`
  - `SANITY_STUDIO_PREVIEW_URL=https://www.relliahealth.com`
- **Vercel Production** (`www`): `VITE_SANITY_DATASET=production`, `SANITY_API_READ_TOKEN` (for Presentation draft mode), published content for normal visitors

---

## Local Development & Studio Commands

### Run Sanity Studio locally

From the project root:
```bash
cd website-cms
pnpm install
pnpm dev
```
The studio runs on `http://localhost:3333` (or configured fallback port).

### Deploying the Studio

To update the hosted Sanity Studio:
- From the **root** folder:
  ```bash
  pnpm sanity:studio:deploy
  ```
- Alternatively, from the **`website-cms/`** folder:
  ```bash
  cd website-cms
  pnpm exec sanity deploy
  ```

---

## Schema Structure

The schemas in `schemaTypes/` are structured as follows:
- **`schemaTypes/documents/`**: Page singletons (e.g. `homePage`, `careersPage`) and shared collections (e.g. `advisor`, `event`, `story`).
- **`schemaTypes/objects/`**: Reusable sub-structures and modular page section definitions (e.g., `ctaButton`, `sectionEligibilityBento`, `sectionFaq`).
- **`deskStructure.ts`**: Organizes how these documents are categorized in the Studio sidebar (separating singletons and pages from global assets).

