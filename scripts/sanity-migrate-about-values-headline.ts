/**
 * Updates aboutPage valuesHeadlinePortable so only "every decision" uses the mint accent.
 * Skips documents that already use the new three-part structure.
 *
 *   pnpm sanity:migrate:about-values-headline
 *   SANITY_API_DATASET=production pnpm sanity:migrate:about-values-headline
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { threePartHeroHeadline } from "../shared/cms/inlineHeroHeadline"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

const TARGET_HEADLINE = threePartHeroHeadline(
  "These principles guide",
  "every decision",
  " we make.",
)

type PortableSpan = { text?: string; marks?: string[] }
type PortableBlock = { _type?: string; children?: PortableSpan[] }

const hasPortable = (value: unknown): value is PortableBlock[] =>
  Array.isArray(value) && value.length > 0

/** Legacy default minted the full second phrase "every decision we make." */
const needsValuesHeadlineMigration = (portable: PortableBlock[] | undefined | null): boolean => {
  if (!hasPortable(portable)) return true

  const block = portable.find((entry) => entry._type === "block")
  const children = block?.children ?? []
  const mintSpan = children.find((child) => child.marks?.includes("mint"))
  if (!mintSpan?.text) return true

  const mintText = mintSpan.text.trim().toLowerCase()
  if (mintText === "every decision") return false
  if (mintText.includes("every decision we make")) return true

  return false
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

  const doc = await client.fetch<{ _id: string; valuesHeadlinePortable?: PortableBlock[] } | null>(
    `*[_id == "aboutPage"][0]{ _id, valuesHeadlinePortable }`,
  )

  if (!doc?._id) {
    console.log("No aboutPage document found.")
    return
  }

  if (!needsValuesHeadlineMigration(doc.valuesHeadlinePortable)) {
    console.log(`aboutPage on "${dataset}" already has the mint "every decision" accent.`)
    return
  }

  await client.patch(doc._id).set({ valuesHeadlinePortable: TARGET_HEADLINE }).commit()
  console.log(`Patched aboutPage valuesHeadlinePortable on "${dataset}".`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
