---
name: Sanity CMS rebuild
overview: Ultra-minimalist Rellia Web Studio — editor-first desk, unified sections, People hub (advisors, alumni, investors logo scroll), page visibility toggles, Looker Studio analytics only (no GA proxy), Presentation after sections stabilize.
todos:
  - id: desk-structure
    content: "Phase 1 DONE — deskStructure, Website Editor branding, Support + Looker panels"
    status: completed
  - id: list-ux
    content: "Phase 1 DONE — navigation list rows, document previews (People + Collections)"
    status: completed
  - id: people-investors-founders
    content: "Phase 1b — People desk: Investors + Founders pages; logoMarquee on founders; move Investors edit under People"
    status: pending
  - id: field-hints
    content: Phase 2 — shared fieldHints helpers and word-count descriptions
    status: pending
  - id: sections-unify
    content: Phase 3 — sections[] only; internalLabel + preview on every section; GROQ + PageRenderer + types
    status: pending
  - id: presentation-fix
    content: Phase 5 — Presentation/stega AFTER Phase 3; env checklist and Visual Editing verification
    status: pending
  - id: page-visibility
    content: Phase 8 — pageVisibility live/hidden/placeholder on all page singletons + frontend guard
    status: pending
  - id: careers-roles
    content: Phase 4 — careersPage.openRoles + seed migration (after data audit)
    status: pending
  - id: support-docs
    content: Phase 6 — expand Support / cmsGuide publishing and dataset docs
    status: pending
  - id: seo-plugin
    content: Phase 7 — sanity-plugin-seofields (NOT ga-dashboard)
    status: pending
  - id: looker-analytics
    content: Phase 7b — Looker Studio iframe (SANITY_STUDIO_LOOKER_EMBED_URL); no Express proxy
    status: pending
  - id: legacy-cleanup
    content: Phase 9 — hide pageBuilder, legacy advisor fields, orphan types; post-migration cleanup
    status: pending
isProject: false
---

# Sanity CMS Studio rebuild plan (v2)

**Docs:** [docs/sanity-cms-audit-and-rebuild-plan.md](../../docs/sanity-cms-audit-and-rebuild-plan.md) · [docs/sanity-cms-rebuild-guide.md](../../docs/sanity-cms-rebuild-guide.md)

**Branding:** `title` → **Rellia Web Studio** · drawer → **Website Editor**

## Analytics (no GA plugin)

- **Do not** install `sanity-plugin-ga-dashboard`
- **Do not** add Express `/api/analytics` or Google Cloud service-account keys
- **Do** use [LookerStudioPanel](../../website-cms/studio/LookerStudioPanel.tsx) + `SANITY_STUDIO_LOOKER_EMBED_URL`

## People hub — logo scroll

| Area | CMS doc | Field |
|------|---------|--------|
| Investors | `networkInvestorsPage` | `logoMarquee[]` — add/remove/reorder (already exists) |
| Founders / Alumni | `networkFoundersPage` | **Add** `logoMarquee[]` + GROQ + `Founders.tsx` |

Desk: **People → Investors** and **People → Founders** as primary edit entry (not buried only under Pages landings).

## Page visibility (all pages)

`pageVisibility`: `live` | `hidden` | `placeholder` + placeholder copy fields on every page singleton.

## Implementation order

1. Phase 1b — People + logo scroll schema/desk  
2. Phase 2 — Field hints  
3. Phase 3 — Sections unification  
4. Phase 5 — Presentation (**after 3**)  
5. Phase 8 — Page visibility + founders marquee frontend  
6. Phase 4 — Careers + seed (audit data first)  
7. Phase 6 — Support  
8. Phase 7 — `sanity-plugin-seofields`  
9. Phase 9 — Legacy cleanup  

See audit doc for full checklist and success criteria.
