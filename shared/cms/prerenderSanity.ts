import { createClient, type SanityClient } from "@sanity/client"
import {
  advisorsQuery,
  alumniCompaniesQuery,
  aboutPageQuery,
  applyPageQuery,
  faqPageQuery,
  directoryFilterGroupsQuery,
  eventsLandingQuery,
  featuredStoriesQuery,
  globalSettingsQuery,
  homePageQuery,
  navigationQuery,
  networkAdvisorsDirectoryPageQuery,
  networkAdvisorsPageQuery,
  networkAlumniDirectoryPageQuery,
  networkFoundersPageQuery,
  networkInvestorsPageQuery,
  networkPartnersPageQuery,
  siteSettingsQuery,
  storiesPageQuery,
  eventBySlugQuery,
  eventsQuery,
  careersPageQuery,
  openRolesQuery,
  pageBySlugQuery,
  pagesPrerenderSnapshotQuery,
  programBySlugQuery,
  storyBySlugQuery,
  storiesQuery,
  notFoundQuery,
  paymentPageQuery,
  programsLandingQuery,
  programsQuery,
} from "./groqQueries"
import { filterValidOpenRoles } from "../careersOpenRolesVisibility"
import { mergeCareersPage } from "./careersPageDefaults"
import { careersRoleDetailPath } from "./careersRoleShare"
import type { CareersOpenRole, CareersPageContent } from "./types"
import eventsBuildSnapshot from "./build-snapshots/events.json"
import openRolesBuildSnapshot from "./build-snapshots/openRoles.json"
import pagesBuildSnapshot from "./build-snapshots/pages.json"
import programsBuildSnapshot from "./build-snapshots/programs.json"
import storiesBuildSnapshot from "./build-snapshots/stories.json"
import aboutPageBuildSnapshot from "./build-snapshots/aboutPage.json"
import applyPageBuildSnapshot from "./build-snapshots/applyPage.json"
import careersPageBuildSnapshot from "./build-snapshots/careersPage.json"
import eventsLandingPageBuildSnapshot from "./build-snapshots/eventsLandingPage.json"
import globalSettingsBuildSnapshot from "./build-snapshots/globalSettings.json"
import homePageBuildSnapshot from "./build-snapshots/homePage.json"
import navigationBuildSnapshot from "./build-snapshots/navigation.json"
import paymentPageBuildSnapshot from "./build-snapshots/paymentPage.json"
import programsLandingPageBuildSnapshot from "./build-snapshots/programsLandingPage.json"
import programsLayoutPageBuildSnapshot from "./build-snapshots/programsLayoutPage.json"
import siteSettingsBuildSnapshot from "./build-snapshots/siteSettings.json"
import storiesPageBuildSnapshot from "./build-snapshots/storiesPage.json"
import faqPageBuildSnapshot from "./build-snapshots/faqPage.json"
import { defaultProgramRecordForSlug } from "./itemCardImage"
import { trySanityApiConfig } from "./sanityEnv"
import {
  isCmsPageSitemapEligible,
  isCmsSeoIndexable,
  rowId,
  rowSlug,
} from "./sitemapIndexability"

const snapshotEvents = (): Record<string, unknown>[] =>
  Array.isArray(eventsBuildSnapshot)
    ? (eventsBuildSnapshot as Record<string, unknown>[])
    : []

const snapshotStories = (): Record<string, unknown>[] =>
  Array.isArray(storiesBuildSnapshot)
    ? (storiesBuildSnapshot as Record<string, unknown>[])
    : []

const snapshotPrograms = (): Record<string, unknown>[] =>
  Array.isArray(programsBuildSnapshot)
    ? (programsBuildSnapshot as Record<string, unknown>[])
    : []

const snapshotOpenRoles = (): Array<Partial<CareersOpenRole> & { id?: string; roleId?: string }> =>
  Array.isArray(openRolesBuildSnapshot)
    ? (openRolesBuildSnapshot as unknown as Array<
        Partial<CareersOpenRole> & { id?: string; roleId?: string }
      >)
    : []

