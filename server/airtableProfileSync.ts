import { createClient } from "@sanity/client"
import {
  AIRTABLE_ADVISOR_EXPERTISE_OPTIONS,
} from "../shared/cms/airtableFilterOptions"
import {
  resolveAirtableBaseId,
  resolveAirtableTableId,
  WEBSITE_STATUS_VALUES,
} from "../shared/admin/airtableConfig"
import { slugifyDirectoryName, WEBSITE_STATUS_FIELD } from "../shared/admin/airtableDirectoryMeta"
import type { AirtableDirectoryKind } from "../shared/admin/airtableDirectoryMeta"
import { normalizeCountry } from "./airtableDirectoryQueue"

const FILTER_GROUP_COUNTRY = "directoryFilterGroup-country"
const FILTER_GROUP_EXPERTISE = "directoryFilterGroup-expertise"
const FILTER_GROUP_SPECIALTY = "directoryFilterGroup-specialty"
const FILTER_GROUP_BUSINESS_MODEL = "directoryFilterGroup-business-model"

const ptBlock = (key: string, text: string) => ({
  _type: "block" as const,
  _key: key,
  style: "normal" as const,
  markDefs: [],
  children: [{ _type: "span" as const, _key: `${key}-span`, text, marks: [] as string[] }],
})

const normalizeUrl = (raw: string | null | undefined): string | undefined => {
  if (!raw?.trim()) return undefined
  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/\//, "")}`
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

const mapCountries = (fields: Record<string, unknown>) =>
  stringListField(fields, "Country").map(normalizeCountry).filter(Boolean)

const mapExpertise = (fields: Record<string, unknown>) => {
  const tags = stringListField(fields, "Expertise Tags")
  if (tags.length > 0) {
    return tags.filter((tag) =>
      AIRTABLE_ADVISOR_EXPERTISE_OPTIONS.includes(tag as (typeof AIRTABLE_ADVISOR_EXPERTISE_OPTIONS)[number]),
    )
  }
  return ["Healthcare Systems"]
}

const fetchAirtableRecord = async (apiKey: string, kind: AirtableDirectoryKind, recordId: string) => {
  const tableId = resolveAirtableTableId(kind === "founder" ? "founders" : "advisors")
  const baseId = resolveAirtableBaseId()
  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`Airtable record fetch failed (${response.status}): ${body.slice(0, 200)}`)
  }
  return (await response.json()) as { id: string; fields: Record<string, unknown> }
}

const patchAirtableRecord = async (options: {
  apiKey: string
  kind: AirtableDirectoryKind
  recordId: string
  fields: Record<string, unknown>
}) => {
  if (process.env.AIRTABLE_ALLOW_WRITES?.trim() !== "true") return

  const tableId = resolveAirtableTableId(options.kind === "founder" ? "founders" : "advisors")
  const baseId = resolveAirtableBaseId()
  await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${options.recordId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: options.fields }),
  })
}

const buildAdvisorDoc = (recordId: string, fields: Record<string, unknown>) => {
  const name = stringField(fields, "Name") ?? "Untitled advisor"
  const slug = slugifyDirectoryName(name)
  const snapshot =
    stringField(fields, "Short Bio") ||
    stringField(fields, "Long Bio")?.slice(0, 200) ||
    `${name} advises health tech founders through Rellia.`
  const longBio = stringField(fields, "Long Bio") || snapshot
  const countries = mapCountries(fields)
  const expertise = mapExpertise(fields)
  const industries = stringListField(fields, "Industry Tags")

  const socialLinks: Array<{ platform: string; label: string; url: string }> = []
  const linkedin = stringField(fields, "LinkedIn")
  const website = stringField(fields, "Company URL")
  const calendly = stringField(fields, "Calendly Link")
  if (linkedin) socialLinks.push({ platform: "linkedin", label: "LinkedIn", url: linkedin })
  if (website) socialLinks.push({ platform: "website", label: "Website", url: website })
  if (calendly) socialLinks.push({ platform: "website", label: "Calendly", url: calendly })

  return {
    _id: `drafts.advisor-${slug}`,
    _type: "advisor",
    name,
    slug: { _type: "slug", current: slug },
    organization: stringField(fields, "Company") ?? undefined,
    role: stringField(fields, "Job Title") ?? undefined,
    snapshot,
    yearJoined: new Date().getFullYear().toString(),
    industries,
    photoSrc: "/images/nopicture-male.jpg",
    email: stringField(fields, "Email") ?? undefined,
    socialLinks,
    directoryFilters: [
      ...(countries.length
        ? [
            {
              _type: "directoryFilterAssignment",
              group: { _type: "reference", _ref: FILTER_GROUP_COUNTRY },
              values: countries,
            },
          ]
        : []),
      {
        _type: "directoryFilterAssignment",
        group: { _type: "reference", _ref: FILTER_GROUP_EXPERTISE },
        values: expertise,
      },
    ],
    bio: [ptBlock(`bio-${slug}`, longBio)],
    airtableRecordId: recordId,
  }
}

