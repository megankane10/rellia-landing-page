import { createClient } from "@sanity/client"
import "./loadEnv"

const requireEnv = (key: string): string => {
  const v = process.env[key]?.trim()
  if (!v) throw new Error(`Missing required env var: ${key}`)
  return v
}

async function main() {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "production"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const published = await client.getDocument<Record<string, unknown>>("homePage")
  if (!published) {
    throw new Error('Missing published "homePage" document')
  }

  const draftId = "drafts.homePage"
  const draft = await client.getDocument<Record<string, unknown>>(draftId)

  const nextDraft = {
    ...published,
    _id: draftId,
    _type: "homePage",
  }

  await client
    .transaction()
    .createOrReplace(nextDraft)
    .commit({ autoGenerateArrayKeys: true })

   
  console.log(`Synced ${draft ? "existing" : "new"} draft from published: ${draftId}`)
}

main().catch((err) => {
   
  console.error(err)
  process.exitCode = 1
})

