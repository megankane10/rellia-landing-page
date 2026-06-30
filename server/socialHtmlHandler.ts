import {
  fetchAdvisorsForPrerender,
  fetchAlumniCompaniesForPrerender,
  fetchCareersPageForPrerender,
  fetchOpenRolesForPrerender,
  fetchProgramsLandingForPrerender,
  fetchStoryBySlugForPrerender,
  fetchEventsForPrerender,
} from "../shared/cms/prerenderSanity"
import {
  findProgramsEventBySlug,
  getProgramsEventSlug,
} from "../shared/cms/eventSlug"
import { parseCareersRoleIdFromPathname } from "../shared/cms/careersRoleShare"
import { filterValidOpenRoles } from "../shared/careersOpenRolesVisibility"
import { mergeCareersPage } from "../shared/cms/careersPageDefaults"
import { DEFAULT_PROGRAMS_LANDING } from "../shared/cms/defaults"
import {
  findProgramsEventRecord,
  resolveItemDetailSeoForPath,
  type ItemDetailSeoPrefetch,
} from "../shared/cms/itemDetailSeo"
import {
  injectSocialMetaIntoHtml,
  itemDetailSeoToSocialMeta,
} from "../shared/cms/injectSocialMetaHtml"

const SOCIAL_BOT_PATTERN =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|Discordbot|Pinterest|TelegramBot|Googlebot|bingbot/i

export const isSocialCrawlerUserAgent = (userAgent: string | undefined): boolean =>
  Boolean(userAgent && SOCIAL_BOT_PATTERN.test(userAgent))

const normalizePath = (pathname: string): string => {
  const trimmed = pathname.trim()
  if (!trimmed || trimmed === "/") return "/"
  return trimmed.replace(/\/+$/, "") || "/"
}

const getSiteOrigin = (): string => {
  const explicit = process.env.VITE_SITE_URL?.trim() || process.env.SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")
  if (process.env.VERCEL_ENV === "production") return "https://www.relliahealth.com"
  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  return "https://www.relliahealth.com"
}

const resolveOgImageAbsolute = (
  seo: NonNullable<Awaited<ReturnType<typeof resolveItemDetailSeoForPath>>>,
  siteOrigin: string,
): { url: string; width?: number; height?: number } | undefined => {
  const src = seo.ogImageSrc?.trim()
  if (!src) return undefined
  const absolute = /^https?:\/\//i.test(src)
    ? src
    : `${siteOrigin}${src.startsWith("/") ? src : `/${src}`}`
  return {
    url: absolute,
    width: 1200,
    height: 630,
  }
}

const buildPrefetchForPath = async (pathname: string): Promise<ItemDetailSeoPrefetch> => {
  const prefetched: ItemDetailSeoPrefetch = {}

  if (pathname.startsWith("/stories/") && pathname !== "/stories") {
    const slug = pathname.slice("/stories/".length)
    prefetched.story = (await fetchStoryBySlugForPrerender(slug)) ?? null
    return prefetched
  }

  if (pathname.startsWith("/founders/alumni/") && pathname !== "/founders/alumni") {
    const id = pathname.slice("/founders/alumni/".length)
    const companies = await fetchAlumniCompaniesForPrerender()
    prefetched.alumni = companies.find((entry) => String(entry.id ?? "") === id) ?? null
    return prefetched
  }

  if (pathname.startsWith("/advisors/directory/") && pathname !== "/advisors/directory") {
    const id = pathname.slice("/advisors/directory/".length)
    const advisors = await fetchAdvisorsForPrerender()
    prefetched.advisor = advisors.find((entry) => String(entry.id ?? "") === id) ?? null
    return prefetched
  }

  if (pathname.startsWith("/careers/roles/")) {
    const roleId = parseCareersRoleIdFromPathname(pathname)
    const [careersPage, roles] = await Promise.all([
      fetchCareersPageForPrerender(),
      fetchOpenRolesForPrerender(),
    ])
    const openRoles = filterValidOpenRoles(roles?.length ? roles : careersPage?.openRoles)
    prefetched.careersRole =
      openRoles.find((role) => role.id === roleId) ??
      mergeCareersPage(careersPage ?? undefined).openRoles.find((role) => role.id === roleId) ??
      null
    return prefetched
  }

  if (pathname.startsWith("/events/") && pathname !== "/events") {
    const slug = pathname.slice("/events/".length)
    const events = await fetchEventsForPrerender()
    prefetched.event =
      events.find((event) => getProgramsEventSlug(event as never) === slug) ??
      findProgramsEventRecord(slug, DEFAULT_PROGRAMS_LANDING)
    return prefetched
  }

  if (pathname.startsWith("/programs/") && pathname !== "/programs") {
    const slug = pathname.slice("/programs/".length)
    const landing = await fetchProgramsLandingForPrerender()
    const programs = [
      ...(Array.isArray(landing?.programs) ? landing.programs : []),
      ...(Array.isArray(DEFAULT_PROGRAMS_LANDING.programs) ? DEFAULT_PROGRAMS_LANDING.programs : []),
    ]
    prefetched.program =
      programs.find((program) => String((program as { slug?: string }).slug ?? "") === slug) ??
      null
    return prefetched
  }

  return prefetched
}

let cachedIndexHtml: string | null = null

const loadIndexHtmlTemplate = async (siteOrigin: string): Promise<string> => {
  if (cachedIndexHtml) return cachedIndexHtml
  const response = await fetch(`${siteOrigin}/index.html`, {
    headers: { "User-Agent": "rellia-social-html/1.0" },
  })
  if (!response.ok) {
    throw new Error(`Could not load index.html from ${siteOrigin}`)
  }
  cachedIndexHtml = await response.text()
  return cachedIndexHtml
}

export const renderSocialHtmlForPath = async (
  pathname: string,
): Promise<{ html: string; title: string } | null> => {
  const normalizedPath = normalizePath(pathname)
  const prefetched = await buildPrefetchForPath(normalizedPath)
  const itemSeo = resolveItemDetailSeoForPath(normalizedPath, prefetched)
  if (!itemSeo) return null

  const siteOrigin = getSiteOrigin()
  const canonical = `${siteOrigin}${normalizedPath === "/" ? "" : normalizedPath}`
  const ogImage = resolveOgImageAbsolute(itemSeo, siteOrigin)
  const socialMeta = itemDetailSeoToSocialMeta(itemSeo, canonical, ogImage)
  const template = await loadIndexHtmlTemplate(siteOrigin)
  const html = injectSocialMetaIntoHtml(template, socialMeta)

  return { html, title: itemSeo.title }
}

export const shouldServeSocialHtml = (pathname: string, userAgent: string | undefined): boolean => {
  const normalizedPath = normalizePath(pathname)
  if (!isSocialCrawlerUserAgent(userAgent)) return false
  return (
    normalizedPath.startsWith("/stories/") ||
    normalizedPath.startsWith("/founders/alumni/") ||
    normalizedPath.startsWith("/advisors/directory/") ||
    normalizedPath.startsWith("/careers/roles/") ||
    normalizedPath.startsWith("/events/") ||
    normalizedPath.startsWith("/programs/")
  )
}
