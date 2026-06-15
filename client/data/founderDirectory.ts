import type { SanityPortableText } from "@shared/cms/types"
import type { DirectoryFilterAssignment } from "@/lib/directoryFilterValues"
import { POWER_OF_PLAY_PROFILE_BODY } from "../../shared/cms/powerOfPlayProfileBody"

export type FounderPerson = {
  name: string
  role?: string
  bio?: string
  socialLinks?: Array<{ platform?: string; label?: string; url?: string }>
  imageSrc?: string
  email?: string
}

export type FounderCompany = {
  id: string
  slug: string
  logoName: string
  logoSrc: string
  tagline: string
  countries: string[]
  specialtyTags: string[]
  businessModels: string[]
  directoryFilters?: DirectoryFilterAssignment[]
  shortDescription: string
  longDescription: string
  traction: string
  relliaCollaboration: string
  imageSrc: string
  location?: string
  yearJoined: number
  founders: FounderPerson[]
  programs: string[]
  socialLinks?: Array<{ platform?: string; label?: string; url?: string }>
  email?: string
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
    countries: ["Canada"],
    specialtyTags: ["Pediatrics"],
    businessModels: ["B2B", "B2B2C", "Hardware"],
    directoryFilters: [
      { groupId: "country", groupTitle: "Country", values: ["Canada"] },
      { groupId: "specialty", groupTitle: "Specialty", values: ["Pediatrics"] },
      {
        groupId: "business-model",
        groupTitle: "Business Model",
        values: ["B2B", "B2B2C", "Hardware"],
      },
    ],
    shortDescription: "Taking a Play-Based Approach To Pediatric Rehabilitation",
    longDescription:
      "Power of Play builds play-based strength measurement tools for pediatric rehabilitation—helping clinicians track progress without turning therapy into a chore.",
    traction:
      "Clinical validation and pilot programs with pediatric rehab partners; product engineering focused on home-use ergonomics and measurable outcomes.",
    relliaCollaboration:
      "Rellia membership supports warm operator intros, advisor deep-dives on clinical validation, and program cadence aligned to study and regulatory timelines.",
    imageSrc: "/images/founders.jpg",
    yearJoined: 2024,
    email: "info@powerofplayinc.com",
    socialLinks: [
      { platform: "website", label: "Website", url: "https://powerofplayinc.com" },
      { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/power-of-play-pop/" },
    ],
    founders: [
      {
        name: "Deena Al-Sammak",
        role: "Health Sciences Graduate",
        socialLinks: [
          { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/deena-al-sammak/" },
        ],
        imageSrc: "/images/deenasammak-team.png",
      },
      {
        name: "Rooaa Shanshal",
        role: "Software & Biomedical Engineer",
        socialLinks: [
          { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/rooaashanshal/" },
        ],
        imageSrc: "/images/testimonials-rooaaS.jpeg",
      },
    ],
    programs: [],
    profileBody: POWER_OF_PLAY_PROFILE_BODY,
  },
]

export const getFounderPrimaryTag = (company: Pick<FounderCompany, "specialtyTags">): string | undefined =>
  company.specialtyTags?.[0]?.trim() || undefined