const buildFounderDoc = (recordId: string, fields: Record<string, unknown>) => {
  const companyName = stringField(fields, "Company Name") ?? "Untitled company"
  const slug = slugifyDirectoryName(companyName)
  const tagline = stringField(fields, "Company 1-Liner")
  const bio = stringField(fields, "Company Bio")
  const founderName = stringField(fields, "Founder(s)")
  const founderBio = stringField(fields, "Founder description")
  const ctaTitle = stringField(fields, "CTA")
  const ctaHref = normalizeUrl(stringField(fields, "CTA Link") ?? stringField(fields, "Website"))

  const profileBody: unknown[] = []
  if (bio) profileBody.push(ptBlock(`bio-${slug}`, bio))
  if (ctaTitle && ctaHref) {
    profileBody.push({
      _type: "bodyCtaBox",
      _key: `cta-${slug}`,
      title: ctaTitle,
      buttonLabel: "Visit website",
      buttonHref: ctaHref,
      iconKey: "Globe",
    })
  }

  const socialLinks: Array<{ platform: string; label: string; url: string }> = []
  const linkedin = stringField(fields, "Company LinkedIn")
  const website = normalizeUrl(stringField(fields, "Website"))
  if (linkedin) socialLinks.push({ platform: "linkedin", label: "LinkedIn", url: linkedin })
  if (website) socialLinks.push({ platform: "website", label: "Website", url: website })

  const countries = mapCountries(fields)
  const specialties = stringListField(fields, "Clinical Specialty")
  const businessModels = stringListField(fields, "Business Model")

  const directoryFilters = [
    ...(countries.length
      ? [{ _type: "directoryFilterAssignment", group: { _type: "reference", _ref: FILTER_GROUP_COUNTRY }, values: countries }]
      : []),
    ...(specialties.length
      ? [{ _type: "directoryFilterAssignment", group: { _type: "reference", _ref: FILTER_GROUP_SPECIALTY }, values: specialties }]
      : []),
    ...(businessModels.length
      ? [{ _type: "directoryFilterAssignment", group: { _type: "reference", _ref: FILTER_GROUP_BUSINESS_MODEL }, values: businessModels }]
      : []),
  ]

  const yearJoinedRaw = fields["Date Joined"]
  const yearJoined =
    typeof yearJoinedRaw === "string" && yearJoinedRaw.length >= 4
      ? Number(yearJoinedRaw.slice(0, 4))
      : new Date().getFullYear()

  return {
    _id: `drafts.alumni-${slug}`,
    _type: "alumniCompany",
    name: companyName,
    slug: { _type: "slug", current: slug },
    tagline: tagline ?? undefined,
    shortDescription: tagline ?? undefined,
    yearJoined,
    profileBody: profileBody.length ? profileBody : undefined,
    email: stringField(fields, "Company Email") ?? undefined,
    socialLinks,
    directoryFilters,
    founders: founderName
      ? [
          {
            name: founderName,
            role: stringField(fields, "Job Title") ?? undefined,
            bio: founderBio ?? undefined,
            email: stringField(fields, "E-mail") ?? undefined,
          },
        ]
      : [],
    airtableRecordId: recordId,
  }
}

export const syncAirtableProfileToSanityDraft = async (options: {
  airtableApiKey: string
  sanityProjectId: string
  sanityDataset: string
  sanityWriteToken: string
  kind: AirtableDirectoryKind
  recordId: string
}): Promise<{ documentId: string; studioPath: string }> => {
  const record = await fetchAirtableRecord(options.airtableApiKey, options.kind, options.recordId)
  const fields = record.fields

  const client = createClient({
    projectId: options.sanityProjectId,
    dataset: options.sanityDataset,
    token: options.sanityWriteToken,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const doc =
    options.kind === "founder"
      ? buildFounderDoc(options.recordId, fields)
      : buildAdvisorDoc(options.recordId, fields)

  await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0])

  await patchAirtableRecord({
    apiKey: options.airtableApiKey,
    kind: options.kind,
    recordId: options.recordId,
    fields: {
      [WEBSITE_STATUS_FIELD]: WEBSITE_STATUS_VALUES.readyForReview,
      "Sanity document ID": doc._id,
    },
  })

  const studioType = options.kind === "founder" ? "alumniCompany" : "advisor"
  return {
    documentId: doc._id,
    studioPath: `/structure/${studioType};${encodeURIComponent(doc._id)}`,
  }
}
