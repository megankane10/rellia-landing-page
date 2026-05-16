import { PORTFOLIO_LOGO_MARKS } from "./portfolioLogos"

export type Specialty = "Women’s Health" | "Neurology" | "Cardiology" | "Oncology" | "Mental Health" | "Pediatrics"
export const ALL_SPECIALTIES: Specialty[] = ["Women’s Health", "Neurology", "Cardiology", "Oncology", "Mental Health", "Pediatrics"]

export type FounderLevel = "Pre-seed" | "Seed" | "Series A" | "Series B" | "Series C+"
export const ALL_LEVELS: FounderLevel[] = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"]

export type FounderPerson = {
  name: string
  role: string
  bio: string
  linkedinUrl?: string
  imageSrc?: string
}

export type FounderCompany = {
  id: string
  slug: string
  logoName: string
  logoSrc: string
  tagline: string
  specialties: Specialty[]
  level: FounderLevel
  shortDescription: string
  longDescription: string
  websiteUrl: string
  traction: string
  relliaCollaboration: string
  imageSrc: string
  country: string
  yearJoined: number
  founders: FounderPerson[]
  programs: string[]
  linkedinUrl?: string
}

const SPECIALTY_CYCLE: Specialty[] = ["Women’s Health", "Neurology", "Cardiology", "Oncology", "Mental Health", "Pediatrics"]

const LEVEL_CYCLE: FounderLevel[] = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"]

export const FOUNDER_DIRECTORY: FounderCompany[] = []

