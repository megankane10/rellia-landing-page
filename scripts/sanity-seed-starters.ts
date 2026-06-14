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
        "Studio “Published” saves to the production dataset that powers www.relliahealth.com. Page visibility (Live / Hidden / Placeholder) controls whether the marketing site shows the real page. Publish in Studio to update the live site — no developer deploy step.",
    },
    {
      _type: "guideSection",
      _key: "presentation",
      heading: "Visual editing (Presentation)",
      body:
        "Open Presentation in Studio to preview drafts on www inside the Studio panel only. Set SANITY_STUDIO_PREVIEW_URL=https://www.relliahealth.com. Unpublished work never appears to public visitors browsing www directly.",
    },
    {
      _type: "guideSection",
      _key: "admin_drafts",
      heading: "Admin dashboard — Sanity drafts",
      body:
        "Admin → Sanity drafts lists unpublished documents in the production dataset. Open Studio from that page to review and publish. The overview home card shows the same draft count.",
    },
    {
      _type: "guideSection",
      _key: "create_pages",
      heading: "1. Creating a New Custom Page",
      body:
        "To build a brand new page on your website, navigate to the Pages menu in the Studio sidebar and click the '+' icon to create a new page document. Give it a title and a unique URL slug (e.g. /partner-program). Note: Slug names that conflict with pre-built routes (like about, careers, or contact) are reserved and will be blocked by the system to prevent overriding static layouts.",
    },
    {
      _type: "guideSection",
      _key: "page_sections",
      heading: "2. Composing with Page Sections (Blocks)",
      body:
        "Custom pages are composed entirely of modular blocks added to the Page sections list. You can add, reorder, or remove sections as needed:\n\n• Marketing Hero & Section Hero: Standard banner designs with large headings, support text, background images, and action buttons (CTAs).\n• Section Rich Text: Standard editor for text articles, headings, bullet lists, and basic styled paragraphs.\n• Cards Grid: A grid layout displaying images/icons, badges, descriptions, tags, and individual action buttons.\n• Eligibility Bento: A stylized layout showcasing structured criteria cards with graphic backgrounds.\n• Journey Timeline: Side-by-side timelines mapping comparisons or steps.\n• FAQ Section: Collapsible question-and-answer accordion cards.\n• Form Embed: Standalone or split layouts displaying registration forms.",
    },
    {
      _type: "guideSection",
      _key: "luma_forms",
      heading: "3. Embedding Luma Forms",
      body:
        "You can embed interactive Luma event signup forms in two ways:\n\n• On Event Detail Pages: Inside any Event document, copy the stable Luma ID (e.g. evt-xxxxxx) and paste it into the Luma Event ID field. Toggle on the Embed Luma on Detail Page option to automatically insert the registration widget.\n• On Modular Pages: Add a Form embed section block to your page. Input the full Luma event URL (e.g. https://lu.ma/event/evt-xxxxxx) into the form link field to display it as an inline registration page.",
    },
    {
      _type: "guideSection",
      _key: "program_pricing",
      heading: "4. Program Pricing Sections",
      body:
        "When creating or updating Program documents, you can customize program pricing modules without code. Navigate to the Detail page tab group on the program schema:\n\n• Fill in the Price (sale) field (e.g. $1,500) and sub-amount details.\n• Toggle on Show strikethrough compare price and enter a compare amount to highlight a discount (e.g., compare price $2,000).\n• Add descriptive bullet items to the pricing details list to summarize what is included in the program purchase.",
    },
    {
      _type: "guideSection",
      _key: "diagnostic_matches",
      heading: "5. Startup diagnostic — program & advisor matches",
      body:
        "After a founder completes the startup diagnostic survey, the report shows program matches and advisor matches automatically — you do not assign these by hand in Studio.\n\nProgram matches: the report reads the founder’s three lowest-scoring survey areas and maps each area to a recommended Rellia program (for example, regulatory gaps → Regulatory Roadmap). That mapping lives in the website code.\n\nAdvisor matches: the report compares those weak areas to advisor profiles under People → Advisors. Advisors whose focus or industries align are suggested (up to three names).\n\nWhat you can edit: survey intro and report headings in Diagnostic Survey Page; advisor names, focus areas, and bios in People → Advisors; program titles, descriptions, and URLs in Collections → Programs.\n\nWhat needs engineering: scoring weights, the domain-to-program mapping, and matching rules.",
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

   
  console.log(`Seeding editor starters on ${projectId}/${dataset}…`)
  await client.mutate(mutations, { autoGenerateArrayKeys: true })
   
  console.log("Done: termsPage, privacyPage, studioGuide, consultingPage, diagnosticLandingPage")
}

main().catch((err) => {
   
  console.error(err)
  process.exitCode = 1
})
