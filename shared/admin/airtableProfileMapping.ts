import { AIRTABLE_ADVISOR_EXPERTISE_OPTIONS } from "../cms/airtableFilterOptions"
import { slugifyDirectoryName } from "./airtableDirectoryMeta"

export const ptBlock = (key: string, text: string) => ({
  _type: "block" as const,
  _key: key,
  style: "normal" as const,
  markDefs: [],
  children: [{ _type: "span" as const, _key: `${key}-span`, text, marks: [] as string[] }],
})

export const stringField = (fields: Record<string, unknown>, key: string) => {
  const value = fields[key]
  return typeof value === "string" && value.trim() ? value.trim() : null
}

export const stringListField = (fields: Record<string, unknown>, key: string) => {
  const value = fields[key]
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
}

export const parseCommaSeparatedTags = (text: string): string[] =>
  text
    .split(/,\s*/)
    .map((part) => part.trim())
    .filter(Boolean)

/** Short Bio is often a comma-separated tag list in Airtable, not a narrative snapshot. */
export const looksLikeTagList = (text: string): boolean => {
  const trimmed = text.trim()
  if (!trimmed) return false
  if (/[.!?]/.test(trimmed)) return false
  if (trimmed.includes(",")) {
    const parts = parseCommaSeparatedTags(trimmed)
    return parts.length >= 2 && parts.every((part) => part.length <= 80)
  }
  return trimmed.length <= 48 && trimmed.split(/\s+/).length <= 5
}

const uniqueStrings = (values: string[]) => [...new Set(values.map((v) => v.trim()).filter(Boolean))]

export const normalizeCountry = (value: string): string => {
  const trimmed = value.trim()
  const key = trimmed.toLowerCase()
  const aliases: Record<string, string> = {
    usa: "US",
    "united states": "US",
    uk: "United Kingdom",
    ca: "Canada",
  }
  return aliases[key] ?? trimmed
}

export const mapCountries = (fields: Record<string, unknown>) =>
  stringListField(fields, "Country").map(normalizeCountry).filter(Boolean)

export const mapAdvisorExpertise = (fields: Record<string, unknown>) => {
  const tags = stringListField(fields, "Expertise Tags")
  if (tags.length > 0) {
    return tags.filter((tag) =>
      AIRTABLE_ADVISOR_EXPERTISE_OPTIONS.includes(tag as (typeof AIRTABLE_ADVISOR_EXPERTISE_OPTIONS)[number]),
    )
  }
  const shortBio = stringField(fields, "Short Bio")
  if (shortBio) {
    const lower = shortBio.toLowerCase()
    if (lower.includes("regulatory") || lower.includes("quality")) return ["Regulatory & Quality"]
    if (lower.includes("marketing")) return ["Marketing"]
  }
  return ["Healthcare Systems"]
}

export const mapAdvisorIndustries = (fields: Record<string, unknown>): string[] => {
  const fromSelect = stringListField(fields, "Industry Tags")
  const shortBio = stringField(fields, "Short Bio")
  const fromShortBio = shortBio && looksLikeTagList(shortBio) ? parseCommaSeparatedTags(shortBio) : []
  return uniqueStrings([...fromSelect, ...fromShortBio])
}

export const mapAdvisorSnapshot = (
  fields: Record<string, unknown>,
  name: string,
): string => {
  const shortBio = stringField(fields, "Short Bio")
  const longBio = stringField(fields, "Long Bio")

  if (shortBio && !looksLikeTagList(shortBio)) {
    return shortBio
  }

  if (longBio) {
    return longBio.length > 280 ? `${longBio.slice(0, 277).trim()}…` : longBio
  }

  return `${name} advises health tech founders through Rellia.`
}

export const mapAdvisorLongBio = (fields: Record<string, unknown>): string | null =>
  stringField(fields, "Long Bio")

export const normalizeUrl = (raw: string | null | undefined): string | undefined => {
  if (!raw?.trim()) return undefined
  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/\//, "")}`
}

