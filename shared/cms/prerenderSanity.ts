import { createClient, type SanityClient } from "@sanity/client"
import {
  advisorsQuery,
  alumniCompaniesQuery,
  directoryFilterGroupsQuery,
  eventBySlugQuery,
  eventsQuery,
  pageBySlugQuery,
  programBySlugQuery,
  storyBySlugQuery,
  storiesQuery,
} from "./groqQueries"

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
  const token = process.env.SANITY_API_READ_TOKEN?.trim()
  prerenderClient = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    ...(token ? { token } : {}),
  })
  return prerenderClient
}

const fetchBySlug = async (
  query: string,
  slug: string,
): Promise<Record<string, unknown> | null> => {
  const trimmed = slug.trim()
  if (!trimmed) return null
  const client = getPrerenderSanityClient()
  if (!client) return null
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(query, { slug: trimmed })
    return doc ?? null
  } catch {
    return null
  }
}

export const fetchEventBySlugForPrerender = (slug: string) =>
  fetchBySlug(eventBySlugQuery, slug)

export const fetchProgramBySlugForPrerender = (slug: string) =>
  fetchBySlug(programBySlugQuery, slug)

export const fetchStoryBySlugForPrerender = (slug: string) =>
  fetchBySlug(storyBySlugQuery, slug)

export const fetchEventsForPrerender = async (): Promise<Record<string, unknown>[]> => {
  const client = getPrerenderSanityClient()
  if (!client) return []
  try {
    const rows = await client.fetch<Record<string, unknown>[]>(eventsQuery)
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

export const fetchPageBySlugForPrerender = (slug: string) =>
  fetchBySlug(pageBySlugQuery, slug)

export const fetchAdvisorsForPrerender = async (): Promise<Record<string, unknown>[]> => {
  const client = getPrerenderSanityClient()
  if (!client) return []
  try {
    const rows = await client.fetch<Record<string, unknown>[]>(advisorsQuery)
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

export const fetchAlumniCompaniesForPrerender = async (): Promise<
  Record<string, unknown>[]
> => {
  const client = getPrerenderSanityClient()
  if (!client) return []
  try {
    const rows = await client.fetch<Record<string, unknown>[]>(alumniCompaniesQuery)
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

export const fetchDirectoryFilterGroupsForPrerender = async (): Promise<
  Record<string, unknown>[]
> => {
  const client = getPrerenderSanityClient()
  if (!client) return []
  try {
    const rows = await client.fetch<Record<string, unknown>[]>(directoryFilterGroupsQuery)
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

export const fetchStorySlugsForPrerender = async (): Promise<string[]> => {
  const client = getPrerenderSanityClient()
  if (!client) return []
  try {
    const rows = await client.fetch<{ slug?: string }[]>(storiesQuery)
    return rows
      .map((row) => row.slug?.trim())
      .filter((slug): slug is string => Boolean(slug))
  } catch {
    return []
  }
}

export const fetchEventSlugsForPrerender = async (): Promise<string[]> => {
  const rows = await fetchEventsForPrerender()
  return rows
    .map((row) => (typeof row.slug === "string" ? row.slug.trim() : ""))
    .filter(Boolean)
}

export const fetchCmsPageSlugsForPrerender = async (): Promise<string[]> => {
  const client = getPrerenderSanityClient()
  if (!client) return []
  try {
    const rows = await client.fetch<{ slug?: string }[]>(
      `*[_type == "page" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`,
    )
    return rows
      .map((row) => row.slug?.trim())
      .filter((slug): slug is string => Boolean(slug))
  } catch {
    return []
  }
}
