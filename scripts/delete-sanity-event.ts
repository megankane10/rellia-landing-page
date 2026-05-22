/**
 * Delete an event (and its draft) by slug from one or more Sanity datasets.
 *
 *   pnpm tsx scripts/delete-sanity-event.ts digital-health-salon-toronto
 *   pnpm tsx scripts/delete-sanity-event.ts digital-health-salon-toronto --datasets production,preview
 */
import { createClient } from "@sanity/client"
import "./loadEnv"

const slug = process.argv[2]?.trim()
if (!slug) {
  console.error("Usage: pnpm tsx scripts/delete-sanity-event.ts <slug>")
  process.exit(1)
}

const datasetsArg = process.argv.find((a) => a.startsWith("--datasets="))
const datasets = datasetsArg
  ? datasetsArg.replace("--datasets=", "").split(",").map((d) => d.trim())
  : ["production", "preview"]

const token = process.env.SANITY_API_WRITE_TOKEN?.trim()
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN")
  process.exit(1)
}

const projectId =
  process.env.SANITY_API_PROJECT_ID?.trim() ||
  process.env.VITE_SANITY_PROJECT_ID?.trim() ||
  "ggbt0o98"

const main = async () => {
  for (const dataset of datasets) {
    const client = createClient({
      projectId,
      dataset,
      token,
      apiVersion: "2024-01-01",
      useCdn: false,
    })

    const found = await client.fetch<{ _id: string }[]>(
      `*[_type == "event" && slug.current == $slug]{ _id }`,
      { slug },
    )

    if (!found.length) {
      console.log(`${dataset}: no event with slug "${slug}"`)
      continue
    }

    const tx = client.transaction()
    for (const doc of found) {
      tx.delete(doc._id)
      const draftId = doc._id.startsWith("drafts.") ? doc._id : `drafts.${doc._id}`
      tx.delete(draftId)
    }
    await tx.commit()
    console.log(
      `${dataset}: deleted ${found.map((d) => d._id).join(", ")} (+ draft variants)`,
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
