/**
 * Adds iconKey to story body CTA boxes that are missing one.
 *
 *   pnpm sanity:migrate:story-cta-icons
 *   SANITY_API_DATASET=production pnpm sanity:migrate:story-cta-icons
 */
import { createClient } from "@sanity/client"
import "./loadEnv"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type StoryRow = {
  _id: string
  title?: string
  slug?: { current?: string }
  body?: Array<Record<string, unknown>>
}

const resolveCtaIcon = (
  slug: string,
  title: string,
  ctaTitle: string,
  buttonHref = "",
  buttonLabel = "",
): string => {
  const haystack = `${slug} ${title} ${ctaTitle} ${buttonHref} ${buttonLabel}`.toLowerCase()
  if (haystack.includes("diagnostic") || haystack.includes("readiness") || haystack.includes("benchmark")) {
    return "ClipboardCheck"
  }
  if (haystack.includes("commercialization") || haystack.includes("milestone") || haystack.includes("growth")) {
    return "TrendingUp"
  }
  if (haystack.includes("program") || haystack.includes("update") || haystack.includes("event")) {
    return "Megaphone"
  }
  if (haystack.includes("founder") || haystack.includes("story")) return "Rocket"
  return "ArrowRight"
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
      slug,
      body
    }`,
  )

  let patched = 0

  for (const story of stories) {
    const body = story.body
    if (!Array.isArray(body) || body.length === 0) continue

    let changed = false
    const slug = story.slug?.current?.trim() ?? ""
    const nextBody = body.map((block) => {
      if (block._type !== "bodyCtaBox") return block
      const existing = typeof block.iconKey === "string" ? block.iconKey.trim() : ""
      if (existing) return block
      const ctaTitle = typeof block.title === "string" ? block.title : ""
      const buttonHref = typeof block.buttonHref === "string" ? block.buttonHref : ""
      const buttonLabel = typeof block.buttonLabel === "string" ? block.buttonLabel : ""
      const iconKey = resolveCtaIcon(
        slug,
        story.title?.trim() ?? "",
        ctaTitle,
        buttonHref,
        buttonLabel,
      )
      changed = true
      return { ...block, iconKey }
    })

    if (!changed) continue

    await client.patch(story._id).set({ body: nextBody }).commit()
    patched += 1
    console.log(`Patched CTA icon(s) on story: ${story.title ?? story._id}`)
  }

  console.log(`Done. Updated ${patched} story document(s) in ${dataset}.`)
}

void main()
