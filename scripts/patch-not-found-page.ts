import { createClient } from "@sanity/client"
import "./loadEnv"
import { DEFAULT_NOT_FOUND } from "../shared/cms/defaults"

const LEGACY_NOT_FOUND_TITLE = "Page not found"

const LEGACY_NOT_FOUND_MESSAGES = [
  "The page you're looking for doesn't exist or has been moved.",
  "The page you are looking for does not exist or has moved.",
]

const isLegacyNotFoundMessage = (message: string) =>
  LEGACY_NOT_FOUND_MESSAGES.some(
    (legacy) => message === legacy || message.includes("doesn't exist or has been moved"),
  )

const patchDataset = async (dataset: string) => {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_STUDIO_PROJECT_ID?.trim()

  const token = process.env.SANITY_API_WRITE_TOKEN?.trim() || process.env.SANITY_API_TOKEN?.trim()

  if (!projectId) {
    throw new Error("Missing Sanity project id (SANITY_API_PROJECT_ID or VITE_SANITY_PROJECT_ID)")
  }
  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) for patch")
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  })

  const doc = await client.fetch<{
    title?: string
    message?: string
    iconKey?: string
  } | null>(`*[_id == "notFoundPage"][0]{ title, message, iconKey }`)

  if (!doc) {
    console.log(`[${dataset}] notFoundPage missing — run pnpm sanity:seed to create it`)
    return
  }

  const patch: Record<string, string> = {}
  const title = doc.title?.trim() ?? ""
  const message = doc.message?.trim() ?? ""
  const iconKey = doc.iconKey?.trim() ?? ""

  if (!title || title === LEGACY_NOT_FOUND_TITLE) {
    patch.title = DEFAULT_NOT_FOUND.title
  }
  if (!message || isLegacyNotFoundMessage(message)) {
    patch.message = DEFAULT_NOT_FOUND.message
  }
  if (!iconKey) {
    patch.iconKey = DEFAULT_NOT_FOUND.iconKey ?? "search-alert"
  }

  if (Object.keys(patch).length === 0) {
    console.log(`[${dataset}] notFoundPage already up to date`)
    return
  }

  await client.patch("notFoundPage").set(patch).commit()
  console.log(`[${dataset}] patched notFoundPage:`, patch)
}

const main = async () => {
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "production"

  await patchDataset(dataset)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
