/**
 * Generates public/sitemap.xml and public/llms.txt from indexable routes.
 * Run: pnpm run generate:seo-files
 */
import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import "./loadEnv"
import { getIndexableStaticPaths, getSeoForPathname, normalizePathname } from "../client/config/seo"
import { DEFAULT_PROGRAMS_LANDING } from "../shared/cms/defaults"
import { programsEventDetailPath } from "../shared/cms/eventSlug"
import {
  fetchAdvisorPathsForSitemap,
  fetchAlumniPathsForSitemap,
  fetchCmsNoIndexPathsForSitemap,
  fetchIndexableCmsPagePathsForSitemap,
  fetchIndexableEventPathsForSitemap,
  fetchIndexableProgramPathsForSitemap,
  fetchIndexableStoryPathsForSitemap,
} from "../shared/cms/prerenderSanity"
import { STORIES } from "../client/content/stories"
import { FOUNDER_DIRECTORY } from "../client/data/founderDirectory"
import { ADVISOR_DIRECTORY_SEED } from "../client/data/advisorDirectory"

const SITE_ORIGIN = (() => {
  const raw = process.env.VITE_SITE_URL?.trim()
  if (raw) return raw.replace(/\/$/, "")
  return "https://www.relliahealth.com"
})()
const OUT_DIR = resolve(process.cwd(), "public")

type SitemapEntry = {
  path: string
  changefreq: "weekly" | "monthly" | "yearly"
  priority: number
}

const changefreqForPath = (path: string): SitemapEntry["changefreq"] => {
  if (path === "/" || path.startsWith("/events") || path === "/stories") return "weekly"
  if (path === "/terms" || path === "/privacy") return "yearly"
  return "monthly"
}

const priorityForPath = (path: string): number => {
  if (path === "/") return 1
  if (
    path === "/programs" ||
    path === "/apply" ||
    path === "/about"
  ) {
    return 0.9
  }
  if (path.startsWith("/programs/") || path === "/events") return 0.85
  if (path.startsWith("/events/") || path === "/contact") return 0.8
  if (path.startsWith("/stories/") || path === "/stories") return 0.75
  if (path.startsWith("/founders/alumni/") || path.startsWith("/advisors/directory/")) return 0.65
  if (path === "/terms" || path === "/privacy") return 0.4
  if (path === "/startup-diagnostic" || path === "/diagnostic-survey") return 0.85
  return 0.8
}

const toAbsoluteUrl = (path: string) =>
  `${SITE_ORIGIN}${path === "/" ? "" : path}`

const mergeUniquePaths = (...groups: string[][]): string[] => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const group of groups) {
    for (const raw of group) {
      const path = normalizePathname(raw)
      if (!path || seen.has(path)) continue
      seen.add(path)
      out.push(path)
    }
  }
  return out.sort((a, b) => a.localeCompare(b))
}

const collectDynamicPaths = async (): Promise<string[]> => {
  const staticReserved = new Set(getIndexableStaticPaths())

  const defaultEventPaths = [
    ...DEFAULT_PROGRAMS_LANDING.upcomingEvents.map(programsEventDetailPath),
    ...DEFAULT_PROGRAMS_LANDING.pastEvents.map(programsEventDetailPath),
  ]

  const seedStoryPaths = STORIES.map((story) => `/stories/${story.slug}`)
  const seedAlumniPaths = FOUNDER_DIRECTORY.map((f) => `/founders/alumni/${f.id}`)
  const seedAdvisorPaths = ADVISOR_DIRECTORY_SEED.map((a) => `/advisors/directory/${a.id}`)

  const [
    cmsEventPaths,
    cmsStoryPaths,
    cmsProgramPaths,
    cmsAlumniPaths,
    cmsAdvisorPaths,
    cmsPagePaths,
  ] = await Promise.all([
    fetchIndexableEventPathsForSitemap(),
    fetchIndexableStoryPathsForSitemap(),
    fetchIndexableProgramPathsForSitemap(),
    fetchAlumniPathsForSitemap(),
    fetchAdvisorPathsForSitemap(),
    fetchIndexableCmsPagePathsForSitemap(),
  ])

  const eventPaths = cmsEventPaths.length > 0 ? cmsEventPaths : defaultEventPaths
  const storyPaths = cmsStoryPaths.length > 0 ? cmsStoryPaths : seedStoryPaths
  const programPaths = cmsProgramPaths
  const alumniPaths = cmsAlumniPaths.length > 0 ? cmsAlumniPaths : seedAlumniPaths
  const advisorPaths = cmsAdvisorPaths.length > 0 ? cmsAdvisorPaths : seedAdvisorPaths
  const cmsPagePathsFiltered = cmsPagePaths.filter((path) => !staticReserved.has(path))

  return mergeUniquePaths(
    eventPaths,
    storyPaths,
    programPaths,
    alumniPaths,
    advisorPaths,
    cmsPagePathsFiltered,
  )
}

