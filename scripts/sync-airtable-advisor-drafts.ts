/**
 * Re-sync advisor Airtable rows into Sanity drafts with corrected field mapping.
 *
 * Requires: AIRTABLE_API_KEY, SANITY_API_WRITE_TOKEN
 * Run: pnpm sync:airtable-advisor-drafts
 */

import { createClient } from "@sanity/client"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import "./loadEnv"
import { resolveAirtableBaseId, resolveAirtableTableId } from "../shared/admin/airtableConfig"
import { slugifyDirectoryName } from "../shared/admin/airtableDirectoryMeta"
import { buildAdvisorDocFromAirtable } from "../shared/admin/airtableProfileMapping"

const TARGET_NAMES = [
  "Paola Santiago",
  "Mike Konwiak",
  "Serina Ahmad",
  "Holly Mowbray",
  "Suzana Vukovic",
]

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

const fetchAdvisorRecords = async (apiKey: string): Promise<AirtableRecord[]> => {
  const records: AirtableRecord[] = []
  let offset: string | undefined
  const baseId = resolveAirtableBaseId()
  const tableId = resolveAirtableTableId("advisors")

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
    const name = String(record.fields.Name ?? "").trim()
    const slug = slugifyDirectoryName(name)
    const headshotPath =
      (await downloadHeadshot(record.fields.Headshot, slug)) ?? "/images/nopicture-male.jpg"

    const doc = buildAdvisorDocFromAirtable(record.id, record.fields, { photoSrc: headshotPath })
    await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0])
    console.log(`  ✓ ${doc._id} (${name}) — industries: ${(doc.industries ?? []).join(", ") || "—"}`)
  }

  console.log("Done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
