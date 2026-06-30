/**
 * Adds website-sync + visibility columns to a **duplicated** Airtable base only.
 *
 * Does NOT duplicate the base — do that manually in Airtable first:
 *   Base ⋯ menu → Duplicate base → name it e.g. "Rellia Network (Staging)"
 *
 * Then point env at the copy (new app… id) and run:
 *   AIRTABLE_API_KEY=pat... AIRTABLE_BASE_ID=appYourCopyId pnpm airtable:setup-staging-fields
 *
 * Optional: AIRTABLE_FOUNDERS_TABLE_ID, AIRTABLE_ADVISORS_TABLE_ID if table ids differ.
 *
 * Safe to re-run — skips fields that already exist.
 */
import "dotenv/config"
import { resolveAirtableBaseId, resolveAirtableTableId, WEBSITE_STATUS_VALUES } from "../shared/admin/airtableConfig"
import {
  AIRTABLE_PROFILE_SECTIONS_ADVISOR,
  AIRTABLE_PROFILE_SECTIONS_FOUNDER,
  WEBSITE_STATUS_FIELD,
} from "../shared/admin/airtableDirectoryMeta"

type AirtableFieldSchema = { id: string; name: string; type: string }

const PROFILE_SECTIONS_FIELD = "Profile sections visible"

const apiKey = process.env.AIRTABLE_API_KEY?.trim()
if (!apiKey) {
  console.error("Set AIRTABLE_API_KEY in the environment.")
  process.exit(1)
}

const baseId = resolveAirtableBaseId()
const PRODUCTION_BASE_ID = "appH95p8u6zW5L0RJ"

const airtableFetch = async (path: string, init?: RequestInit) => {
  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`Airtable Metadata API ${path} failed (${response.status}): ${body.slice(0, 300)}`)
  }
  return response.json()
}

const listTableFields = async (tableId: string): Promise<AirtableFieldSchema[]> => {
  const data = (await airtableFetch("/tables")) as {
    tables?: { id: string; fields?: AirtableFieldSchema[] }[]
  }
  const table = (data.tables ?? []).find((t) => t.id === tableId)
  if (!table) throw new Error(`Table ${tableId} not found in base ${baseId}`)
  return table.fields ?? []
}

const ensureField = async (
  tableId: string,
  tableLabel: string,
  existing: AirtableFieldSchema[],
  spec: Record<string, unknown>,
) => {
  const name = typeof spec.name === "string" ? spec.name : ""
  if (existing.some((field) => field.name === name)) {
    console.log(`  ✓ ${tableLabel}: "${name}" already exists`)
    return
  }

  await airtableFetch(`/tables/${tableId}/fields`, {
    method: "POST",
    body: JSON.stringify(spec),
  })
  console.log(`  + ${tableLabel}: created "${name}"`)
}

const websiteStatusField = {
  name: WEBSITE_STATUS_FIELD,
  type: "singleSelect",
  options: {
    choices: [
      { name: WEBSITE_STATUS_VALUES.notRequested },
      { name: WEBSITE_STATUS_VALUES.readyForReview },
      { name: WEBSITE_STATUS_VALUES.publishedOnSite },
      { name: WEBSITE_STATUS_VALUES.needsUpdate },
    ],
  },
}

const profileSectionsField = (choices: readonly string[]) => ({
  name: PROFILE_SECTIONS_FIELD,
  type: "multipleSelects",
  options: {
    choices: choices.map((name) => ({ name })),
  },
})

const founderFields = [
  websiteStatusField,
  { name: "Sanity document ID", type: "singleLineText" },
  {
    name: "Founder description",
    type: "multilineText",
    description: "Optional founder bio on the public profile. Leave blank to hide.",
  },
  profileSectionsField(AIRTABLE_PROFILE_SECTIONS_FOUNDER),
]

const advisorFields = [
  websiteStatusField,
  { name: "Sanity document ID", type: "singleLineText" },
  profileSectionsField(AIRTABLE_PROFILE_SECTIONS_ADVISOR),
]

const run = async () => {
  if (baseId === PRODUCTION_BASE_ID) {
    console.error(
      "\n⚠️  AIRTABLE_BASE_ID is still the production base (appH95p8u6zW5L0RJ).\n" +
        "   Duplicate the base in Airtable UI first, then set AIRTABLE_BASE_ID to the new app… id.\n" +
        "   This script refuses to add columns to production.\n",
    )
    process.exit(1)
  }

  console.log(`Configuring staging Airtable base ${baseId}…\n`)

  const foundersTableId = resolveAirtableTableId("founders")
  const advisorsTableId = resolveAirtableTableId("advisors")

  const founderExisting = await listTableFields(foundersTableId)
  for (const spec of founderFields) {
    await ensureField(foundersTableId, "Founders", founderExisting, spec)
  }

  const advisorExisting = await listTableFields(advisorsTableId)
  for (const spec of advisorFields) {
    await ensureField(advisorsTableId, "Advisors", advisorExisting, spec)
  }

  console.log("\nDone. Run pnpm airtable:audit-fields to verify field parity.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
