/**
 * Seeds starter content for empty Studio singletons (legal pages, support guide, page shells).
 * Safe to re-run: createOrReplace only — does not delete advisors, events, or stories.
 *
 *   pnpm sanity:seed:starters
 *   SANITY_API_DATASET=production pnpm sanity:seed:starters
 *
 * Requires SANITY_API_WRITE_TOKEN and project id env (see scripts/sanity-seed.ts).
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { ROUTE_SEO } from "../client/config/seo"
import { legalSectionsToPortableText } from "../shared/cms/legal/sectionsToPortableText"
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_PAGE_INTRO,
  TERMS_SECTIONS,
} from "../shared/cms/legal/termsSections"
import {
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_LEGAL_NOTICE,
  PRIVACY_PAGE_INTRO,
  PRIVACY_SECTIONS,
} from "../shared/cms/legal/privacySections"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

const seoForRoute = (pathname: string) => {
  const cfg = ROUTE_SEO[pathname]
  if (!cfg) return undefined
  const title = cfg.title
  const description = cfg.description
  const noIndex = cfg.indexable === false
  return {
    metaTitle: title,
    metaDescription: description,
    ogTitle: title,
    ogDescription: description,
    noIndex,
    title,
    description,
    openGraph: { title, description },
    robots: { noIndex, noFollow: false },
  }
}

const pagePublishingLive = { pageVisibility: "live" as const }

const studioGuideDoc = {
  _id: "studioGuide",
  _type: "studioGuide",
  title: "How to use this CMS",
  intro:
    "Quick reference for editors using Rellia Web Studio. Update this page anytime — it is not shown on the public website.",
  sections: [
    {
      _type: "guideSection",
      _key: "seo",
      heading: "SEO in Studio",
      body:
        "Each page has an SEO tab with a live Google preview (free). Ignore SEO Health Dashboard — it requires a paid license. Use the per-page SEO fields instead. Site-wide defaults live under Site → Site settings → Default SEO.",
    },
    {
      _type: "guideSection",
      _key: "analytics",
      heading: "Analytics",
      body:
        "Use the Analytics tool in the Studio top bar (full-screen Looker embed). Set the URL under Site → Site settings → Analytics (Studio). In Looker: Share → Embed report → copy iframe src.",
    },
    {
      _type: "guideSection",
      _key: "legal",
      heading: "Terms & privacy",
      body:
        "Edit legal copy under Site → Terms of use and Site → Privacy policy. The live site shows your Studio content when the body field has text; otherwise it falls back to built-in defaults until you publish content here.",
    },
    {
      _type: "guideSection",
      _key: "publish",
      heading: "Drafts vs published vs the live site",
      body:
        "Studio “Published” saves to the live website dataset. Page visibility (Live / Hidden / Placeholder) controls whether the marketing site shows the real page. Publish in Studio to update www.relliahealth.com — no developer step required.",
    },
  ],
}

async function main() {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "preview"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const mutations = [
    {
      createOrReplace: {
        _id: "termsPage",
        _type: "termsPage",
        title: "Terms of Use",
        intro: TERMS_PAGE_INTRO,
        effectiveDate: TERMS_EFFECTIVE_DATE,
        body: legalSectionsToPortableText(TERMS_SECTIONS),
        seo: seoForRoute("/terms"),
      },
    },
    {
      createOrReplace: {
        _id: "privacyPage",
        _type: "privacyPage",
        title: "Privacy Policy",
        intro: PRIVACY_PAGE_INTRO,
        effectiveDate: PRIVACY_EFFECTIVE_DATE,
        legalNotice: PRIVACY_LEGAL_NOTICE,
        body: legalSectionsToPortableText(PRIVACY_SECTIONS),
        seo: seoForRoute("/privacy"),
      },
    },
    { createOrReplace: studioGuideDoc },
    {
      createOrReplace: {
        _id: "consultingPage",
        _type: "consultingPage",
        title: "Consulting",
        useModularPage: false,
        ...pagePublishingLive,
        seo: seoForRoute("/consulting"),
      },
    },
    {
      createOrReplace: {
        _id: "diagnosticLandingPage",
        _type: "diagnosticLandingPage",
        title: "Startup Diagnostic",
        useModularPage: false,
        ...pagePublishingLive,
        seo: seoForRoute("/startup-diagnostic"),
      },
    },
  ]

  // eslint-disable-next-line no-console
  console.log(`Seeding editor starters on ${projectId}/${dataset}…`)
  await client.mutate(mutations, { autoGenerateArrayKeys: true })
  // eslint-disable-next-line no-console
  console.log("Done: termsPage, privacyPage, studioGuide, consultingPage, diagnosticLandingPage")
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})