const FILTER_GROUP_COUNTRY = "directoryFilterGroup-country"
const FILTER_GROUP_EXPERTISE = "directoryFilterGroup-expertise"
const FILTER_GROUP_SPECIALTY = "directoryFilterGroup-specialty"
const FILTER_GROUP_BUSINESS_MODEL = "directoryFilterGroup-business-model"

export const buildAdvisorDocFromAirtable = (
  recordId: string,
  fields: Record<string, unknown>,
  options?: { photoSrc?: string },
) => {
  const name = stringField(fields, "Name") ?? "Untitled advisor"
  const slug = slugifyDirectoryName(name)
  const longBio = mapAdvisorLongBio(fields)
  const snapshot = mapAdvisorSnapshot(fields, name)
  const industries = mapAdvisorIndustries(fields)
  const countries = mapCountries(fields)
  const expertise = mapAdvisorExpertise(fields)

  const socialLinks: Array<{ platform: string; label: string; url: string }> = []
  const linkedin = stringField(fields, "LinkedIn")
  const website = stringField(fields, "Company URL")
  const calendly = stringField(fields, "Calendly Link")
  if (linkedin) socialLinks.push({ platform: "linkedin", label: "LinkedIn", url: linkedin })
  if (website) socialLinks.push({ platform: "website", label: "Website", url: website })
  if (calendly) socialLinks.push({ platform: "website", label: "Calendly", url: calendly })

  return {
    _id: `drafts.advisor-${slug}`,
    _type: "advisor" as const,
    name,
    slug: { _type: "slug" as const, current: slug },
    organization: stringField(fields, "Company") ?? undefined,
    role: stringField(fields, "Job Title") ?? undefined,
    snapshot,
    yearJoined: new Date().getFullYear().toString(),
    industries: industries.length > 0 ? industries : undefined,
    photoSrc: options?.photoSrc ?? "/images/nopicture-male.jpg",
    email: stringField(fields, "Email") ?? undefined,
    socialLinks,
    directoryFilters: [
      ...(countries.length
        ? [
            {
              _type: "directoryFilterAssignment" as const,
              group: { _type: "reference" as const, _ref: FILTER_GROUP_COUNTRY },
              values: countries,
            },
          ]
        : []),
      {
        _type: "directoryFilterAssignment" as const,
        group: { _type: "reference" as const, _ref: FILTER_GROUP_EXPERTISE },
        values: expertise,
      },
    ],
    bio: longBio ? [ptBlock(`bio-${slug}`, longBio)] : undefined,
    airtableRecordId: recordId,
  }
}

export const buildFounderDocFromAirtable = (
  recordId: string,
  fields: Record<string, unknown>,
  options?: { logoSrc?: string; founderImageSrc?: string },
) => {
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
      ? [{ _type: "directoryFilterAssignment" as const, group: { _type: "reference" as const, _ref: FILTER_GROUP_COUNTRY }, values: countries }]
      : []),
    ...(specialties.length
      ? [{ _type: "directoryFilterAssignment" as const, group: { _type: "reference" as const, _ref: FILTER_GROUP_SPECIALTY }, values: specialties }]
      : []),
    ...(businessModels.length
      ? [{ _type: "directoryFilterAssignment" as const, group: { _type: "reference" as const, _ref: FILTER_GROUP_BUSINESS_MODEL }, values: businessModels }]
      : []),
  ]

  const yearJoinedRaw = fields["Date Joined"]
  const yearJoined =
    typeof yearJoinedRaw === "string" && yearJoinedRaw.length >= 4
      ? Number(yearJoinedRaw.slice(0, 4))
      : new Date().getFullYear()

  return {
    _id: `drafts.alumni-${slug}`,
    _type: "alumniCompany" as const,
    name: companyName,
    slug: { _type: "slug" as const, current: slug },
    tagline: tagline ?? undefined,
    shortDescription: tagline ?? undefined,
    yearJoined,
    logoSrc: options?.logoSrc,
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
            imageSrc: options?.founderImageSrc,
          },
        ]
      : [],
    airtableRecordId: recordId,
  }
}
