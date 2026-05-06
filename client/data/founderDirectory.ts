import { PORTFOLIO_LOGO_MARKS } from "./portfolioLogos"

export type StageTag = "Idea" | "Pre-seed" | "Seed" | "Series A"

export type FounderCategory =
  | "Digital health"
  | "Diagnostics & labs"
  | "Med device"
  | "Care delivery"
  | "Analytics & employer"

export type FounderCompany = {
  id: string
  slug: string
  logoName: string
  logoSrc: string
  tagline: string
  stages: StageTag[]
  category: FounderCategory
  shortDescription: string
  longDescription: string
  websiteUrl: string
  traction: string
  relliaCollaboration: string
  imageSrc: string
}

const STAGES_CYCLE: StageTag[] = ["Pre-seed", "Seed", "Seed", "Series A", "Pre-seed", "Idea"]

const CATEGORY_CYCLE: FounderCategory[] = [
  "Digital health",
  "Diagnostics & labs",
  "Med device",
  "Care delivery",
  "Analytics & employer",
]

export const slugFromName = (name: string) => {
  const s = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 32)
  return s || "company"
}

export const FOUNDER_DIRECTORY: FounderCompany[] = PORTFOLIO_LOGO_MARKS.slice(0, 12).map((logo, index) => {
  const summaries = [
    "Clinical workflow tooling with early hospital pilots and a focused UX research lane.",
    "Diagnostics-adjacent platform prioritizing interoperability and lab partnerships.",
    "Digital therapeutic pathways with clinician-in-the-loop protocols.",
    "Care navigation layer integrating payer-friendly utilization narratives.",
    "Device-enabled rehab telemetry with home-use ergonomics as the wedge.",
    "Population analytics prototype translating claims feeds into operational KPIs.",
    "Pharmacovigilance workflow automation for emerging therapeutic portfolios.",
    "Remote monitoring stack emphasizing alert fatigue reduction across nursing stations.",
    "Surgical coordination SaaS aligned to OR block-time realities and vendor neutrality.",
    "Patient engagement micro-apps anchored on culturally competent education journeys.",
    "Employer-facing benefits analytics tying biometric pilots to absenteeism deltas.",
    "Credentialing automation prototype shortening onboarding without sacrificing audit trails.",
  ]
  const base = summaries[index % summaries.length]
  const slug = slugFromName(logo.name)
  return {
    id: slug,
    slug: slug,
    logoName: logo.name,
    logoSrc: logo.src,
    tagline: base.split(" ").slice(0, 4).join(" ") + "…",
    stages: [STAGES_CYCLE[index % STAGES_CYCLE.length]],
    category: CATEGORY_CYCLE[index % CATEGORY_CYCLE.length],
    shortDescription: base,
    longDescription: `${base} The team structures pilots with clear clinical owners, success criteria, and a defensible data plan for the next financing conversation.`,
    websiteUrl: `https://www.${slug}.example`,
    traction: `Active pilots with health system and specialty partners; expanding integration surface area and outcome readouts in line with ${CATEGORY_CYCLE[index % CATEGORY_CYCLE.length].toLowerCase()} buyer expectations. Roadmap tied to evidence milestones, not vanity releases.`,
    relliaCollaboration: `Rellia membership is used for warm operator intros, advisor deep-dives on protocol and procurement, and program cadence that matches regulatory and study timelines—so the company isn’t building in a silo while the market moves.`,
    imageSrc: [
      "https://images.unsplash.com/photo-1556157382-9764a702e8b5?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e548d5d17?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071823991-b1ae5e6a30c8?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80&auto=format&fit=crop"
    ][index % 6],
  }
})
