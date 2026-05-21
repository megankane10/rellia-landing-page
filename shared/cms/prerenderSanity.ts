import { createClient, type SanityClient } from "@sanity/client"
import { eventBySlugQuery } from "./groqQueries"

const getPrerenderSanityConfig = (): { projectId: string; dataset: string } | null => {
  const projectId =
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    ""
  const dataset =
    process.env.VITE_SANITY_DATASET?.trim() ||
    process.env.SANITY_API_DATASET?.trim() ||
    "production"
  if (!projectId) return null
  return { projectId, dataset }
}

let prerenderClient: SanityClient | null = null

const getPrerenderSanityClient = (): SanityClient | null => {
  if (prerenderClient) return prerenderClient
  const config = getPrerenderSanityConfig()
  if (!config) return null
  prerenderClient = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  })
  return prerenderClient
}

export const fetchEventBySlugForPrerender = async (
  slug: string,
): Promise<Record<string, unknown> | null> => {
  const trimmed = slug.trim()
  if (!trimmed) return null
  const client = getPrerenderSanityClient()
  if (!client) return null
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(eventBySlugQuery, {
      slug: trimmed,
    })
    return doc ?? null
  } catch {
    return null
  }
}