const buildSitemapXml = (paths: string[]): string => {
  const entries = paths.map((path) => {
    const changefreq = changefreqForPath(path)
    const priority = priorityForPath(path)
    return `  <url>
    <loc>${toAbsoluteUrl(path)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`
}

const describePath = (path: string): string => {
  if (path.startsWith("/stories/")) {
    const slug = path.replace(/^\/stories\//, "")
    const story = STORIES.find((row) => row.slug === slug)
    if (story?.excerpt) return story.excerpt
  }
  if (path.startsWith("/founders/alumni/")) {
    return "Alumni company profile in the Rellia Health founder network."
  }
  if (path.startsWith("/advisors/directory/")) {
    return "Advisor profile in the Rellia Health mentor directory."
  }
  if (path.startsWith("/events/")) {
    return getSeoForPathname(path).description
  }
  const seo = getSeoForPathname(path)
  if (!seo.indexable && path.includes("/")) {
    return "Public page on relliahealth.com."
  }
  return seo.description
}

const buildLlmsTxt = (paths: string[]): string => {
  const section = (title: string, sectionPaths: string[]) => {
    if (sectionPaths.length === 0) return ""
    const lines = sectionPaths.map((path) => {
      const label = path === "/" ? "Home" : path
      return `- [${label}](${toAbsoluteUrl(path)}): ${describePath(path)}`
    })
    return `\n## ${title}\n\n${lines.join("\n")}\n`
  }

  const core = [
    "/",
    "/about",
    "/programs",
    "/apply",
    "/events",
    "/contact",
  ].filter((p) => paths.includes(p))

  const network = [
    "/founders",
    "/founders/alumni",
    "/advisors",
    "/advisors/directory",
    "/investors",
    "/industry-partners",
    "/consulting",
  ].filter((p) => paths.includes(p))

  const programs = paths.filter((p) => p.startsWith("/programs/"))
  const events = paths.filter((p) => p.startsWith("/events/"))
  const stories = paths.filter((p) => p.startsWith("/stories"))
  const diagnostics = paths.filter((p) => p.startsWith("/diagnostic"))
  const directories = paths.filter(
    (p) =>
      p.startsWith("/founders/alumni/") ||
      p.startsWith("/advisors/directory/"),
  )
  const cmsPages = paths.filter((p) => {
    const segments = p.split("/").filter(Boolean)
    return segments.length === 1 && !getIndexableStaticPaths().includes(p)
  })
  const legal = paths.filter((p) => p === "/terms" || p === "/privacy")
  const otherStatic = paths.filter((p) => {
    const grouped = new Set([
      ...core,
      ...network,
      ...programs,
      ...events,
      ...stories,
      ...diagnostics,
      ...directories,
      ...cmsPages,
      ...legal,
    ])
    return !grouped.has(p)
  })

  const body = [
    `# Rellia Health`,
    ``,
    `> Rellia Health connects health tech founders, clinicians, advisors, and investors through programs, events, and a curated network. This file lists indexable public pages for AI assistants and answer engines.`,
    ``,
    `Rellia offers founder programs (QMS, fundraising, regulatory, clinical validation), an alumni and advisor directory, investor pitch events, and a startup diagnostic. Primary calls to action: apply to the network (\`/apply\`), contact (\`/contact\`), and program enrollment pages.`,
    section("Core pages", core),
    section("Network", network),
    section("Programs", programs),
    section("Events", ["/events", ...events]),
    section("Stories & news", ["/stories", ...stories.filter((p) => p !== "/stories")]),
    section("Startup diagnostic", diagnostics),
    section("Directory profiles", directories),
    cmsPages.length > 0 ? section("CMS pages", cmsPages) : "",
    section("Legal", legal),
    otherStatic.length > 0 ? section("Optional", otherStatic) : "",
  ]
    .filter(Boolean)
    .join("\n")

  return `${body.trimEnd()}\n`
}

const main = async () => {
  const staticPaths = getIndexableStaticPaths()
  const dynamicPaths = await collectDynamicPaths()
  const cmsNoIndexPaths = new Set(await fetchCmsNoIndexPathsForSitemap())
  const allPaths = mergeUniquePaths(staticPaths, dynamicPaths).filter(
    (path) => !cmsNoIndexPaths.has(path),
  )

  const sitemapPath = resolve(OUT_DIR, "sitemap.xml")
  const llmsPath = resolve(OUT_DIR, "llms.txt")

  writeFileSync(sitemapPath, buildSitemapXml(allPaths), "utf8")
  writeFileSync(llmsPath, buildLlmsTxt(allPaths), "utf8")

  console.log(`Wrote ${allPaths.length} URLs to ${sitemapPath}`)
  console.log(`Wrote llms.txt to ${llmsPath}`)
}

void main()
