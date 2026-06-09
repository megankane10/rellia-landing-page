/**
 * Migrates CMS headline fields to unified heroTitlePortable (Mint/Teal picker)
 * and removes legacy split accent fields from documents.
 *
 *   pnpm sanity:migrate:cms-headlines
 *   SANITY_API_DATASET=production pnpm sanity:migrate:cms-headlines
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import {
  DEFAULT_HOME_METRICS_HEADLINE_PORTABLE,
  threePartHeroHeadline,
  twoPartHeroHeadline,
} from "../shared/cms/inlineHeroHeadline"
import {
  DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE,
  DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE,
} from "../shared/cms/directoryPageDefaults"
import { resolveHeroTitlePortable, resolveMetricsHeadlinePortable } from "../shared/cms/resolveHeroHeadline"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type HeroDoc = {
  _id: string
  _type: string
  heroTitle?: string
  heroAccentPhrase?: string
  heroTitleSuffix?: string
  heroTitlePortable?: unknown
  heroHeadlinePortable?: unknown
}

type HomeDoc = {
  _id: string
  metricsHeading?: string
  metricsHeadingPortable?: unknown
  showBadge?: boolean
  metricsBadgeLabel?: string
  metricsBackgroundImageUrl?: string
}

type DirectorySource = {
  directoryTitle?: string
  directorySubtitle?: string
  directoryCtaTitle?: string
  directoryCtaBody?: string
  directoryCtaPrimaryLabel?: string
  directoryCtaPrimaryHref?: string
  seo?: unknown
}

const heroTypes = [
  "networkFoundersPage",
  "networkAdvisorsPage",
  "networkInvestorsPage",
  "networkPartnersPage",
  "consultingPage",
  "diagnosticLandingPage",
  "careersPage",
  "aboutPage",
] as const

const legacyHeroUnset = [
  "heroTitle",
  "heroAccentPhrase",
  "heroTitleSuffix",
  "heroHeadlinePortable",
] as const

const defaultHeroPortable = (doc: HeroDoc) => {
  const title = doc.heroTitle?.trim() ?? ""
  const accent = doc.heroAccentPhrase?.trim() ?? ""
  const suffix = doc.heroTitleSuffix?.trim() ?? ""
  if (title && accent && suffix) {
    return threePartHeroHeadline(title, accent, suffix.startsWith(" ") ? suffix : ` ${suffix}`)
  }
  if (title && accent) return twoPartHeroHeadline(title, accent)
  if (title) return twoPartHeroHeadline(title, "")
  return twoPartHeroHeadline("", "")
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

  const tx = client.transaction()
  let patchCount = 0

  const home = await client.fetch<HomeDoc | null>(`*[_id == "homePage"][0]{
    _id,
    metricsHeading,
    metricsHeadingPortable,
    showBadge,
    metricsBadgeLabel,
    metricsBackgroundImageUrl
  }`)

  if (home?._id) {
    const metricsHeadingPortable = resolveMetricsHeadlinePortable(home, DEFAULT_HOME_METRICS_HEADLINE_PORTABLE)
    tx.patch(home._id, {
      set: {
        metricsHeadingPortable,
        showBadge: home.showBadge ?? true,
        metricsBadgeLabel: home.metricsBadgeLabel?.trim() || "Network impact",
        metricsBackgroundImageUrl:
          home.metricsBackgroundImageUrl?.trim() || "/images/metrics-bg-pexels-2.jpg",
      },
      unset: ["metricsHeading"],
    })
    patchCount += 1
    console.log("Patched homePage metrics fields")
  }

  for (const type of heroTypes) {
    const doc = await client.fetch<HeroDoc | null>(
      `*[_id == $id][0]{
        _id,
        _type,
        heroTitle,
        heroAccentPhrase,
        heroTitleSuffix,
        heroTitlePortable,
        heroHeadlinePortable
      }`,
      { id: type },
    )
    if (!doc?._id) continue

    const heroTitlePortable = resolveHeroTitlePortable(doc, defaultHeroPortable(doc))
    tx.patch(doc._id, {
      set: { heroTitlePortable },
      unset: [...legacyHeroUnset],
    })
    patchCount += 1
    console.log(`Patched ${type} heroTitlePortable`)
  }

  const foundersSource = await client.fetch<DirectorySource | null>(
    `*[_id == "networkFoundersPage"][0]{
      directoryTitle,
      directorySubtitle,
      directoryCtaTitle,
      directoryCtaBody,
      directoryCtaPrimaryLabel,
      directoryCtaPrimaryHref,
      seo
    }`,
  )

  tx.createOrReplace({
    _id: "networkAlumniDirectoryPage",
    _type: "networkAlumniDirectoryPage",
    directoryTitle: foundersSource?.directoryTitle?.trim() || DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE.directoryTitle,
    directorySubtitle:
      foundersSource?.directorySubtitle?.trim() || DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE.directorySubtitle,
    directoryCtaTitle:
      foundersSource?.directoryCtaTitle?.trim() || DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE.directoryCtaTitle,
    directoryCtaBody:
      foundersSource?.directoryCtaBody?.trim() || DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE.directoryCtaBody,
    directoryCtaPrimaryLabel:
      foundersSource?.directoryCtaPrimaryLabel?.trim() ||
      DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE.directoryCtaPrimaryLabel,
    directoryCtaPrimaryHref:
      foundersSource?.directoryCtaPrimaryHref?.trim() ||
      DEFAULT_NETWORK_ALUMNI_DIRECTORY_PAGE.directoryCtaPrimaryHref,
    ...(foundersSource?.seo ? { seo: foundersSource.seo } : {}),
  })
  patchCount += 1
  console.log("Created/updated networkAlumniDirectoryPage")

  const advisorsSource = await client.fetch<DirectorySource | null>(
    `*[_id == "networkAdvisorsPage"][0]{
      directoryTitle,
      directorySubtitle,
      directoryCtaTitle,
      directoryCtaBody,
      directoryCtaPrimaryLabel,
      directoryCtaPrimaryHref,
      seo
    }`,
  )

  tx.createOrReplace({
    _id: "networkAdvisorsDirectoryPage",
    _type: "networkAdvisorsDirectoryPage",
    directoryTitle:
      advisorsSource?.directoryTitle?.trim() || DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE.directoryTitle,
    directorySubtitle:
      advisorsSource?.directorySubtitle?.trim() || DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE.directorySubtitle,
    directoryCtaTitle:
      advisorsSource?.directoryCtaTitle?.trim() || DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE.directoryCtaTitle,
    directoryCtaBody:
      advisorsSource?.directoryCtaBody?.trim() || DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE.directoryCtaBody,
    directoryCtaPrimaryLabel:
      advisorsSource?.directoryCtaPrimaryLabel?.trim() ||
      DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE.directoryCtaPrimaryLabel,
    directoryCtaPrimaryHref:
      advisorsSource?.directoryCtaPrimaryHref?.trim() ||
      DEFAULT_NETWORK_ADVISORS_DIRECTORY_PAGE.directoryCtaPrimaryHref,
    ...(advisorsSource?.seo ? { seo: advisorsSource.seo } : {}),
  })
  patchCount += 1
  console.log("Created/updated networkAdvisorsDirectoryPage")

  if (patchCount === 0) {
    console.log("Nothing to migrate.")
    return
  }

  await tx.commit()
  console.log(`Migration complete (${patchCount} writes) on dataset "${dataset}".`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
