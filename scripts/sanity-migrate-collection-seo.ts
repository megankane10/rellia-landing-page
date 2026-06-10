/**
 * Clears auto-derived SEO title/description on collection documents so metadata
 * stays in sync with main content fields when SEO overrides are left empty.
 *
 *   pnpm sanity:migrate:collection-seo
 *   SANITY_API_DATASET=production pnpm sanity:migrate:collection-seo
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { COLLECTION_SEO_TEXT_UNSET_PATHS } from "../shared/cms/collectionSeo"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

const COLLECTION_TYPES = ["story", "event", "program"] as const

async function main() {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "preview"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const docs = await client.fetch<Array<{ _id: string; _type: string }>>(
    `*[_type in $types]{ _id, _type }`,
    { types: COLLECTION_TYPES },
  )

  if (!docs.length) {
    console.log(`No collection documents found on ${projectId}/${dataset}`)
    return
  }

  console.log(
    `Clearing collection SEO text overrides on ${projectId}/${dataset} (${docs.length} documents)…`,
  )

  let tx = client.transaction()
  let batch = 0

  for (const doc of docs) {
    tx = tx.patch(doc._id, (patch) => patch.unset([...COLLECTION_SEO_TEXT_UNSET_PATHS]))
    batch += 1

    if (batch >= 50) {
      await tx.commit()
      tx = client.transaction()
      batch = 0
    }
  }

  if (batch > 0) await tx.commit()

  console.log("Done: collection SEO text fields cleared (images, robots, and noIndex preserved)")
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
