# Rellia website — owner management guide

This guide is for non-technical editors who manage the marketing site through **Sanity Studio** ([relliahealth.sanity.studio](https://relliahealth.sanity.studio)). Engineering handles code deploys; you handle words, images, and publishing.

**Project status:** The marketing site and CMS handoff are complete (June 2026). Day-to-day work is publishing and content updates in Studio — not waiting on a rebuild.

---

## 1. Logging in and publishing

1. Open Sanity Studio and sign in with your Rellia account.
2. Edit a document and click **Publish** when you are happy with the changes.
3. **Draft** means saved but not published. Visitors only see **published** content.

### Preview vs live website

| Where | What you see |
|-------|----------------|
| **www.relliahealth.com** (normal browsing) | **Published** content only — what visitors see |
| **Studio → Presentation** | **Drafts + published** inside Studio’s preview panel only (not on the public site) |

**Publish** in Studio is what makes changes live on www. Saving without publishing keeps work as a draft.

If you used **Presentation** earlier and www looked wrong in the same browser tab, open www in a **new tab** or refresh — unpublished content must not appear on the public site.

**Page visibility** (Live / Hidden / Placeholder) is separate from Publish. A page can be published in Studio but still show “coming soon” on the site if visibility is not **Live**. Check **Publishing → Page visibility** on each page singleton.

---

## 2. Studio sidebar map

| Menu | What it controls |
|------|------------------|
| **Site → Site settings** | Brand name, default SEO, analytics embed URL |
| **Site → Global settings** | Site-wide modals, banners, and global copy |
| **Site → Navigation** | Header and footer links |
| **Pages** | One document per designed route (Home, Careers, Consulting, Apply, etc.) |
| **Collections** | Repeatable content: Programs, Events, Stories, **Open roles**, filters |
| **People** | Advisors, founders, alumni companies |
| **Build a new page** | Custom URLs built from modular sections (e.g. `/partner-program`) |
| **Support → How to use this CMS** | In-Studio copy of this guide (editable) |

---

## 3. Common tasks

### Homepage hero

**Pages → Home** → Hero tab. Update headline, subtitle, CTAs, and hero image. Use **Presentation** to preview, then **Publish** and confirm on www.

### Add or edit a program

**Collections → Programs** → open a program or create one. Fill card fields (listing) and **Detail page** tabs for the full program page. Set **Page visibility** to Live when ready.

### Add or edit an event or story

**Collections → Events** or **Stories**. Stories use categories from **Collections → Stories → Categories** (Founder Story, Industry Insight, Program Update). Story SEO titles default to `Story title — Category` when the SEO tab is left empty.

### Post an open role (careers)

1. **Collections → Open roles** → create a document per job.
2. Fill title, location, employment type, description, responsibilities, and **Apply URL** (often LinkedIn).
3. **URL anchor ID** becomes the in-page link (e.g. `/careers#program-operations-manager`).
4. On **Pages → Careers**:
   - Set **Careers page mode** (both / hiring only / volunteer only).
   - Turn on **Show open roles on production (www)** only when jobs should appear on the live site (preview always shows roles for editing).

### Update apply steps and role boxes

**Pages → Apply** — timeline steps and **Role path links** (Founder / Advisor / etc. cards). Form embeds use Fillout; contact engineering to change form IDs.

### Edit consulting or startup diagnostic copy

- **Pages → Consulting** — grouped tabs: Hero, Fit, Services, Testimonials, Membership, CTA.
- **Pages → Startup diagnostic** — Hero, Readiness, Infographic, Timeline, CTA.

Do **not** change diagnostic **survey scoring** in **Diagnostic Survey Page** without engineering.

### Careers nav badges

**Pages → Careers** — toggle **Show HIRING badge** or **Show VOLUNTEER badge** in navigation and footer.

### Build a custom page

**Build a new page** → add title and slug → stack **Page sections** (Marketing hero, Feature grid, Testimonials, CTA band, etc.). Avoid slugs that match existing routes (about, careers, contact, programs, …).

**Test page:** after seeding, `/cms-handoff-test` demonstrates mixed blocks (preview only until promoted).

---

## 4. What not to touch

- Diagnostic survey **scoring weights** and internal survey logic
- **Reserved slugs** (about, careers, contact, apply, programs, admin, etc.)
- **Admin dashboard** routes and login
- **Stripe** membership payment configuration (engineering)
- **Fillout** form IDs for apply/volunteer (engineering)
- CTA headlines use **plain text** — do not add `**` for bold

---

## 5. After engineering merges to main

Use this checklist when a large CMS or code update lands on `main`:

1. **Confirm preview deploy** — Vercel preview should show the latest build (engineering can verify).
2. **Content sync** — If Studio looks empty or stale, ask engineering to run:
   - `pnpm sanity:seed` (preview dataset), or
   - sync per [sanity-dataset-sync-guide.md](./sanity-dataset-sync-guide.md)
3. **Publish** changed documents in Studio (production dataset → www).
4. **Review on www** — Spot-check the live pages you changed.
5. **Preview deploy** — Engineering may sync `preview` for `relliahealth.vercel.app` if needed; editors do not need to wait on this.
6. **Careers** — Enable **Show open roles on production** when real listings should go live on www.
7. **Final check** — Spot-check homepage, careers, apply, consulting, and any new custom pages on www.

---

## 6. Other platforms (brief)

| Platform | Role |
|----------|------|
| **Vercel** | Hosts the site; preview vs production URLs |
| **Sanity** | Content database and Studio |
| **Fillout** | Apply and volunteer application forms |
| **Stripe** | Membership checkout link |
| **LinkedIn** | Job apply URLs on open role documents |

For form IDs, payment links, or promote/sync commands, contact engineering.

---

## 7. Getting help

- In Studio: **Support → How to use this CMS**
- Engineering: dataset promote/sync — [sanity-dataset-sync-guide.md](./sanity-dataset-sync-guide.md)
- This file: `docs/website-management-guide.md` in the repository
