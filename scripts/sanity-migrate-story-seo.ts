/**
 * Migrates story SEO to sanity-plugin-seofields shape and applies default titles.
 *
 *   pnpm sanity:migrate:story-seo
 *   SANITY_API_DATASET=production pnpm sanity:migrate:story-seo
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { buildDefaultStorySeoTitle, buildStorySeoFieldsPayload } from "../shared/cms/storySeo"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type StoryRow = {
  _id: string
  title?: string
  excerpt?: string
  tag?: string
  seo?: {
    title?: string
    description?: string
    metaTitle?: string
    metaDescription?: string
    ogTitle?: string
    ogDescription?: string
    openGraph?: { title?: string; description?: string }
  }
}

const resolveStorySeoTitle = (row: StoryRow): string => {
  const canonical = row.seo?.title?.trim()
  if (canonical) return canonical
  return buildDefaultStorySeoTitle(row.title?.trim() ?? "", row.tag)
}

const resolveStorySeoDescription = (row: StoryRow): string | undefined => {
  const seo = row.seo
  const existing =
    seo?.description?.trim() ||
    seo?.metaDescription?.trim() ||
    seo?.ogDescription?.trim() ||
    seo?.openGraph?.description?.trim()
  if (existing) return existing
  const excerpt = row.excerpt?.trim()
  return excerpt || undefined
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

  const stories = await client.fetch<StoryRow[]>(
    `*[_type == "story"]{
      _id,
      title,
      excerpt,
      "tag": filters[0]->title,
      seo
    }`,
  )

  if (!stories.length) {
    console.log(`No stories found on ${projectId}/${dataset}`)
    return
  }

  console.log(`Migrating story SEO on ${projectId}/${dataset} (${stories.length} stories)…`)

  let tx = client.transaction()
  let batch = 0

  for (const row of stories) {
    const title = resolveStorySeoTitle(row)
    const description = resolveStorySeoDescription(row)
    const seo = buildStorySeoFieldsPayload({
      storyTitle: row.title?.trim() ?? "",
      tag: row.tag,
      description,
    })
    seo.title = title
    if (seo.openGraph) seo.openGraph.title = title
    if (description) {
      seo.description = description
      if (seo.openGraph) seo.openGraph.description = description
    }

    tx = tx.patch(row._id, (patch) =>
      patch
        .set({ seo })
        .unset([
          "seo.metaTitle",
          "seo.metaDescription",
          "seo.ogTitle",
          "seo.ogDescription",
        ]),
    )
    batch += 1

    if (batch >= 50) {
      await tx.commit()
      tx = client.transaction()
      batch = 0
    }
  }

  if (batch > 0) await tx.commit()

  console.log("Done: story SEO migrated to seoFields shape")
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
