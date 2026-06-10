/**
 * Updates the website launch story slug to match its current title and keeps the legacy slug working.
 *
 *   pnpm fix:story-slug
 *   SANITY_API_DATASET=production pnpm fix:story-slug
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { canonicalStorySlugForTitle } from "../shared/cms/storySlugRedirects"

const LEGACY_SLUG = "website-launch"

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

  const story = await client.fetch<{
    _id: string
    title?: string
    slug?: { current?: string }
    previousSlugs?: string[]
  } | null>(`*[_id == "story.${LEGACY_SLUG}"][0]{_id,title,slug,previousSlugs}`)

  if (!story?._id) {
    console.log(`No story.${LEGACY_SLUG} on ${projectId}/${dataset}`)
    return
  }

  const title = story.title?.trim() || "Rellia story"
  const nextSlug = canonicalStorySlugForTitle(title)
  const previousSlugs = Array.from(
    new Set([...(story.previousSlugs ?? []), LEGACY_SLUG, story.slug?.current].filter(Boolean)),
  ) as string[]

  await client
    .patch(story._id)
    .set({
      slug: { _type: "slug", current: nextSlug },
      previousSlugs,
    })
    .commit()

  console.log(`Updated ${story._id} on ${dataset}: /stories/${nextSlug} (legacy: ${previousSlugs.join(", ")})`)
}

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
