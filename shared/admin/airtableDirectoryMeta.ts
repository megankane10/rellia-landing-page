export type AirtableDirectoryKind = "founder" | "advisor"

export type AirtableFieldSyncStatus = "mapped" | "pending_field" | "cms_only" | "unmapped"

export type AirtableFieldDefinition = {
  airtableField: string
  airtableType: string
  sanityTarget?: string
  syncStatus: AirtableFieldSyncStatus
  notes?: string
}

export const AIRTABLE_BASE_ID = "appH95p8u6zW5L0RJ"

export const AIRTABLE_TABLE_IDS = {
  founders: "tblDEwv5xP22nRXRo",
  advisors: "tblzFdeh8HsvIgqsr",
  networkMembers: "tblmnSpZ9b4z1BnSl",
} as const

export const WEBSITE_STATUS_FIELD = "Website status"

/** Read-only registry — documents how Airtable columns map to Sanity (no Airtable writes). */
export const AIRTABLE_FOUNDER_FIELD_REGISTRY: AirtableFieldDefinition[] = [
  { airtableField: "Company Name", airtableType: "singleLineText", sanityTarget: "alumniCompany.name", syncStatus: "mapped" },
  { airtableField: "Company 1-Liner", airtableType: "singleLineText", sanityTarget: "alumniCompany.tagline + shortDescription", syncStatus: "mapped" },
  { airtableField: "Company Bio", airtableType: "multilineText", sanityTarget: "alumniCompany.profileBody (block)", syncStatus: "mapped" },
  { airtableField: "CTA", airtableType: "singleLineText", sanityTarget: "profileBody.bodyCtaBox.title", syncStatus: "mapped" },
  { airtableField: "CTA Link", airtableType: "url", sanityTarget: "profileBody.bodyCtaBox.buttonHref", syncStatus: "mapped" },
  { airtableField: "Website", airtableType: "url", sanityTarget: "socialLinks (website)", syncStatus: "mapped" },
  { airtableField: "Company LinkedIn", airtableType: "url", sanityTarget: "socialLinks (linkedin)", syncStatus: "mapped" },
  { airtableField: "Company Email", airtableType: "email", sanityTarget: "alumniCompany.email", syncStatus: "mapped" },
  { airtableField: "Company Logo", airtableType: "multipleAttachments", sanityTarget: "alumniCompany.logo", syncStatus: "mapped" },
  { airtableField: "Founder(s)", airtableType: "singleLineText", sanityTarget: "founders[].name", syncStatus: "mapped" },
  { airtableField: "Job Title", airtableType: "singleLineText", sanityTarget: "founders[].role", syncStatus: "mapped" },
  { airtableField: "Founder Headshots", airtableType: "multipleAttachments", sanityTarget: "founders[].image", syncStatus: "mapped" },
  { airtableField: "Founder description", airtableType: "multilineText", sanityTarget: "founders[].bio", syncStatus: "mapped", notes: "Leave blank on site when empty." },
  { airtableField: "Expertise", airtableType: "multilineText", sanityTarget: "directoryFilters (expertise) — tag parse only", syncStatus: "mapped", notes: "Comma-separated topics; not used as founder bio." },
  { airtableField: "Business Model", airtableType: "multipleSelects", sanityTarget: "directoryFilters (business-model) + card tags", syncStatus: "mapped" },
  { airtableField: "Clinical Specialty", airtableType: "multipleSelects", sanityTarget: "directoryFilters (specialty) + primary card tag", syncStatus: "mapped" },
  { airtableField: "Tech Category", airtableType: "multipleSelects", syncStatus: "unmapped", notes: "No Sanity filter group yet — pending client decision (card tag vs new filter group)." },
  { airtableField: "Country", airtableType: "multipleSelects", sanityTarget: "directoryFilters (country)", syncStatus: "mapped" },
  { airtableField: "City", airtableType: "singleLineText", sanityTarget: "—", syncStatus: "unmapped", notes: "Optional sidebar metadata later." },
  { airtableField: "Date Joined", airtableType: "date", sanityTarget: "alumniCompany.yearJoined", syncStatus: "mapped" },
  {
    airtableField: WEBSITE_STATUS_FIELD,
    airtableType: "singleSelect",
    sanityTarget: "sync gate (draft only)",
    syncStatus: "mapped",
    notes: "Not requested → Ready for review → Published on site.",
  },
  {
    airtableField: "Sanity document ID",
    airtableType: "singleLineText",
    sanityTarget: "stable link back to CMS",
    syncStatus: "mapped",
    notes: "Written by sync worker after first import.",
  },
]

