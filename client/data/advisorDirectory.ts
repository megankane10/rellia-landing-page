export type AdvisorDirectoryFilter = "Clinical" | "Regulatory" | "GTM" | "Technical"

/** Professional headshots (Unsplash) — illustrative directory placeholders */
const P = {
  p1: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop",
  p2: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&auto=format&fit=crop",
  p3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80&auto=format&fit=crop",
  p4: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&auto=format&fit=crop",
  p5: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80&auto=format&fit=crop",
  p6: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
  p7: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&auto=format&fit=crop",
  p8: "https://images.unsplash.com/photo-1519345182560-a3d909bfe71b?w=800&q=80&auto=format&fit=crop",
} as const

export type AdvisorDirectoryEntry = {
  id: string
  name: string
  organization: string
  role: string
  location: string
  country: string
  yearJoined: string
  industries: string[]
  /** Short card summary */
  focus: string
  filter: AdvisorDirectoryFilter
  /** Portrait photo for cards and profile */
  photoSrc: string
  linkedInUrl: string
  /** Personal or org site */
  websiteUrl?: string
  /** Rich modal copy */
  bio: string
  mentoringStyle: string
  highlights: string[]
}

export const ADVISOR_DIRECTORY_SEED: AdvisorDirectoryEntry[] = []


export const ADVISOR_FILTER_OPTIONS: Array<{ id: "all" | AdvisorDirectoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "Clinical", label: "Clinical" },
  { id: "Regulatory", label: "Regulatory" },
  { id: "GTM", label: "GTM" },
  { id: "Technical", label: "Technical" },
]
