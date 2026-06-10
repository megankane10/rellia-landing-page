# CMS legacy & cleanup backlog

Last updated: June 2026

This document tracks **legacy Sanity fields, code fallbacks, and wiring** that still exist in the repo but are no longer shown in Studio (or should be removed in a future pass). Use it when editing schemas, seed scripts, or GROQ queries.

**Related:** [website-management-guide.md](./website-management-guide.md) (editor workflow)

---

## Recently cleaned up (Payment page `/membership`)

| Item | Status |
|------|--------|
| `welcomeSplashHeadingPortable` | **Active** — dual-tone splash headline (`inlineHeroHeadline`). Select words → **Mint** or leave default white. Replaces plain `welcomeSplashHeading` string (still read as fallback). |
| `welcomeSplashDurationSeconds` | **Active** — hold time after splash text reveals (0.5–8s). Visible under **Welcome splash** in Studio after schema deploy. |
| `benefits` (“Cancel policy line”) | **Removed from Studio** — cancel copy is hardcoded in `client/pages/Payment.tsx`. |
| `benefitsPanelBullet1`–`4` | **Removed from Studio** — use `benefitsPanelDescription` only. Merge still reads old bullets for migrated content. |
| `legacyMembershipFields` block (badge, headline, hero, image card, pricing badges, etc.) | **Removed from Studio** — old two-column membership layout; not rendered on `/membership`. Data may still exist on `paymentPage` documents until a cleanup migration runs. |
| `discountBannerTitle` | **Removed from Studio** — promo copy should use `promoMessage` (`{code}` placeholder). Code still falls back to `DEFAULT_PAYMENT_PAGE.discountBannerTitle` if `promoMessage` is empty. |