const snapshotPages = (): Record<string, unknown>[] =>
  Array.isArray(pagesBuildSnapshot)
    ? (pagesBuildSnapshot as Record<string, unknown>[])
    : []

const snapshotSingleton = (
  value: unknown,
): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") return null
  if (Array.isArray(value)) return null
  return value as Record<string, unknown>
}

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

export const fetchNotFoundPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  fetchSingleton(notFoundQuery)

export const fetchPageBySlugForPrerender = async (slug: string) => {
  const fromSanity = await fetchBySlug(pageBySlugQuery, slug)
  if (fromSanity) return fromSanity
  const trimmed = slug.trim()
  if (!trimmed) return null
  const pages = await fetchPagesForPrerender()
  return (
    pages.find(
      (row) => typeof row.slug === "string" && row.slug.trim() === trimmed,
    ) ?? null
  )
}

export const fetchPagesForPrerender = async (): Promise<Record<string, unknown>[]> => {
  const client = getPrerenderSanityClient()
  if (client) {
    try {
      const rows = await client.fetch<Record<string, unknown>[]>(pagesPrerenderSnapshotQuery)
      if (Array.isArray(rows) && rows.length > 0) return rows
    } catch {
      // fall through to build snapshot
    }
  }
  return snapshotPages()
}

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

export const fetchNetworkAlumniDirectoryPageForPrerender = async (): Promise<
  Record<string, unknown> | null
> => {
  const client = getPrerenderSanityClient()
  if (!client) return null
  try {
    const row = await client.fetch<Record<string, unknown> | null>(
      networkAlumniDirectoryPageQuery,
    )
    return row ?? null
  } catch {
    return null
  }
}

export const fetchNetworkAdvisorsDirectoryPageForPrerender = async (): Promise<
  Record<string, unknown> | null
