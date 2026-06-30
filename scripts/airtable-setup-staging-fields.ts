/**
 * Adds website-sync columns to a duplicated Airtable base (founders + advisors tables).
 *
 * Usage:
 *   AIRTABLE_API_KEY=pat... AIRTABLE_BASE_ID=app... pnpm airtable:setup-staging-fields
 *
 * Optional overrides:
 *   AIRTABLE_FOUNDERS_TABLE_ID, AIRTABLE_ADVISORS_TABLE_ID
 *
 * Safe to re-run — skips fields that already exist.
 */
import "dotenv/config"
import { resolveAirtableBaseId, resolveAirtableTableId } from "../shared/admin/airtableConfig"
import { WEBSITE_STATUS_FIELD } from "../shared/admin/airtableDirectoryMeta"
import { WEBSITE_STATUS_VALUES } from "../shared/admin/airtableConfig"

type AirtableFieldSchema = {
  id: string
  name: string
  type: string
}

const apiKey = process.env.AIRTABLE_API_KEY?.trim()
if (!apiKey) {
  console.error("Set AIRTABLE_API_KEY in the environment.")
  process.exit(1)
}

const baseId = resolveAirtableBaseId()

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
  const data = (await airtableFetch(`/tables/${tableId}`)) as { fields?: AirtableFieldSchema[] }
  return data.fields ?? []
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

const founderFields = [
  {
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
  },
  {
    name: "Sanity document ID",
    type: "singleLineText",
  },
  {
    name: "Founder description",
    type: "multilineText",
  },
]

const advisorFields = [
  {
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
  },
  {
    name: "Sanity document ID",
    type: "singleLineText",
  },
]

const run = async () => {
  console.log(`Configuring Airtable base ${baseId}…`)

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

  console.log("Done.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
