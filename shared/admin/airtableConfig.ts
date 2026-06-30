import { AIRTABLE_BASE_ID, AIRTABLE_TABLE_IDS, WEBSITE_STATUS_FIELD } from "./airtableDirectoryMeta"

export { WEBSITE_STATUS_FIELD }

export const resolveAirtableBaseId = (): string =>
  (typeof process !== "undefined" ? process.env.AIRTABLE_BASE_ID?.trim() : "") ||
  AIRTABLE_BASE_ID

export const resolveAirtableTableId = (kind: "founders" | "advisors"): string => {
  if (kind === "founders") {
    return (
      (typeof process !== "undefined" ? process.env.AIRTABLE_FOUNDERS_TABLE_ID?.trim() : "") ||
      AIRTABLE_TABLE_IDS.founders
    )
  }
  return (
    (typeof process !== "undefined" ? process.env.AIRTABLE_ADVISORS_TABLE_ID?.trim() : "") ||
    AIRTABLE_TABLE_IDS.advisors
  )
}

export const airtableRecordUrl = (
  recordId: string,
  kind: "founders" | "advisors",
  baseId = resolveAirtableBaseId(),
): string => {
  const tableId = resolveAirtableTableId(kind)
  return `https://airtable.com/${baseId}/${tableId}/${recordId}`
}

export const publicAlumniProfilePath = (slug: string) => `/founders/alumni/${slug}`

export const publicAdvisorProfilePath = (slug: string) => `/advisors/directory/${slug}`

export const WEBSITE_STATUS_VALUES = {
  notRequested: "Not requested",
  readyForReview: "Ready for review",
  publishedOnSite: "Published on site",
  needsUpdate: "Needs update",
} as const
