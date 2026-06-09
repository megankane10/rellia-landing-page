import { createClient } from "@sanity/client"
import "./loadEnv"
import {
  PROGRAM_STATIC_BLOCKS_BY_SLUG,
  buildProgramTimelineFieldsSeed,
} from "./seed/cmsSyncContent"

const patchDataset = async (dataset: string) => {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim()
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN missing")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  let patched = 0

  for (const [slug, staticBlocks] of Object.entries(PROGRAM_STATIC_BLOCKS_BY_SLUG)) {
    const docId = `program.${slug}`
    const exists = await client.fetch<string | null>(`*[_id == $id][0]._id`, { id: docId })
    if (!exists) {
      console.log(`Skipping missing ${docId} on ${dataset}`)
      continue
    }

    const timelineFields = buildProgramTimelineFieldsSeed(slug, staticBlocks)

    await client
      .patch(docId)
      .set({
        timelineTitle: timelineFields.timelineTitle,
        timelineSubtitle: timelineFields.timelineSubtitle,
        timelineSteps: timelineFields.timelineSteps,
      })
      .commit()

    patched += 1
    console.log(`Patched timeline for ${slug} on ${dataset}`)
  }

  console.log(`Done: ${patched} program timelines updated on ${dataset}`)
}

const main = async () => {
  const explicitDataset = process.env.SANITY_API_DATASET?.trim()
  if (explicitDataset) {
    await patchDataset(explicitDataset)
    return
  }

  await patchDataset("preview")
  await patchDataset("production")
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