export const AIRTABLE_ADVISOR_FIELD_REGISTRY: AirtableFieldDefinition[] = [
  { airtableField: "Name", airtableType: "singleLineText", sanityTarget: "advisor.name + slug", syncStatus: "mapped" },
  { airtableField: "Job Title", airtableType: "singleLineText", sanityTarget: "advisor.role", syncStatus: "mapped" },
  { airtableField: "Company", airtableType: "singleLineText", sanityTarget: "advisor.organization", syncStatus: "mapped" },
  { airtableField: "Short Bio", airtableType: "multilineText", sanityTarget: "advisor.snapshot OR advisor.industries (when comma-separated tags)", syncStatus: "mapped", notes: "Many rows use Short Bio as topic tags — not narrative copy." },
  { airtableField: "Long Bio", airtableType: "multilineText", sanityTarget: "advisor.bio (portable text)", syncStatus: "mapped" },
  { airtableField: "Headshot", airtableType: "multipleAttachments", sanityTarget: "advisor.photo", syncStatus: "mapped" },
  { airtableField: "Industry Tags", airtableType: "multipleSelects", sanityTarget: "advisor.industries + secondary card tags", syncStatus: "mapped" },
  { airtableField: "Expertise Tags", airtableType: "multipleSelects", sanityTarget: "directoryFilters (expertise) + primary card tag", syncStatus: "mapped" },
  { airtableField: "Country", airtableType: "multipleSelects", sanityTarget: "directoryFilters (country)", syncStatus: "mapped" },
  { airtableField: "City", airtableType: "singleLineText", sanityTarget: "—", syncStatus: "unmapped" },
  { airtableField: "Email", airtableType: "singleLineText", sanityTarget: "advisor.email + socialLinks", syncStatus: "mapped" },
  { airtableField: "LinkedIn", airtableType: "url", sanityTarget: "socialLinks (linkedin)", syncStatus: "mapped" },
  { airtableField: "Company URL", airtableType: "url", sanityTarget: "socialLinks (website)", syncStatus: "mapped" },
  { airtableField: "Calendly Link", airtableType: "url", sanityTarget: "socialLinks (custom)", syncStatus: "mapped" },
  {
    airtableField: WEBSITE_STATUS_FIELD,
    airtableType: "singleSelect",
    sanityTarget: "sync gate (draft only)",
    syncStatus: "mapped",
    notes: "Same workflow as founders table.",
  },
  {
    airtableField: "Sanity document ID",
    airtableType: "singleLineText",
    sanityTarget: "stable CMS link",
    syncStatus: "mapped",
  },
]

export type AirtableDirectoryRowStatus = "not_on_site" | "draft" | "published"

export type AirtableDirectoryFieldCoverage = {
  airtableField: string
  filled: boolean
  mappedToSanity?: string
  syncStatus: AirtableFieldSyncStatus
  liveOnSite: boolean
}

export type AirtableDirectoryQueueRow = {
  airtableRecordId: string
  kind: AirtableDirectoryKind
  displayName: string
  organization?: string
  slugCandidate: string
  imageUrl?: string | null
  siteStatus: AirtableDirectoryRowStatus
  sanityDocumentId?: string
  sanityStudioUrl?: string
  publicUrl?: string
  fieldCoverage: AirtableDirectoryFieldCoverage[]
  missingForPublish: string[]
  updatedAt?: string
  airtableRecordUrl?: string
}

export type AirtableProfilePreviewSection = {
  id: string
  title: string
  complete: boolean
  message: string
  previewText?: string
  previewImageUrl?: string
  tags?: string[]
}

export type AirtableDirectoryDetail = AirtableDirectoryQueueRow & {
  websiteStatus: string | null
  previewSections: AirtableProfilePreviewSection[]
}

export type AirtableDirectoryQueuePayload = {
  founders: AirtableDirectoryQueueRow[]
  advisors: AirtableDirectoryQueueRow[]
  fieldRegistries: {
    founders: AirtableFieldDefinition[]
    advisors: AirtableFieldDefinition[]
  }
}

export const slugifyDirectoryName = (input: string): string =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "profile"
