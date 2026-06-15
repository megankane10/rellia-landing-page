import {
  clampMetaDescription,
  clampMetaTitle,
  getSeoForPathname,
} from "@/config/seo"
import type { PageSeoOverrides } from "@/context/PageSeoContext"

const withRelliaSuffix = (title: string) => {
  const trimmed = title.trim()
  if (!trimmed) return undefined
  if (/rellia health/i.test(trimmed)) return clampMetaTitle(trimmed)
  return clampMetaTitle(`${trimmed} — Rellia Health`)
}

/** Directory pages (/founders/alumni, /advisors/directory) — title + subtitle match visible H1 and intro. */
export const deriveDirectoryPageSeo = (
  directory: { directoryTitle?: string; directorySubtitle?: string },
  pathname: "/founders/alumni" | "/advisors/directory",
  options?: { ogImage?: string },
): PageSeoOverrides => {
  const routeFallback = getSeoForPathname(pathname)

  return {
    title:
      withRelliaSuffix(directory.directoryTitle ?? "") ?? routeFallback.title,
    description: directory.directorySubtitle?.trim()
      ? clampMetaDescription(directory.directorySubtitle.trim())
      : routeFallback.description,
    ogImage: options?.ogImage,
  }
}

/** Network and marketing heroes — subtitle drives meta description when present. */
export const deriveHeroPageSeo = (options: {
  pageTitle?: string
  heroSubtitle?: string
  heroIntro?: string
  heroDescription?: string
  pathname: string
}): PageSeoOverrides => {
  const routeFallback = getSeoForPathname(options.pathname)
  const visibleDescription =
    options.heroSubtitle?.trim() ||
    options.heroIntro?.trim() ||
    options.heroDescription?.trim()

  return {
    title: options.pageTitle?.trim()
      ? withRelliaSuffix(options.pageTitle)
      : routeFallback.title,
    description: visibleDescription
      ? clampMetaDescription(visibleDescription)
      : routeFallback.description,
  }
}

/** Simple landing pages with a subheadline under the hero. */
export const deriveSubheadlinePageSeo = (options: {
  pathname: string
  subheadline?: string
  title?: string
}): PageSeoOverrides => {
  const routeFallback = getSeoForPathname(options.pathname)

  return {
    title: options.title?.trim()
      ? withRelliaSuffix(options.title)
      : routeFallback.title,
    description: options.subheadline?.trim()
      ? clampMetaDescription(options.subheadline.trim())
      : routeFallback.description,
  }
}
