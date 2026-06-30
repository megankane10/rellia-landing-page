/**
 * Compare Airtable Metadata API fields to our mapping registry.
 *
 * Run: pnpm airtable:audit-fields
 */
import "./loadEnv"
import {
  AIRTABLE_ADVISOR_FIELD_REGISTRY,
  AIRTABLE_FOUNDER_FIELD_REGISTRY,
  WEBSITE_STATUS_FIELD,
} from "../shared/admin/airtableDirectoryMeta"
import { resolveAirtableBaseId, resolveAirtableTableId } from "../shared/admin/airtableConfig"

const apiKey = process.env.AIRTABLE_API_KEY?.trim()
if (!apiKey) {
  console.error("Set AIRTABLE_API_KEY")
  process.exit(1)
}

const auditTable = async (label: string, tableId: string, registry: { airtableField: string; syncStatus: string }[]) => {
  const baseId = resolveAirtableBaseId()
  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!response.ok) throw new Error(`Metadata fetch failed for ${label}`)
  const data = (await response.json()) as { tables?: { id: string; name: string; fields?: { name: string }[] }[] }
  const table = (data.tables ?? []).find((t) => t.id === tableId)
  if (!table) throw new Error(`Table ${tableId} not found`)
  const airtableNames = new Set((table.fields ?? []).map((f) => f.name))

  console.log(`\n=== ${label} (base ${baseId}) ===`)

  const missingOnAirtable = registry
    .filter((f) => f.syncStatus !== "pending_field" && !airtableNames.has(f.airtableField))
  const unmappedOnAirtable = [...airtableNames].filter(
    (name) => !registry.some((f) => f.airtableField === name),
  )

  if (missingOnAirtable.length) {
    console.log("\nRegistry expects but Airtable missing:")
    for (const field of missingOnAirtable) {
      console.log(`  - ${field.airtableField} (${field.syncStatus})`)
    }
  } else {
    console.log("\nAll mapped registry fields exist on Airtable ✓")
  }

  if (unmappedOnAirtable.length) {
    console.log("\nOn Airtable but not in registry:")
    for (const name of unmappedOnAirtable.sort()) {
      console.log(`  - ${name}`)
    }
  }

  const stagingFields = [WEBSITE_STATUS_FIELD, "Sanity document ID", "Founder description"]
  const stagingMissing = stagingFields.filter((f) => !airtableNames.has(f))
  if (stagingMissing.length) {
    console.log("\nStaging workflow fields not on this base yet:")
    for (const name of stagingMissing) console.log(`  - ${name}`)
    console.log("  → run pnpm airtable:setup-staging-fields on a duplicated base")
  }
}

const run = async () => {
  await auditTable("Founders", resolveAirtableTableId("founders"), AIRTABLE_FOUNDER_FIELD_REGISTRY)
  await auditTable("Advisors", resolveAirtableTableId("advisors"), AIRTABLE_ADVISOR_FIELD_REGISTRY)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
