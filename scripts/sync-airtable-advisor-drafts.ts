/**
 * Imports a small batch of Airtable advisor rows into Sanity as drafts (read-only from Airtable).
 *
 * Requires: AIRTABLE_API_KEY, SANITY_API_WRITE_TOKEN
 * Optional: SANITY_API_DATASET (defaults to production)
 *
 * Run: pnpm tsx scripts/sync-airtable-advisor-drafts.ts
 */

import { createClient } from "@sanity/client"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import "./loadEnv"
import {
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_IDS,
  slugifyDirectoryName,
} from "../shared/admin/airtableDirectoryMeta"
import {
  AIRTABLE_ADVISOR_EXPERTISE_OPTIONS,
} from "../shared/cms/airtableFilterOptions"

const TARGET_NAMES = [
  "Paola Santiago",
  "Mike Konwiak",
  "Serina Ahmad",
  "Holly Mowbray",
  "Suzana Vukovic",
]

const FILTER_GROUP_COUNTRY = "directoryFilterGroup-country"
const FILTER_GROUP_EXPERTISE = "directoryFilterGroup-expertise"

const normalizeCountry = (value: string): string => {
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

const scriptsDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(scriptsDir, "..")
const imagesDir = path.join(root, "public", "images", "advisors")

type AirtableAttachment = { url?: string; filename?: string }
type AirtableRecord = { id: string; fields: Record<string, unknown> }

const requireEnv = (key: string): string => {
  const value = process.env[key]?.trim()
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

const ptBlock = (key: string, text: string) => ({
  _type: "block" as const,
  _key: key,
  style: "normal" as const,
  markDefs: [],
  children: [{ _type: "span" as const, _key: `${key}-span`, text, marks: [] as string[] }],
})

const fetchAdvisorRecords = async (apiKey: string): Promise<AirtableRecord[]> => {
  const records: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_IDS.advisors}`)
    url.searchParams.set("pageSize", "100")
    if (offset) url.searchParams.set("offset", offset)
    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!response.ok) throw new Error(`Airtable error ${response.status}`)
    const data = (await response.json()) as { records?: AirtableRecord[]; offset?: string }
    records.push(...(data.records ?? []))
    offset = data.offset
  } while (offset)

  return records
}

const downloadHeadshot = async (attachments: unknown, slug: string): Promise<string | null> => {
  if (!Array.isArray(attachments) || attachments.length === 0) return null
  const first = attachments[0] as AirtableAttachment
  if (!first?.url) return null

  await fs.mkdir(imagesDir, { recursive: true })
  const ext = path.extname(first.filename ?? "") || ".jpg"
  const filename = `advisor-${slug}${ext}`
  const dest = path.join(imagesDir, filename)

  const response = await fetch(first.url)
  if (!response.ok) return null
  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(dest, buffer)
  return `/images/advisors/${filename}`
}

const mapExpertise = (fields: Record<string, unknown>): string[] => {
  const tags = fields["Expertise Tags"]
  if (Array.isArray(tags) && tags.length > 0) {
    return tags.filter(
      (t): t is string =>
        typeof t === "string" && AIRTABLE_ADVISOR_EXPERTISE_OPTIONS.includes(t as (typeof AIRTABLE_ADVISOR_EXPERTISE_OPTIONS)[number]),
    )
  }
  const shortBio = typeof fields["Short Bio"] === "string" ? fields["Short Bio"].toLowerCase() : ""
  if (shortBio.includes("regulatory") || shortBio.includes("quality")) return ["Regulatory & Quality"]
  if (shortBio.includes("marketing")) return ["Marketing"]
  if (shortBio.includes("healthcare") || shortBio.includes("system")) return ["Healthcare Systems"]
  return ["Healthcare Systems"]
}

const mapCountries = (fields: Record<string, unknown>): string[] => {
  const raw = fields.Country
  if (!Array.isArray(raw)) return []
  return raw
    .filter((v): v is string => typeof v === "string")
    .map(normalizeCountry)
    .filter(Boolean)
}

const mapSocialLinks = (fields: Record<string, unknown>) => {
  const links: Array<{ platform: string; label: string; url: string }> = []
  const linkedin = typeof fields.LinkedIn === "string" ? fields.LinkedIn.trim() : ""
  const website = typeof fields["Company URL"] === "string" ? fields["Company URL"].trim() : ""
  const calendly = typeof fields["Calendly Link"] === "string" ? fields["Calendly Link"].trim() : ""

  if (linkedin) links.push({ platform: "linkedin", label: "LinkedIn", url: linkedin })
  if (website) links.push({ platform: "website", label: "Website", url: website })
  if (calendly) links.push({ platform: "website", label: "Calendly", url: calendly })

  return links
}

async function main() {
  const airtableKey = requireEnv("AIRTABLE_API_KEY")
  const token = requireEnv("SANITY_API_WRITE_TOKEN")
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "production"

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const records = await fetchAdvisorRecords(airtableKey)
  const selected = records.filter((record) => {
    const name = String(record.fields.Name ?? "").trim()
    return TARGET_NAMES.includes(name)
  })

  if (selected.length === 0) {
    throw new Error("No matching advisor records found in Airtable.")
  }

  console.log(`Syncing ${selected.length} advisors as Sanity drafts → ${projectId}/${dataset}`)

  for (const record of selected) {
    const fields = record.fields
    const name = String(fields.Name ?? "").trim()
    const slug = slugifyDirectoryName(name)
    const expertise = mapExpertise(fields)
    const countries = mapCountries(fields)
    const headshotPath =
      (await downloadHeadshot(fields.Headshot, slug)) ?? "/images/nopicture-male.jpg"

    const snapshot =
      (typeof fields["Short Bio"] === "string" && fields["Short Bio"].trim()) ||
      (typeof fields["Long Bio"] === "string" && fields["Long Bio"].trim().slice(0, 200)) ||
      `${name} advises health tech founders through Rellia.`

    const longBio =
      typeof fields["Long Bio"] === "string" && fields["Long Bio"].trim()
        ? fields["Long Bio"].trim()
        : snapshot

    const industries = Array.isArray(fields["Industry Tags"])
      ? fields["Industry Tags"].filter((t): t is string => typeof t === "string")
      : []

    const doc = {
      _id: `drafts.advisor-${slug}`,
      _type: "advisor",
      name,
      slug: { _type: "slug", current: slug },
      organization: typeof fields.Company === "string" ? fields.Company : undefined,
      role: typeof fields["Job Title"] === "string" ? fields["Job Title"] : undefined,
      snapshot,
      yearJoined: "2025",
      industries,
      photoSrc: headshotPath,
      email: typeof fields.Email === "string" ? fields.Email : undefined,
      socialLinks: mapSocialLinks(fields),
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
    }

    await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0])
    console.log(`  ✓ draft advisor-${slug} (${name})`)
  }

  console.log("Done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