**Studio deploy required:** Schema changes only appear in [relliahealth.sanity.studio](https://relliahealth.sanity.studio) after `pnpm sanity:studio:deploy`.

---

## Payment page — data still in GROQ / merge (not in Studio)

These fields are **queried and merged** in `shared/cms/groqQueries.ts`, `api/index.js`, and `mergePaymentPage()` but **not editable** in Studio after the June 2026 schema trim:

- `badge`, `headline`, `introCheckout`, `introFallback`, `introFallbackError`
- `successTitle`, `successBody`
- `heroTitlePortable`, `heroSubheadline`, `imageCardBadge`, `imageCardHeadlinePortable`, `imageCardSrc`, `imageCardAlt`, `highlightBenefits`
- `pricingMonthlyBadge`, `pricingAnnualBadge`, `pricingPerSuffix`, `popularLabel`
- `discountBannerTitle`, `discountBannerApplyLabel`, `discountBannerApplyHref`
- `benefits` (array), `benefitsPanelBullet1`–`4`
- `welcomeSplashHeading` (plain string — superseded by `welcomeSplashHeadingPortable`)

**Suggested follow-up:** One-time `sanity-cleanup` patch to `unset` these keys on `paymentPage`, then drop them from GROQ, types, and `DEFAULT_PAYMENT_PAGE`.

---

## Event host images (`shared/cms/eventHostImage.ts`)

Host portrait resolution order:

1. CMS `hostImage` upload (when asset exists)
2. Slug in `EVENT_FAVICON_HOST_SLUGS` → Rellia favicon (`/images/favicon-192.png`)
3. Speaker/company name heuristics (Rellia Health, Dr. Sabina Nagpal, Brenton Hill, AI Collective, Eric Haywood, etc.)
4. Default → Rellia favicon

**Note:** Clearing host image in Studio should show the Rellia icon for slug-listed events. GROQ uses `select(defined(hostImage.asset) => …)` so empty image slots do not return stale URLs.

**Cleanup candidate:** Slug/name inference rules are code-owned; consider documenting per-event defaults in Sanity only and deleting hardcoded speaker portraits.

---

## Events — other legacy

| Field | Location | Notes |
|-------|----------|-------|
| `dateTime` | `event.ts` (hidden) | Legacy label; site uses `startsAt` / `endsAt`. |
| Static seed events | `shared/cms/defaults.ts` | Used only when `allowCmsSeedFallbacks()` is true (non-production). |

---

## Hero headlines (site-wide)

| Pattern | Files | Notes |
|---------|-------|-------|
| `heroHeadlinePortable` → `heroTitlePortable` | GROQ `coalesce`, `resolveHeroHeadline.ts` | Legacy split accent fields migrated via `scripts/sanity-migrate-cms-headlines.ts`. |
| `metricsHeading` plain string | Network/home metrics | Fallback before `inlineHeroHeadline` portable text. |

---

## Careers page

| Item | Status |
|------|--------|
| **Open roles collection** (`openRole`) | **Active** — managed under Collections → Open roles (not embedded on `careersPage`). |
| `description` | **Active** — `openRoleDescription` rich text (paragraphs, bold, bullet lists). Plain strings from older content are converted at read time via `normalizeToPortableText`. |
| `applyButtonLabel` + `applyButtonUrl` | **Active** — optional pair; apply button on `/careers` renders only when **both** are set. |
| `responsibilities` | **Active** — optional “Role highlights” bullets; section hidden when empty. |
| Share URLs | **Active** — `/careers/roles/{roleId}` with per-role Open Graph title/description (prerendered at build). Copy-link uses this canonical URL. |
| `careersContentMode` | **Active** — `both` \| `hiring_only` \| `volunteer_only` on `careersPage`. |
| Seeded placeholder role IDs | `shared/careersOpenRolesVisibility.ts` hides `program-operations-manager` and `community-events-coordinator` on production only. |

**Removed (June 2026):**

- `linkedInApplyUrl` on `openRole` — replaced by `applyButtonLabel` + `applyButtonUrl`.
- Embedded `openRoles` array on `careersPage` — migrated to `openRole` documents (`scripts/sanity-cleanup.ts`).
- `enableHiringTab` / `enableVolunteerTab` / `defaultTab` on `careersPage` — use `careersContentMode` only.

**Studio deploy required** after `openRole` schema changes (`pnpm sanity:studio:deploy`).

**Suggested follow-up:** Run `sanity-cleanup` to `unset` `linkedInApplyUrl` on any remaining `openRole` documents in production.

---

## Modular page builder

| Item | Notes |
|------|-------|
| Legacy section types | `website-cms/schemaTypes/objects/pageBuilder/index.ts` — old blocks kept for existing `page` documents. |
| `portableRichText` vs `portableText` | Same engine; legacy type name kept for GROQ compatibility. |

---

## SEO

| Item | Notes |
|------|-------|
| `seo` object + `seoFields` plugin | GROQ maps both via `seoFragment` in `groqQueries.ts`. |
| `siteSettings.defaultSeo` | Hidden fallback in schema; used when page-level SEO is blank. |

---

## Network / directory

| Item | Notes |
|------|-------|
| Duplicate filter groups | `client/lib/directoryFilterOptions.ts` dedupes legacy “Countries” / “Specialties” group slugs. |
| `buildSocialLinksFromLegacy` | `shared/cms/socialLinks.ts` — maps old single URL fields to link objects. |

---

## Image URL fallbacks (intentional, not legacy)

Many schemas expose **upload + URL fallback** pairs (e.g. `benefitsPanelImage` + `benefitsPanelImageSrc`). These are active patterns, not debt — keep unless moving to CDN-only assets.

---

## Recommended engineering tasks (priority)

1. **Deploy Studio** after any `website-cms/schemaTypes` change (`pnpm sanity:studio:deploy`).
2. **Unset payment page legacy keys** on production `paymentPage` and remove from GROQ/types.
3. **Replace event host heuristics** with explicit CMS defaults or a “use Rellia host” boolean per event.
4. **Run headline migration** on any dataset that still has `heroHeadlineAccent` / split fields (`pnpm sanity:migrate:cms-headlines`).
5. **Audit `DEFAULT_PAYMENT_PAGE` and seed scripts** so they only seed fields that exist in the current schema.
