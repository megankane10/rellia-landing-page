import { createClient } from "@sanity/client"
import {
  AIRTABLE_ADVISOR_FIELD_REGISTRY,
  AIRTABLE_FOUNDER_FIELD_REGISTRY,
  slugifyDirectoryName,
  WEBSITE_STATUS_FIELD,
  type AirtableDirectoryFieldCoverage,
  type AirtableDirectoryKind,
  type AirtableDirectoryQueueRow,
  type AirtableDirectoryRowStatus,
  type AirtableFieldDefinition,
} from "../shared/admin/airtableDirectoryMeta"
import {
  airtableRecordUrl,
  publicAdvisorProfilePath,
  publicAlumniProfilePath,
  resolveAirtableBaseId,
  resolveAirtableTableId,
} from "../shared/admin/airtableConfig"

type AirtableRecord = {
  id: string
  createdTime?: string
  fields: Record<string, unknown>
}

type SanityProfileIndex = {
  bySlug: Map<string, { id: string; status: "draft" | "published" }>
  byAirtableId: Map<string, { id: string; status: "draft" | "published" }>
}

const COUNTRY_ALIASES: Record<string, string> = {
  usa: "US",
  "united states": "US",
  uk: "United Kingdom",
  ca: "Canada",
}

const normalizeCountry = (value: string): string => {
  const trimmed = value.trim()
  const key = trimmed.toLowerCase()
  return COUNTRY_ALIASES[key] ?? trimmed
}

const isFilled = (value: unknown): boolean => {
  if (value == null) return false
  if (typeof value === "string") return Boolean(value.trim())
  if (Array.isArray(value)) return value.length > 0
  return true
}

const firstAttachmentUrl = (value: unknown): string | null => {
  if (!Array.isArray(value) || value.length === 0) return null
  const first = value[0] as { url?: string }
  return typeof first?.url === "string" && first.url.trim() ? first.url.trim() : null
}

