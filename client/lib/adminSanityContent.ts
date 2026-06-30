import { studioDeskUrl } from "@shared/admin/notifyLinks"
import { publicWebsiteUrlForCmsContent } from "@shared/admin/cmsContentLinks"
import type { AdminSanityDataset } from "@shared/cms/sanityEnv"
import { fetchAdminSanityDrafts, fetchAdminSanityRecentEdits } from "@/lib/adminApi"
import { buildLastNDaysCountByDay } from "@/lib/adminOverview"
import { getSanityDataset, isSanityConfigured, sanityFetch } from "@/lib/sanity"

export type SanityContentRow = {
  _id: string
  _type: string
  title?: string
  slug?: string
  roleId?: string
  _updatedAt?: string
  status: "unpublished" | "published"
}

export type SanityRecentEditRow = {
  _id: string
  _type: string
  title?: string
  slug?: string
  roleId?: string
  _updatedAt?: string
}

/** Production dataset only — Studio and www share one CMS database. */
export const ADMIN_SANITY_PRODUCTION_DATASET: AdminSanityDataset = "production"

const DAY_MS = 24 * 60 * 60 * 1000

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const dayDiffFromToday = (iso: string): number | null => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const todayStart = startOfDay(new Date())
  const dateStart = startOfDay(date)
  return Math.round((todayStart.getTime() - dateStart.getTime()) / DAY_MS)
}

const isContentRow = (row: {
  _id?: string
  _type?: string
}): row is {
  _id: string
  _type: string
  title?: string
  slug?: string
  roleId?: string
  _updatedAt?: string
} =>
  typeof row?._id === "string" &&
  typeof row?._type === "string" &&
  !row._type.startsWith("sanity.") &&
  row._type !== "system.schema"

const mapDraftRows = (
  rows: Array<{
    _id: string
    _type: string
    title?: string
    slug?: string
    roleId?: string
    _updatedAt?: string
  }>,
): SanityContentRow[] =>
  rows.filter(isContentRow).map((row) => ({ ...row, status: "unpublished" as const }))

/** Unpublished Sanity drafts for the deployment's default dataset (legacy proxy path). */
export const fetchCmsContentQueue = async (): Promise<SanityContentRow[]> => {
  const draftRows = await sanityFetch<{ _id: string; _type: string; title?: string; _updatedAt?: string }[]>(
    "sanityDrafts",
  )
  return mapDraftRows(Array.isArray(draftRows) ? draftRows : [])
}

const mapPublishedRows = (
  rows: Array<{
    _id: string
    _type: string
    title?: string
    slug?: string
    roleId?: string
    _updatedAt?: string
  }>,
): SanityContentRow[] =>
  rows.filter(isContentRow).map((row) => ({ ...row, status: "published" as const }))

/** Unpublished drafts for a specific dataset (production or preview). Requires admin session. */
export const fetchCmsContentQueueForDataset = async (
  accessToken: string,
  dataset: AdminSanityDataset,
): Promise<SanityContentRow[]> => {
  const draftRows = await fetchAdminSanityDrafts(accessToken, dataset)
  return mapDraftRows(draftRows)
}

/** Recently published documents for a specific dataset. Requires admin session. */
export const fetchCmsPublishedQueueForDataset = async (
  accessToken: string,
  dataset: AdminSanityDataset,
): Promise<SanityContentRow[]> => {
  const publishedRows = await fetchAdminSanityRecentEdits(accessToken, dataset)
  return mapPublishedRows(publishedRows)
}

export const cmsContentQueryKey = (dataset?: AdminSanityDataset) =>
  ["admin-sanity-content-queue", dataset ?? (getSanityDataset() || "none")] as const

export const cmsPublishedQueryKey = (dataset?: AdminSanityDataset) =>
  ["admin-sanity-published-queue", dataset ?? (getSanityDataset() || "none")] as const

/** Published documents recently updated in the active Sanity dataset (public proxy). */
export const fetchCmsRecentEdits = async (): Promise<SanityRecentEditRow[]> => {
  const rows = await sanityFetch<SanityRecentEditRow[]>("sanityRecentEdits")
  return Array.isArray(rows) ? rows : []
}

/** Production recent publishes for the overview card (authenticated admin API). */
export const fetchCmsRecentEditsForOverview = async (
  accessToken: string,
): Promise<SanityRecentEditRow[]> => {
  const rows = await fetchAdminSanityRecentEdits(accessToken, ADMIN_SANITY_PRODUCTION_DATASET)
  return Array.isArray(rows) ? rows : []
}

export const cmsRecentEditsQueryKey = (dataset: AdminSanityDataset = ADMIN_SANITY_PRODUCTION_DATASET) =>
  ["admin-sanity-recent-edits", dataset] as const

/** Headline value for the overview site-content card (compact relative time). */
export const formatCmsLastPublishHeadline = (iso?: string): string => {
  if (!iso) return "—"
  const dayDiff = dayDiffFromToday(iso)
  if (dayDiff === null) return "—"
  if (dayDiff <= 0) return "Today"
  if (dayDiff === 1) return "Yesterday"
  if (dayDiff < 7) return `${dayDiff}d ago`
  if (dayDiff < 30) {
    const weeks = Math.floor(dayDiff / 7)
    return weeks === 1 ? "1w ago" : `${weeks}w ago`
  }
  const months = Math.floor(dayDiff / 30)
  return months === 1 ? "1mo ago" : `${months}mo ago`
}

export const cmsLastPublishIsStale = (iso?: string): boolean => {
  const dayDiff = iso ? dayDiffFromToday(iso) : null
  return dayDiff !== null && dayDiff > 30
}

export type CmsLastPublishSubtitle =
  | { kind: "plain"; text: string }
  | { kind: "document"; documentName: string; typeLabel: string }

export const getCmsLastPublishSubtitle = (
  row: SanityRecentEditRow | undefined,
  iso?: string,
): CmsLastPublishSubtitle => {
  if (!iso || !row) return { kind: "plain", text: "No published updates yet" }

  const typeLabel = formatCmsDocumentTypeLabel(row._type)
  const documentName = row.title?.trim() || typeLabel

  return { kind: "document", documentName, typeLabel }
}

export const cmsLastPublishSubtitleAria = (subtitle: CmsLastPublishSubtitle): string =>
  subtitle.kind === "plain" ? subtitle.text : `${subtitle.documentName}, ${subtitle.typeLabel}`

/** Calendar-day publish counts (oldest → today); pre-window history rolls into the first bucket. */
export const buildCmsEditsSparkline = (
  rows: SanityRecentEditRow[],
  bucketCount = 7,
): number[] => {
  const timestamps = rows
    .map((row) => row._updatedAt)
    .filter((value): value is string => Boolean(value))

  const daily = buildLastNDaysCountByDay(timestamps, bucketCount)
  if (timestamps.length === 0) return daily

  const windowStart = new Date(startOfDay(new Date()).getTime() - (bucketCount - 1) * DAY_MS)
  let olderCount = 0

  for (const iso of timestamps) {
    const dayStart = startOfDay(new Date(iso))
    if (dayStart.getTime() < windowStart.getTime()) olderCount += 1
  }

  if (olderCount === 0) return daily

  return daily.map((count, index) => (index === 0 ? count + olderCount : count))
}

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

export const publicWebsiteUrlForRow = (row: SanityContentRow): string | null =>
  row.status === "published" ? publicWebsiteUrlForCmsContent(row) : null

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