> => {
  const client = getPrerenderSanityClient()
  if (!client) return null
  try {
    const row = await client.fetch<Record<string, unknown> | null>(
      networkAdvisorsDirectoryPageQuery,
    )
    return row ?? null
  } catch {
    return null
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

export const fetchCareersPageForPrerender = async (): Promise<Partial<CareersPageContent> | null> => {
  const client = getPrerenderSanityClient()
  if (!client) {
    return snapshotSingleton(careersPageBuildSnapshot) as Partial<CareersPageContent> | null
  }
  try {
    const row = await client.fetch<Partial<CareersPageContent>>(careersPageQuery)
    return (
      row ??
      (snapshotSingleton(careersPageBuildSnapshot) as Partial<CareersPageContent> | null)
    )
  } catch {
    return snapshotSingleton(careersPageBuildSnapshot) as Partial<CareersPageContent> | null
  }
}

export const prefetchCareersPageContent = async (): Promise<CareersPageContent> => {
  const [raw, rolesRaw] = await Promise.all([
    fetchCareersPageForPrerender(),
    fetchOpenRolesForPrerender(),
  ])
  const openRoles = filterValidOpenRoles(rolesRaw?.length ? rolesRaw : raw?.openRoles)
  return { ...mergeCareersPage(raw ?? undefined), openRoles }
}

export const fetchOpenRolesForPrerender = async (): Promise<
  Array<Partial<CareersOpenRole> & { id?: string; roleId?: string }>
> => {
  const client = getPrerenderSanityClient()
  if (client) {
    try {
      const rows = await client.fetch<
        Array<Partial<CareersOpenRole> & { id?: string; roleId?: string }>
      >(openRolesQuery)
      if (Array.isArray(rows) && rows.length > 0) return rows
    } catch {
      // fall through to build snapshot
    }
  }

  return snapshotOpenRoles()
}

export const fetchCareersRolePathsForPrerender = async (): Promise<string[]> => {
  const rows = await fetchOpenRolesForPrerender()
  return rows
    .map((row) => (typeof row.id === "string" ? row.id.trim() : ""))
    .filter(Boolean)
    .map((id) => careersRoleDetailPath(id))
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
  const pages = await fetchPagesForPrerender()
  return pages
    .map((row) => rowSlug(row))
    .filter(Boolean)
}

/** Indexable custom CMS pages for sitemap (live visibility + SEO index on). */
export const fetchIndexableCmsPagePathsForSitemap = async (): Promise<string[]> => {
  const pages = await fetchPagesForPrerender()
  return pages
    .filter(isCmsPageSitemapEligible)
    .map((row) => rowSlug(row))
    .filter(Boolean)
    .map((slug) => `/${slug}`)
}

/** Indexable published stories for sitemap. Story detail pages are always indexed publicly. */
export const fetchIndexableStoryPathsForSitemap = async (): Promise<string[]> => {
  const client = getPrerenderSanityClient()
  if (client) {
    try {
      const rows = await client.fetch<Record<string, unknown>[]>(storiesQuery)
      if (Array.isArray(rows) && rows.length > 0) {
        return rows
          .map((row) => rowSlug(row))
          .filter(Boolean)
          .map((slug) => `/stories/${slug}`)
      }
    } catch {
      // fall through to build snapshot
    }
  }

  return snapshotStories()
    .map((row) => rowSlug(row))
    .filter(Boolean)
    .map((slug) => `/stories/${slug}`)
}

/** Indexable published events for sitemap (excludes hidden + noIndex). */
export const fetchIndexableEventPathsForSitemap = async (): Promise<string[]> => {
  const rows = await fetchEventsForPrerender()
  return rows
    .filter(isCmsSeoIndexable)
    .map((row) => rowSlug(row))
    .filter(Boolean)
    .map((slug) => `/events/${slug}`)
}

/** Indexable published programs for sitemap (excludes hidden + noIndex). */
export const fetchIndexableProgramPathsForSitemap = async (): Promise<string[]> => {
  const rows = await fetchProgramsForPrerender()
  return rows
    .filter(isCmsSeoIndexable)
    .map((row) => rowSlug(row))
    .filter(Boolean)
    .map((slug) => `/programs/${slug}`)
}

/** Published alumni profile paths for sitemap. */
export const fetchAlumniPathsForSitemap = async (): Promise<string[]> => {
  return fetchAlumniProfilePathsForPrerender()
}

/** Published advisor profile paths for sitemap. */
export const fetchAdvisorPathsForSitemap = async (): Promise<string[]> => {
  return fetchAdvisorProfilePathsForPrerender()
}

/** Paths CMS marks as noindex — used to drop matching static ROUTE_SEO entries. */
export const fetchCmsNoIndexPathsForSitemap = async (): Promise<string[]> => {
  const [events, programs, pages] = await Promise.all([
    fetchEventsForPrerender(),
    fetchProgramsForPrerender(),
    fetchPagesForPrerender(),
  ])

  const excluded = new Set<string>()

  for (const row of events) {
    if (isCmsSeoIndexable(row)) continue
    const slug = rowSlug(row)
    if (slug) excluded.add(`/events/${slug}`)
  }

  for (const row of programs) {
    if (isCmsSeoIndexable(row)) continue
    const slug = rowSlug(row)
    if (slug) excluded.add(`/programs/${slug}`)
  }

  for (const row of pages) {
    if (isCmsPageSitemapEligible(row)) continue
    const slug = rowSlug(row)
    if (slug) excluded.add(`/${slug}`)
  }

  return [...excluded]
}

export const fetchPaymentPageForPrerender = async (): Promise<Record<string, unknown> | null> => {
  const client = getPrerenderSanityClient()
  if (!client) return snapshotSingleton(paymentPageBuildSnapshot)
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(paymentPageQuery)
    return doc ?? snapshotSingleton(paymentPageBuildSnapshot)
  } catch {
    return snapshotSingleton(paymentPageBuildSnapshot)
  }
}

export const fetchProgramsLandingForPrerender = async (): Promise<Record<string, unknown> | null> => {
  const client = getPrerenderSanityClient()
  if (!client) return snapshotSingleton(programsLandingPageBuildSnapshot)
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(programsLandingQuery)
    return doc ?? snapshotSingleton(programsLandingPageBuildSnapshot)
  } catch {
    return snapshotSingleton(programsLandingPageBuildSnapshot)
  }
}

