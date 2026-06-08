import type { SanityPortableText } from "@shared/cms/types"

export type Specialty = "Women’s Health" | "Neurology" | "Cardiology" | "Oncology" | "Mental Health" | "Pediatrics"
export const ALL_SPECIALTIES: Specialty[] = ["Women’s Health", "Neurology", "Cardiology", "Oncology", "Mental Health", "Pediatrics"]

export type FounderLevel = "Pre-seed" | "Seed" | "Series A" | "Series B" | "Series C+"
export const ALL_LEVELS: FounderLevel[] = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"]

export type FounderPerson = {
  name: string
  role: string
  bio: string
  linkedinUrl?: string
  websiteUrl?: string
  socialLinks?: Array<{ platform?: string; label?: string; url?: string }>
  imageSrc?: string
}

export type FounderCompany = {
  id: string
  slug: string
  logoName: string
  logoSrc: string
  tagline: string
  specialties: Specialty[]
  level?: FounderLevel
  businessModel: string[]
  directoryFilters?: Array<{ groupId?: string; values?: string[]; groupTitle?: string }>
  shortDescription: string
  longDescription: string
  websiteUrl: string
  traction: string
  relliaCollaboration: string
  imageSrc: string
  location?: string
  country: string[]
  yearJoined: number
  founders: FounderPerson[]
  programs: string[]
  linkedinUrl?: string
  profileBody?: SanityPortableText
}

export const slugFromName = (name: string) => {
  const s = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 32)
  return s || "company"
}

/** Preview/dev fallback when Sanity has no alumni — production uses CMS only. */
export const FOUNDER_DIRECTORY: FounderCompany[] = [
  {
    id: "power-of-play",
    slug: "power-of-play",
    logoName: "Power of Play",
    logoSrc: "/images/portfolio-pop.png",
    tagline: "Taking a Play-Based Approach To Pediatric Rehabilitation",
    specialties: ["Pediatrics"],
    businessModel: ["B2B", "B2B2C", "Hardware"],
    shortDescription: "Taking a Play-Based Approach To Pediatric Rehabilitation",
    longDescription:
      "Power of Play builds play-based strength measurement tools for pediatric rehabilitation—helping clinicians track progress without turning therapy into a chore.",
    websiteUrl: "https://powerofplayinc.com",
    traction:
      "Clinical validation and pilot programs with pediatric rehab partners; product engineering focused on home-use ergonomics and measurable outcomes.",
    relliaCollaboration:
      "Rellia membership supports warm operator intros, advisor deep-dives on clinical validation, and program cadence aligned to study and regulatory timelines.",
    imageSrc: "/images/founders.jpg",
    country: ["Canada"],
    yearJoined: 2024,
    founders: [
      {
        name: "Deena Al-Sammak",
        role: "Health Sciences Graduate",
        bio: "Co-founder focused on clinical validation and program development for pediatric rehab tooling.",
        linkedinUrl: "https://www.linkedin.com/in/deena-al-sammak/",
        imageSrc: "/images/deenasammak-team.png",
      },
      {
        name: "Rooaa Shanshal",
        role: "Software & Biomedical Engineer",
        bio: "Co-founder leading product engineering for play-based strength measurement.",
        linkedinUrl: "https://www.linkedin.com/in/rooaashanshal/",
        imageSrc: "/images/testimonials-rooaaS.jpeg",
      },
    ],
    programs: [],
    linkedinUrl: "https://www.linkedin.com/company/power-of-play-pop/",
  },
]