const fetchAirtableTable = async (tableId: string, apiKey: string): Promise<AirtableRecord[]> => {
  const baseId = resolveAirtableBaseId()
  const records: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`)
    url.searchParams.set("pageSize", "100")
    if (offset) url.searchParams.set("offset", offset)

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!response.ok) {
      const body = await response.text().catch(() => "")
      throw new Error(`Airtable fetch failed (${response.status}): ${body.slice(0, 200)}`)
    }

    const data = (await response.json()) as { records?: AirtableRecord[]; offset?: string }
    records.push(...(data.records ?? []))
    offset = data.offset
  } while (offset)

  return records
}

const buildFieldCoverage = (
  registry: AirtableFieldDefinition[],
  fields: Record<string, unknown>,
  siteStatus: AirtableDirectoryRowStatus,
): AirtableDirectoryFieldCoverage[] =>
  registry.map((def) => {
    const filled = def.syncStatus === "pending_field" ? false : isFilled(fields[def.airtableField])
    const liveOnSite =
      siteStatus === "published" &&
      def.syncStatus === "mapped" &&
      filled &&
      def.airtableField !== "Website status" &&
      def.airtableField !== "Sanity document ID"

    return {
      airtableField: def.airtableField,
      filled: def.syncStatus === "pending_field" ? false : filled,
      mappedToSanity: def.sanityTarget,
      syncStatus: def.syncStatus,
      liveOnSite,
    }
  })

const missingForPublish = (coverage: AirtableDirectoryFieldCoverage[], kind: AirtableDirectoryKind): string[] => {
  const required =
    kind === "founder"
      ? ["Company Name", "Company 1-Liner", "Company Bio", "Founder(s)", "Company Logo"]
      : ["Name", "Short Bio", "Headshot", "Expertise Tags", "Country"]

  return required.filter((field) => {
    const row = coverage.find((c) => c.airtableField === field)
    return !row?.filled
  })
}

const resolveSiteStatus = (
  slug: string,
  index: SanityProfileIndex,
): { status: AirtableDirectoryRowStatus; sanityDocumentId?: string } => {
  const hit = index.bySlug.get(slug)
  if (!hit) return { status: "not_on_site" }
  return {
    status: hit.status === "published" ? "published" : "draft",
    sanityDocumentId: hit.id,
  }
}

const buildSanityProfileIndex = async (options: {
  projectId: string
  dataset: string
  token?: string
}): Promise<SanityProfileIndex> => {
  const client = createClient({
    projectId: options.projectId,
    dataset: options.dataset,
    token: options.token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const rows = await client.fetch<{
    alumni: Array<{ _id: string; slug?: string; airtableRecordId?: string }>
    advisors: Array<{ _id: string; slug?: string; airtableRecordId?: string }>
  }>(`{
    "alumni": *[_type == "alumniCompany"]{ _id, "slug": slug.current, airtableRecordId },
    "advisors": *[_type == "advisor"]{ _id, "slug": slug.current, airtableRecordId }
  }`)

  const bySlug = new Map<string, { id: string; status: "draft" | "published" }>()
  const byAirtableId = new Map<string, { id: string; status: "draft" | "published" }>()

  const ingest = (doc: { _id: string; slug?: string; airtableRecordId?: string }) => {
    const status: "draft" | "published" = doc._id.startsWith("drafts.") ? "draft" : "published"
    const publishedId = doc._id.replace(/^drafts\./, "")
    const entry = { id: doc._id, status }

    if (doc.slug) bySlug.set(doc.slug, entry)
    if (status === "draft" && doc.slug) {
      bySlug.set(doc.slug, entry)
    }
    if (doc.airtableRecordId) byAirtableId.set(doc.airtableRecordId, entry)

    if (status === "published" && doc.slug) {
      bySlug.set(doc.slug, { id: publishedId, status: "published" })
    }
  }

  for (const doc of [...(rows.alumni ?? []), ...(rows.advisors ?? [])]) {
    ingest(doc)
  }

  return { bySlug, byAirtableId }
}

export const fetchAirtableDirectoryQueue = async (options: {
  airtableApiKey: string
  sanityProjectId: string
  sanityDataset: string
  sanityReadToken?: string
  studioBaseUrl?: string
  publicSiteOrigin?: string
}): Promise<{
  founders: AirtableDirectoryQueueRow[]
  advisors: AirtableDirectoryQueueRow[]
  fieldRegistries: {
    founders: typeof AIRTABLE_FOUNDER_FIELD_REGISTRY
    advisors: typeof AIRTABLE_ADVISOR_FIELD_REGISTRY
  }
}> => {
  const [founderRecords, advisorRecords, sanityIndex] = await Promise.all([
    fetchAirtableTable(resolveAirtableTableId("founders"), options.airtableApiKey),
    fetchAirtableTable(resolveAirtableTableId("advisors"), options.airtableApiKey),
    buildSanityProfileIndex({
      projectId: options.sanityProjectId,
      dataset: options.sanityDataset,
      token: options.sanityReadToken,
    }),
  ])

  const studioOrigin = (options.studioBaseUrl ?? "https://rellia.sanity.studio").replace(/\/$/, "")
  const siteOrigin = (options.publicSiteOrigin ?? "https://www.relliahealth.com").replace(/\/$/, "")

  const mapFounder = (record: AirtableRecord): AirtableDirectoryQueueRow => {
    const fields = record.fields
    const companyName = String(fields["Company Name"] ?? "").trim() || "Untitled company"
    const slug = slugifyDirectoryName(companyName)
    const { status, sanityDocumentId } = resolveSiteStatus(slug, sanityIndex)
    const coverage = buildFieldCoverage(AIRTABLE_FOUNDER_FIELD_REGISTRY, fields, status)

    const tableKind = "founders" as const
    return {
      airtableRecordId: record.id,
      kind: "founder",
      displayName: companyName,
      organization: companyName,
      slugCandidate: slug,
      imageUrl:
        firstAttachmentUrl(fields["Company Logo"]) ??
        firstAttachmentUrl(fields["Founder Headshots"]) ??
        null,
      siteStatus: status,
      sanityDocumentId,
      sanityStudioUrl: sanityDocumentId
        ? `${studioOrigin}/structure/alumniCompany;${encodeURIComponent(sanityDocumentId.startsWith("drafts.") ? sanityDocumentId : `drafts.${sanityDocumentId}`)}`
        : undefined,
      publicUrl:
        status === "published"
          ? `${siteOrigin}${publicAlumniProfilePath(slug)}`
          : undefined,
      airtableRecordUrl: airtableRecordUrl(record.id, tableKind),
      fieldCoverage: coverage,
      missingForPublish: missingForPublish(coverage, "founder"),
      updatedAt: record.createdTime,
    }
  }

  const mapAdvisor = (record: AirtableRecord): AirtableDirectoryQueueRow => {
    const fields = record.fields
    const name = String(fields.Name ?? "").trim() || "Untitled advisor"
    const slug = slugifyDirectoryName(name)
    const { status, sanityDocumentId } = resolveSiteStatus(slug, sanityIndex)
    const coverage = buildFieldCoverage(AIRTABLE_ADVISOR_FIELD_REGISTRY, fields, status)

    const tableKind = "advisors" as const
    return {
      airtableRecordId: record.id,
      kind: "advisor",
      displayName: name,
      organization: typeof fields.Company === "string" ? fields.Company : undefined,
      slugCandidate: slug,
      imageUrl: firstAttachmentUrl(fields.Headshot),
      siteStatus: status,
      sanityDocumentId,
      sanityStudioUrl: sanityDocumentId
        ? `${studioOrigin}/structure/advisor;${encodeURIComponent(sanityDocumentId.startsWith("drafts.") ? sanityDocumentId : `drafts.${sanityDocumentId}`)}`
        : undefined,
      publicUrl:
        status === "published"
          ? `${siteOrigin}${publicAdvisorProfilePath(slug)}`
          : undefined,
      airtableRecordUrl: airtableRecordUrl(record.id, tableKind),
      fieldCoverage: coverage,
      missingForPublish: missingForPublish(coverage, "advisor"),
      updatedAt: record.createdTime,
    }
  }

  return {
    founders: founderRecords.map(mapFounder).sort((a, b) => a.displayName.localeCompare(b.displayName)),
    advisors: advisorRecords.map(mapAdvisor).sort((a, b) => a.displayName.localeCompare(b.displayName)),
    fieldRegistries: {
      founders: AIRTABLE_FOUNDER_FIELD_REGISTRY,
      advisors: AIRTABLE_ADVISOR_FIELD_REGISTRY,
    },
  }
}

const stringField = (fields: Record<string, unknown>, key: string) => {
  const value = fields[key]
  return typeof value === "string" && value.trim() ? value.trim() : null
}

const stringListField = (fields: Record<string, unknown>, key: string) => {
  const value = fields[key]
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
}

const buildFounderPreviewSections = (
  fields: Record<string, unknown>,
): import("../shared/admin/airtableDirectoryMeta").AirtableProfilePreviewSection[] => {
  const logo = firstAttachmentUrl(fields["Company Logo"])
  const headshot = firstAttachmentUrl(fields["Founder Headshots"])
  const tagline = stringField(fields, "Company 1-Liner")
  const bio = stringField(fields, "Company Bio")
  const founderName = stringField(fields, "Founder(s)")
  const founderBio = stringField(fields, "Founder description")
  const cta = stringField(fields, "CTA")

  return [
    {
      id: "logo",
      title: "Company logo",
      complete: Boolean(logo),
      message: logo ? "Logo available in Airtable" : "No company logo uploaded yet",
      previewImageUrl: logo ?? undefined,
    },
    {
      id: "tagline",
      title: "Tagline",
      complete: Boolean(tagline),
      message: tagline ? "Card and sidebar tagline" : "Missing company one-liner",
      previewText: tagline ?? undefined,
    },
    {
      id: "bio",
      title: "Company overview",
      complete: Boolean(bio),
      message: bio ? "About section body copy" : "Missing company bio",
      previewText: bio ?? undefined,
    },
    {
      id: "founder",
      title: "Founder",
      complete: Boolean(founderName),
      message: founderName ? "Founder name and role" : "Missing founder name",
      previewText: [founderName, stringField(fields, "Job Title")].filter(Boolean).join(" · ") || undefined,
      previewImageUrl: headshot ?? undefined,
    },
    {
      id: "founder-description",
      title: "Founder description",
      complete: Boolean(founderBio),
      message: founderBio ? "Optional founder bio paragraph" : "No founder description (hidden on site)",
      previewText: founderBio ?? undefined,
    },
    {
      id: "cta",
      title: "Website CTA",
      complete: Boolean(cta && stringField(fields, "CTA Link")),
      message: cta ? "Call-to-action panel on profile" : "Missing CTA copy or link",
      previewText: cta ?? undefined,
    },
    {
      id: "tags",
      title: "Directory tags",
      complete:
        stringListField(fields, "Clinical Specialty").length > 0 ||
        stringListField(fields, "Business Model").length > 0 ||
        stringListField(fields, "Country").length > 0,
      message: "Specialty, business model, and country filters",
      tags: [
        ...stringListField(fields, "Clinical Specialty"),
        ...stringListField(fields, "Business Model"),
        ...stringListField(fields, "Country"),
      ],
    },
  ]
}

const buildAdvisorPreviewSections = (
  fields: Record<string, unknown>,
): import("../shared/admin/airtableDirectoryMeta").AirtableProfilePreviewSection[] => {
  const headshot = firstAttachmentUrl(fields.Headshot)
  const snapshot = stringField(fields, "Short Bio")
  const longBio = stringField(fields, "Long Bio")

  return [
    {
      id: "headshot",
      title: "Headshot",
      complete: Boolean(headshot),
      message: headshot ? "Profile photo available" : "Missing headshot",
      previewImageUrl: headshot ?? undefined,
    },
    {
      id: "identity",
      title: "Name & role",
      complete: Boolean(stringField(fields, "Name")),
      message: "Advisor identity block",
      previewText: [stringField(fields, "Name"), stringField(fields, "Job Title"), stringField(fields, "Company")]
        .filter(Boolean)
        .join(" · ") || undefined,
    },
    {
      id: "snapshot",
      title: "Snapshot",
      complete: Boolean(snapshot),
      message: snapshot ? "Directory card summary" : "Missing short bio",
      previewText: snapshot ?? undefined,
    },
    {
      id: "bio",
      title: "About the advisor",
      complete: Boolean(longBio),
      message: longBio ? "Full profile bio" : "Missing long bio",
      previewText: longBio ?? undefined,
    },
    {
      id: "tags",
      title: "Tags & filters",
      complete:
        stringListField(fields, "Expertise Tags").length > 0 ||
        stringListField(fields, "Industry Tags").length > 0 ||
        stringListField(fields, "Country").length > 0,
      message: "Expertise, industry, and country",
      tags: [
        ...stringListField(fields, "Expertise Tags"),
        ...stringListField(fields, "Industry Tags"),
        ...stringListField(fields, "Country"),
      ],
    },
  ]
}

export const fetchAirtableDirectoryDetail = async (options: {
  airtableApiKey: string
  kind: AirtableDirectoryKind
  recordId: string
  sanityProjectId: string
  sanityDataset: string
  sanityReadToken?: string
  studioBaseUrl?: string
  publicSiteOrigin?: string
}): Promise<import("../shared/admin/airtableDirectoryMeta").AirtableDirectoryDetail | null> => {
  const tableId = resolveAirtableTableId(options.kind === "founder" ? "founders" : "advisors")
  const baseId = resolveAirtableBaseId()
  const url = `https://api.airtable.com/v0/${baseId}/${tableId}/${options.recordId}`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${options.airtableApiKey}` },
  })
  if (!response.ok) return null

  const record = (await response.json()) as AirtableRecord
  const queue = await fetchAirtableDirectoryQueue({
    airtableApiKey: options.airtableApiKey,
    sanityProjectId: options.sanityProjectId,
    sanityDataset: options.sanityDataset,
    sanityReadToken: options.sanityReadToken,
    studioBaseUrl: options.studioBaseUrl,
    publicSiteOrigin: options.publicSiteOrigin,
  })

  const row =
    options.kind === "founder"
      ? queue.founders.find((item) => item.airtableRecordId === options.recordId)
      : queue.advisors.find((item) => item.airtableRecordId === options.recordId)

  if (!row) return null

  const fields = record.fields
  const websiteStatusRaw = fields[WEBSITE_STATUS_FIELD]
  const websiteStatus = typeof websiteStatusRaw === "string" ? websiteStatusRaw : null

  return {
    ...row,
    websiteStatus,
    previewSections:
      options.kind === "founder"
        ? buildFounderPreviewSections(fields)
        : buildAdvisorPreviewSections(fields),
  }
}

export { normalizeCountry }
