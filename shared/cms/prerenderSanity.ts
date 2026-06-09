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
  paymentPageQuery,
  programsLandingQuery,
  programsQuery,
} from "./groqQueries"
import eventsBuildSnapshot from "./build-snapshots/events.json"
import storiesBuildSnapshot from "./build-snapshots/stories.json"
import { defaultProgramRecordForSlug } from "./itemCardImage"
import { trySanityApiConfig } from "./sanityEnv"

const snapshotEvents = (): Record<string, unknown>[] =>
  Array.isArray(eventsBuildSnapshot)
    ? (eventsBuildSnapshot as Record<string, unknown>[])
    : []

const snapshotStories = (): Record<string, unknown>[] =>
  Array.isArray(storiesBuildSnapshot)
    ? (storiesBuildSnapshot as Record<string, unknown>[])
    : []

let prerenderClient: SanityClient | null = null

const getPrerenderSanityClient = (): SanityClient | null => {
  if (prerenderClient) return prerenderClient
  const config = trySanityApiConfig()
  if (!config) return null
  const token = process.env.SANITY_API_READ_TOKEN?.trim()
  prerenderClient = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "published",
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

export const fetchEventBySlugForPrerender = async (slug: string) => {
  const fromSanity = await fetchBySlug(eventBySlugQuery, slug)
  if (fromSanity) return fromSanity
  const trimmed = slug.trim()
  if (!trimmed) return null
  const events = await fetchEventsForPrerender()
  return (
    events.find(
      (row) => typeof row.slug === "string" && row.slug.trim() === trimmed,
    ) ?? null
  )
}

export const fetchProgramBySlugForPrerender = async (slug: string) => {
  const fromSanity = await fetchBySlug(programBySlugQuery, slug)
  if (fromSanity) return fromSanity
  const trimmed = slug.trim()
  if (!trimmed) return null
  return defaultProgramRecordForSlug(trimmed)
}

export const fetchProgramSlugsForPrerender = async (): Promise<string[]> => {
  const rows = await fetchProgramsForPrerender()
  return rows
    .map((row) => (typeof row.slug === "string" ? row.slug.trim() : ""))
    .filter(Boolean)
}

export const fetchStoryBySlugForPrerender = async (slug: string) => {
  const fromSanity = await fetchBySlug(storyBySlugQuery, slug)
  if (fromSanity) return fromSanity
  const trimmed = slug.trim()
  if (!trimmed) return null
  return (
    snapshotStories().find(
      (row) => typeof row.slug === "string" && row.slug.trim() === trimmed,
    ) ?? null
  )
}

export const fetchEventsForPrerender = async (): Promise<Record<string, unknown>[]> => {
  const client = getPrerenderSanityClient()
  if (client) {
    try {
      const rows = await client.fetch<Record<string, unknown>[]>(eventsQuery)
      if (Array.isArray(rows) && rows.length > 0) return rows
    } catch {
      // fall through to build snapshot
    }
  }

  return snapshotEvents()
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

export const fetchAdvisorProfilePathsForPrerender = async (): Promise<string[]> => {
  const rows = await fetchAdvisorsForPrerender()
  return rows
    .map((row) => (typeof row.id === "string" ? row.id.trim() : ""))
    .filter(Boolean)
    .map((id) => `/advisors/directory/${id}`)
}

export const fetchAlumniProfilePathsForPrerender = async (): Promise<string[]> => {
  const rows = await fetchAlumniCompaniesForPrerender()
  return rows
    .map((row) => (typeof row.id === "string" ? row.id.trim() : ""))
    .filter(Boolean)
    .map((id) => `/founders/alumni/${id}`)
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

export const fetchPaymentPageForPrerender = async (): Promise<Record<string, unknown> | null> => {
  const client = getPrerenderSanityClient()
  if (!client) return null
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(paymentPageQuery)
    return doc ?? null
  } catch {
    return null
  }
}

export const fetchProgramsLandingForPrerender = async (): Promise<Record<string, unknown> | null> => {
  const client = getPrerenderSanityClient()
  if (!client) return null
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(programsLandingQuery)
    return doc ?? null
  } catch {
    return null
  }
}

export const fetchProgramsForPrerender = async (): Promise<Record<string, unknown>[]> => {
  const client = getPrerenderSanityClient()
  if (!client) return []
  try {
    const rows = await client.fetch<Record<string, unknown>[]>(programsQuery)
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}
