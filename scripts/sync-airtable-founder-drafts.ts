/**
 * Import founder / alumni Airtable rows into Sanity as drafts.
 *
 * Requires: AIRTABLE_API_KEY, SANITY_API_WRITE_TOKEN
 * Run: pnpm sync:airtable-founder-drafts
 */

import { createClient } from "@sanity/client"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import "./loadEnv"
import { resolveAirtableBaseId, resolveAirtableTableId } from "../shared/admin/airtableConfig"
import { slugifyDirectoryName } from "../shared/admin/airtableDirectoryMeta"
import { buildFounderDocFromAirtable } from "../shared/admin/airtableProfileMapping"

/** Companies with solid Airtable data — skip ones already published manually in Sanity. */
const TARGET_COMPANIES = [
  "HealCycle",
  "Miraei",
  "Deep Interaction Lab",
  "Clouds of Care",
  "Lanyard Health",
]

const scriptsDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(scriptsDir, "..")
const imagesDir = path.join(root, "public", "images", "alumni")

type AirtableAttachment = { url?: string; filename?: string }
type AirtableRecord = { id: string; fields: Record<string, unknown> }

const requireEnv = (key: string): string => {
  const value = process.env[key]?.trim()
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

const fetchFounderRecords = async (apiKey: string): Promise<AirtableRecord[]> => {
  const records: AirtableRecord[] = []
  let offset: string | undefined
  const baseId = resolveAirtableBaseId()
  const tableId = resolveAirtableTableId("founders")

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`)
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

const downloadAttachment = async (
  attachments: unknown,
  filenameStem: string,
): Promise<string | null> => {
  if (!Array.isArray(attachments) || attachments.length === 0) return null
  const first = attachments[0] as AirtableAttachment
  if (!first?.url) return null

  await fs.mkdir(imagesDir, { recursive: true })
  const ext = path.extname(first.filename ?? "") || ".jpg"
  const filename = `${filenameStem}${ext}`
  const dest = path.join(imagesDir, filename)

  const response = await fetch(first.url)
  if (!response.ok) return null
  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(dest, buffer)
  return `/images/alumni/${filename}`
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

  const records = await fetchFounderRecords(airtableKey)
  const selected = records.filter((record) => {
    const company = String(record.fields["Company Name"] ?? "").trim()
    return TARGET_COMPANIES.some((target) => company.toLowerCase().includes(target.toLowerCase()))
  })

  if (selected.length === 0) {
    throw new Error("No matching founder records found in Airtable.")
  }

  console.log(`Syncing ${selected.length} alumni companies as Sanity drafts → ${projectId}/${dataset}`)

  for (const record of selected) {
    const companyName = String(record.fields["Company Name"] ?? "").trim()
    const slug = slugifyDirectoryName(companyName)
    const logoSrc = await downloadAttachment(record.fields["Company Logo"], `logo-${slug}`)
    const founderImageSrc = await downloadAttachment(
      record.fields["Founder Headshots"],
      `founder-${slug}`,
    )

    const doc = buildFounderDocFromAirtable(record.id, record.fields, {
      logoSrc: logoSrc ?? undefined,
      founderImageSrc: founderImageSrc ?? undefined,
    })
    await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0])
    console.log(`  ✓ ${doc._id} (${companyName})`)
  }

  console.log("Done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
