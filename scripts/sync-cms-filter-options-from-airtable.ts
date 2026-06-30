/**
 * Updates Sanity directoryFilterGroup option lists to match Airtable multiselect values.
 * Does not modify Airtable. Tech Category is not synced (no CMS filter group).
 *
 * Run: pnpm tsx scripts/sync-cms-filter-options-from-airtable.ts
 */

import { createClient } from "@sanity/client"
import "./loadEnv"
import {
  AIRTABLE_ADVISOR_EXPERTISE_OPTIONS,
  AIRTABLE_BUSINESS_MODEL_OPTIONS,
  AIRTABLE_CLINICAL_SPECIALTY_OPTIONS,
  AIRTABLE_COUNTRY_OPTIONS,
} from "../shared/cms/airtableFilterOptions"

const requireEnv = (key: string): string => {
  const value = process.env[key]?.trim()
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

const toOptions = (labels: readonly string[]) =>
  labels.map((label) => ({ _type: "option" as const, label }))

async function main() {
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

  const updates: Array<{ id: string; title: string; labels: readonly string[] }> = [
    { id: "directoryFilterGroup-country", title: "Country", labels: AIRTABLE_COUNTRY_OPTIONS },
    {
      id: "directoryFilterGroup-business-model",
      title: "Business Model",
      labels: AIRTABLE_BUSINESS_MODEL_OPTIONS,
    },
    {
      id: "directoryFilterGroup-specialty",
      title: "Specialty",
      labels: AIRTABLE_CLINICAL_SPECIALTY_OPTIONS,
    },
    {
      id: "directoryFilterGroup-expertise",
      title: "Expertise",
      labels: AIRTABLE_ADVISOR_EXPERTISE_OPTIONS,
    },
  ]

  console.log(`Updating directory filter options → ${projectId}/${dataset}`)

  for (const group of updates) {
    await client
      .patch(group.id)
      .set({ options: toOptions(group.labels) })
      .commit()
    console.log(`  ✓ ${group.title} (${group.labels.length} options)`)
  }

  console.log("Done. Tech Category remains unmapped — no directoryFilterGroup in CMS.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
