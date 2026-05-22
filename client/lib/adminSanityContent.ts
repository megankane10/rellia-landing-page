import { getSanityDataset, isSanityConfigured, sanityFetch } from "@/lib/sanity"

export type SanityContentRow = {
  _id: string
  _type: string
  title?: string
  _updatedAt?: string
  status: "unpublished" | "published"
}

const isContentRow = (row: {
  _id?: string
  _type?: string
}): row is { _id: string; _type: string; title?: string; _updatedAt?: string } =>
  typeof row?._id === "string" &&
  typeof row?._type === "string" &&
  !row._type.startsWith("sanity.") &&
  row._type !== "system.schema"

export const fetchCmsContentQueue = async (): Promise<SanityContentRow[]> => {
  const [draftRows, recentRows] = await Promise.all([
    sanityFetch<{ _id: string; _type: string; title?: string; _updatedAt?: string }[]>("sanityDrafts"),
    sanityFetch<{ _id: string; _type: string; title?: string; _updatedAt?: string }[]>("sanityRecentEdits"),
  ])

  const drafts = (Array.isArray(draftRows) ? draftRows : [])
    .filter(isContentRow)
    .map((row) => ({ ...row, status: "unpublished" as const }))

  const draftBaseIds = new Set(drafts.map((d) => d._id.replace(/^drafts\./, "")))

  const published = (Array.isArray(recentRows) ? recentRows : [])
    .filter(isContentRow)
    .filter((row) => !draftBaseIds.has(row._id))
    .map((row) => ({ ...row, status: "published" as const }))

  return [...drafts, ...published]
}

export const cmsContentQueryKey = () => ["admin-sanity-content-queue", getSanityDataset() || "none"] as const

export const formatCmsContentRelative = (iso?: string) => {
  if (!iso) return "Recently"
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 48) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const studioUrlForRow = (row: SanityContentRow) => {
  const STUDIO_BASE = "https://relliahealth.sanity.studio/desk"
  const STUDIO_HOME = "https://relliahealth.sanity.studio"
  const rawId = typeof row._id === "string" ? row._id : ""
  const docId = rawId.replace(/^drafts\./, "")
  if (!docId || !row._type) return STUDIO_HOME
  return `${STUDIO_BASE}/${row._type};${docId}`
}

export const isCmsContentEnabled = () => isSanityConfigured()

/** Human-readable Sanity `_type` labels for admin content queue sections. */
export const CMS_DOCUMENT_TYPE_LABELS: Record<string, string> = {
  advisor: "Advisor",
  advisorFilter: "Advisor filter tag",
  alumniCompany: "Alumni company",
  directoryFilterGroup: "Directory filter group",
  event: "Event",
  founder: "Founder",
  founderLevel: "Founder level",
  founderSpecialty: "Founder specialty",
  globalSettings: "Global settings",
  homePage: "Home page",
  investor: "Investor",
  navigation: "Navigation",
  page: "Modular page",
  program: "Program",
  siteSettings: "Site settings",
  story: "Story",
  storyFilter: "Story category",
}

export const formatCmsDocumentTypeLabel = (type: string): string => {
  if (CMS_DOCUMENT_TYPE_LABELS[type]) return CMS_DOCUMENT_TYPE_LABELS[type]
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}
