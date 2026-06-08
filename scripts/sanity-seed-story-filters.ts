/**
 * Seeds confirmed story category tags (storyFilter documents). Safe to re-run.
 *
 *   pnpm sanity:seed:story-filters
 *   SANITY_API_DATASET=production pnpm sanity:seed:story-filters
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { buildStoryFilterMutations, CONFIRMED_STORY_TAGS } from "../shared/cms/storyFilters"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

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

  const mutations = buildStoryFilterMutations()

  console.log(`Seeding story categories on ${projectId}/${dataset}…`)
  console.log(`Tags: ${CONFIRMED_STORY_TAGS.join(", ")}`)
  await client.mutate(mutations, { autoGenerateArrayKeys: true })
  console.log("Done: storyFilter categories")
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
