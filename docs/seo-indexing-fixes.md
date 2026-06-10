# SEO & Google Search Console — indexing fixes

Last updated: June 2026

Use this checklist when [Google Search Console](https://search.google.com/search-console) reports low coverage or only a few indexed pages. The site is a **React SPA with build-time prerender** on key routes — crawlers that execute JavaScript see full content; others rely on prerendered HTML in `dist/spa`.

**Related:** [README metadata table](../README.md#page-metadata--open-graph) · `client/config/seo.ts` · `public/sitemap.xml`

---

## Why only a few pages may be indexed

| Cause | What happens |
|-------|----------------|
| **Intentional `noindex`** | `/membership`, all `/admin/*`, auth flows, and legacy redirect routes are excluded from search. |
| **SPA shell on unprerendered URLs** | Routes not in `PRERENDER_PATHS` (`client/config/seo.ts`) may ship minimal HTML until JS runs. |
| **New or CMS-only URLs** | Events, stories, alumni, and advisors added in Sanity after last deploy need a **rebuild** (prerender) and **sitemap regen**. |
| **Showcase / dummy profiles** | Seed showcase slugs (e.g. `dummy-showcase-advisor`) can appear in sitemap — unpublish or exclude if they should not rank. |
| **GSC not configured** | Property must verify `www.relliahealth.com`; sitemap must be submitted. |
| **Canonical host** | Production canonicals use `https://www.relliahealth.com` (`VITE_SITE_URL`). Apex → www redirect should stay enabled on Vercel. |

---

## Step 1 — Verify Search Console property

1. Open [Search Console](https://search.google.com/search-console) → **Add property** → **URL prefix**: `https://www.relliahealth.com`
2. Confirm verification file is live: `https://www.relliahealth.com/googleeb412906bf794180.html`
3. Also add **Domain** property `relliahealth.com` if you manage DNS (covers apex + subdomains).
4. Under **Settings → Users and permissions**, ensure the Rellia team has Owner access.

---

## Step 2 — Submit sitemap

1. In GSC → **Sitemaps** → enter: `sitemap.xml` (full URL: `https://www.relliahealth.com/sitemap.xml`)
2. After deploys that add routes or CMS slugs, regenerate locally:

```bash
pnpm run generate:seo-files
```

Commit updated `public/sitemap.xml` and `public/llms.txt`, then redeploy.

3. In GSC, click **Resubmit** if the sitemap “Last read” date is stale.

---

## Step 3 — Request indexing for priority URLs

Use **URL Inspection** for high-value pages (one at a time; avoid bulk spam):

| Priority | URLs |
|----------|------|
| Core | `/`, `/about`, `/programs`, `/founders`, `/apply`, `/contact` |
| Network | `/advisors`, `/investors`, `/industry-partners`, `/consulting` |
| Content | `/stories`, `/events`, top event and story detail URLs |
| Tools | `/startup-diagnostic` |

For each URL:

1. Paste full URL → **Test live URL**
2. Confirm **Page fetch** succeeds and **User-declared canonical** is `https://www.relliahealth.com/...`
3. If valid, click **Request indexing**

---

## Step 4 — Fix common coverage issues in GSC

| GSC status | Likely fix |
|------------|------------|
| **Crawled – currently not indexed** | Improve internal links from home/programs; ensure unique title/description; request indexing after content update. |
| **Discovered – currently not indexed** | Submit sitemap; add links from indexed pages; wait or request indexing. |
| **Duplicate without user-selected canonical** | Ensure one canonical per URL in `RouteSeo` / prerender; avoid duplicate paths (`/network` → `/founders` is `noindex`). |
| **Excluded by ‘noindex’ tag** | Expected for `/membership`, `/admin/*`, redirects — do not remove unless product requires indexing. |
| **Soft 404** | Page returns 200 but empty — check CMS publish state and prerender for that path. |
| **Redirect error** | Fix Vercel redirects in `vercel.json`; ensure old program slugs 301 to new URLs. |

---

## Step 5 — Engineering checks before each release

```bash
pnpm typecheck
pnpm test
pnpm build          # prerender runs here — inspect dist/spa for meta tags
pnpm run generate:seo-files
```

Manual smoke tests:

1. View source on `/about` and `/programs` — `<title>`, `meta description`, `link rel="canonical"`, `robots` should appear in HTML **without** running JS.
2. Open `https://www.relliahealth.com/robots.txt` — must reference sitemap.
3. Confirm `VITE_SITE_URL=https://www.relliahealth.com` on Vercel Production.
4. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or LinkedIn Post Inspector — test OG images under `/images/ogimage*.png` (1200×630).

---

## Step 6 — CMS & dynamic routes

| Content type | SEO source | Indexing notes |
|--------------|------------|----------------|
| Marketing singletons | Sanity **SEO** tab + `ROUTE_SEO` defaults | Prerendered at build |
| Events / programs / stories | Per-document SEO or generated titles | Rebuild after publish; sitemap from `generate:seo-files` |
| Alumni / advisor profiles | Profile name + directory meta | Showcase seeds prerendered; new CMS profiles need rebuild |
| Modular CMS pages (`/slug`) | Page document SEO | Add slug to prerender discovery via build script |

If a **new** Sanity event or story should rank, run a production deploy after publish so prerender + sitemap include the slug.

---

## Step 7 — Optional improvements (not blocking)

- **Bing Webmaster Tools** — submit same sitemap.
- **Internal linking** — link stories/events from home and programs (helps discovery).
- **Remove showcase URLs from sitemap** — edit `scripts/generate-sitemap-llms.ts` to skip `dummy-showcase-*` in production.
- **Structured data** — add JSON-LD for Organization / WebSite if not already on home (future enhancement).

---

## Quick reference — indexable vs blocked

**Indexable (in sitemap):** home, about, faq, careers, events, programs, apply, founders, consulting, advisors, investors, industry-partners, contact, stories, terms, privacy, startup-diagnostic, diagnostic-survey, plus dynamic event/program/story/directory URLs.

**Blocked (`noindex`):** `/membership`, `/admin/*`, `/accept-invite`, legacy redirects (`/network`, `/partners`, old program slugs), industry-partners external directory redirect.

**OG image only (share previews, may still be `noindex`):** `/membership` uses `/images/ogimage-membership.png` for link previews even though the page is not indexed.
