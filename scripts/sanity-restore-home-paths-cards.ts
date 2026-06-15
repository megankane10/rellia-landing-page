/**
 * Restores homePage.pathsCards from drafts.homePage when a bad migration stripped images.
 *
 *   SANITY_API_DATASET=production pnpm sanity:restore:home-paths-cards
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { DEFAULT_HOME_PATHS_CARDS } from "../shared/cms/defaults"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type PathsCard = Record<string, unknown> & {
  _key?: string
  roleId?: string
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

  const draft = await client.fetch<{ pathsCards?: PathsCard[] } | null>(
    `*[_id == "drafts.homePage"][0]{ pathsCards }`,
  )
  const published = await client.fetch<{ pathsCards?: PathsCard[] } | null>(
    `*[_id == "homePage"][0]{ pathsCards }`,
  )

  if (!draft?.pathsCards?.length) {
    console.log(`No drafts.homePage pathsCards found on ${dataset}. Nothing to restore.`)
    return
  }

  const partnerDefaults = DEFAULT_HOME_PATHS_CARDS.find((card) => card.roleId === "partner")

  const restoredCards = draft.pathsCards.map((card) => {
    if (card.roleId !== "partner" || !partnerDefaults) return card
    return {
      ...card,
      tagLabel: partnerDefaults.tagLabel,
      ctaLabel: partnerDefaults.ctaLabel,
    }
  })

  const publishedStripped =
    published?.pathsCards?.some(
      (card) => !card.image && !card.imageSrc && !card.title && !card.subtitle,
    ) ?? false

  if (!publishedStripped) {
    console.log(`homePage.pathsCards on ${dataset} still has image/title data — skipping restore.`)
    return
  }

  await client.patch("homePage").set({ pathsCards: restoredCards }).commit()
  console.log(`Restored homePage.pathsCards on ${projectId}/${dataset} from drafts.homePage (${restoredCards.length} cards).`)
  console.log("Review and publish homePage in Studio — do not auto-publish if the draft contains unrelated test content.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
