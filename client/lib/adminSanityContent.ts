import { studioDeskUrl } from "@shared/admin/notifyLinks"
import type { AdminSanityDataset } from "@shared/cms/sanityEnv"
import { fetchAdminSanityDrafts } from "@/lib/adminApi"
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

const mapDraftRows = (
  rows: Array<{ _id: string; _type: string; title?: string; _updatedAt?: string }>,
): SanityContentRow[] =>
  rows.filter(isContentRow).map((row) => ({ ...row, status: "unpublished" as const }))

/** Unpublished Sanity drafts for the deployment's default dataset (legacy proxy path). */
export const fetchCmsContentQueue = async (): Promise<SanityContentRow[]> => {
  const draftRows = await sanityFetch<{ _id: string; _type: string; title?: string; _updatedAt?: string }[]>(
    "sanityDrafts",
  )
  return mapDraftRows(Array.isArray(draftRows) ? draftRows : [])
}

/** Unpublished drafts for a specific dataset (production or preview). Requires admin session. */
export const fetchCmsContentQueueForDataset = async (
  accessToken: string,
  dataset: AdminSanityDataset,
): Promise<SanityContentRow[]> => {
  const draftRows = await fetchAdminSanityDrafts(accessToken, dataset)
  return mapDraftRows(draftRows)
}

export const cmsContentQueryKey = (dataset?: AdminSanityDataset) =>
  ["admin-sanity-content-queue", dataset ?? (getSanityDataset() || "none")] as const

export const formatCmsContentRelative = (iso?: string) => {
  if (!iso) return "Recently"
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const studioUrlForRow = (row: SanityContentRow) => studioDeskUrl(row._type, row._id)

export const isCmsContentEnabled = () => isSanityConfigured()

/** Human-readable Sanity `_type` labels for admin content queue sections. */
export const CMS_DOCUMENT_TYPE_LABELS: Record<string, string> = {
  advisor: "Advisor",
  alumniCompany: "Alumni company",
  directoryFilterGroup: "Directory filter group",
  event: "Event",
  founder: "Founder",
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

/** Production dataset only — Studio and www share one CMS database. */
export const ADMIN_SANITY_PRODUCTION_DATASET: AdminSanityDataset = "production"