export const fetchProgramsForPrerender = async (): Promise<Record<string, unknown>[]> => {
  const client = getPrerenderSanityClient()
  if (!client) return snapshotPrograms()
  try {
    const rows = await client.fetch<Record<string, unknown>[]>(programsQuery)
    return Array.isArray(rows) ? rows : []
  } catch {
    return snapshotPrograms()
  }
}

const fetchSingleton = async (query: string): Promise<Record<string, unknown> | null> => {
  const client = getPrerenderSanityClient()
  if (!client) return null
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(query)
    return doc ?? null
  } catch {
    return null
  }
}

export const fetchHomePageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  (await fetchSingleton(homePageQuery)) ?? snapshotSingleton(homePageBuildSnapshot)

export const fetchGlobalSettingsForPrerender = async (): Promise<Record<string, unknown> | null> =>
  (await fetchSingleton(globalSettingsQuery)) ??
  snapshotSingleton(globalSettingsBuildSnapshot)

export const fetchNavigationForPrerender = async (): Promise<Record<string, unknown> | null> =>
  (await fetchSingleton(navigationQuery)) ?? snapshotSingleton(navigationBuildSnapshot)

export const fetchSiteSettingsForPrerender = async (): Promise<Record<string, unknown> | null> =>
  (await fetchSingleton(siteSettingsQuery)) ?? snapshotSingleton(siteSettingsBuildSnapshot)

export const fetchAboutPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  (await fetchSingleton(aboutPageQuery)) ?? snapshotSingleton(aboutPageBuildSnapshot)

export const fetchStoriesPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  (await fetchSingleton(storiesPageQuery)) ?? snapshotSingleton(storiesPageBuildSnapshot)

export const fetchEventsLandingPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  (await fetchSingleton(eventsLandingQuery)) ??
  snapshotSingleton(eventsLandingPageBuildSnapshot)

export const fetchApplyPageForPrerender = async (): Promise<Record<string, unknown> | null> => {
  const client = getPrerenderSanityClient()
  if (!client) return snapshotSingleton(applyPageBuildSnapshot)
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(applyPageQuery)
    return doc ?? snapshotSingleton(applyPageBuildSnapshot)
  } catch {
    return snapshotSingleton(applyPageBuildSnapshot)
  }
}

export const fetchNetworkFoundersPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  fetchSingleton(networkFoundersPageQuery)

export const fetchNetworkAdvisorsPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  fetchSingleton(networkAdvisorsPageQuery)

export const fetchNetworkInvestorsPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  fetchSingleton(networkInvestorsPageQuery)

export const fetchNetworkPartnersPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  fetchSingleton(networkPartnersPageQuery)

export const fetchFeaturedStoriesForPrerender = async (): Promise<Record<string, unknown>[]> => {
  const client = getPrerenderSanityClient()
  if (!client) return []
  try {
    const rows = await client.fetch<Record<string, unknown>[]>(featuredStoriesQuery)
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

export const fetchStoriesForPrerender = async (): Promise<Record<string, unknown>[]> => {
  const client = getPrerenderSanityClient()
  if (client) {
    try {
      const rows = await client.fetch<Record<string, unknown>[]>(storiesQuery)
      if (Array.isArray(rows) && rows.length > 0) return rows
    } catch {
      // fall through to build snapshot
    }
  }
  return snapshotStories()
}

export const fetchFaqPageForPrerender = async (): Promise<Record<string, unknown> | null> =>
  (await fetchSingleton(faqPageQuery)) ?? snapshotSingleton(faqPageBuildSnapshot)
