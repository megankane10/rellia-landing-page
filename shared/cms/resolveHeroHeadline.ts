import { twoPartHeroHeadline, threePartHeroHeadline } from "./inlineHeroHeadline"
import { normalizeToPortableText } from "./normalizePortableText"
import type { SanityPortableText } from "./types"
import { hasCmsString } from "./cmsFieldUtils"

export type LegacyHeroHeadlineFields = {
  heroTitlePortable?: SanityPortableText | null
  /** @deprecated Pre-unification field name — still read during migration. */
  heroHeadlinePortable?: SanityPortableText | null
  heroTitle?: string | null
  heroAccentPhrase?: string | null
  heroTitleSuffix?: string | null
}

export type LegacyMetricsHeadlineFields = {
  metricsHeadingPortable?: SanityPortableText | null
  metricsHeading?: string | null
}

export type LegacySplashHeadingFields = {
  welcomeSplashHeadingPortable?: SanityPortableText | null
  /** @deprecated Plain string — migrated to welcomeSplashHeadingPortable. */
  welcomeSplashHeading?: string | null
}

/** Portable hero headline with fallback from legacy split fields or old field name. */
export const resolveHeroTitlePortable = (
  cms: LegacyHeroHeadlineFields | null | undefined,
  fallback: SanityPortableText,
): SanityPortableText => {
  if (Array.isArray(cms?.heroTitlePortable) && cms.heroTitlePortable.length > 0) {
    return cms.heroTitlePortable
  }
  if (Array.isArray(cms?.heroHeadlinePortable) && cms.heroHeadlinePortable.length > 0) {
    return cms.heroHeadlinePortable
  }

  const title = cms?.heroTitle
  const accent = cms?.heroAccentPhrase
  const suffix = cms?.heroTitleSuffix

  if (hasCmsString(title) && hasCmsString(accent) && hasCmsString(suffix)) {
    const cleanTitle = title!
    const cleanAccent = accent!
    const cleanSuffix = suffix!
    return threePartHeroHeadline(cleanTitle, cleanAccent, cleanSuffix.startsWith(" ") ? cleanSuffix : ` ${cleanSuffix}`)
  }
  if (hasCmsString(title) && hasCmsString(accent)) {
    return twoPartHeroHeadline(title!, accent!)
  }
  if (hasCmsString(title)) {
    const normalized = normalizeToPortableText(title)
    if (normalized?.length) return normalized
  }

  return fallback
}

/** @deprecated Use resolveHeroTitlePortable */
export const resolveHeroHeadlinePortable = resolveHeroTitlePortable

/** Membership splash headline — inlineHeroHeadline with legacy plain-string fallback. */
export const resolveWelcomeSplashHeadingPortable = (
  cms: LegacySplashHeadingFields | null | undefined,
  fallback: SanityPortableText,
): SanityPortableText => {
  if (
    Array.isArray(cms?.welcomeSplashHeadingPortable) &&
    cms.welcomeSplashHeadingPortable.length > 0
  ) {
    return cms.welcomeSplashHeadingPortable
  }

  const legacy = cms?.welcomeSplashHeading
  if (hasCmsString(legacy)) {
    const normalized = normalizeToPortableText(legacy)
    if (normalized?.length) return normalized
  }

  return fallback
}

/** Metrics band heading — supports inlineHeroHeadline or legacy plain string. */
export const resolveMetricsHeadlinePortable = (
  cms: LegacyMetricsHeadlineFields | null | undefined,
  fallback: SanityPortableText,
): SanityPortableText => {
  if (Array.isArray(cms?.metricsHeadingPortable) && cms.metricsHeadingPortable.length > 0) {
    return cms.metricsHeadingPortable
  }

  const legacy = cms?.metricsHeading
  if (hasCmsString(legacy)) {
    const normalized = normalizeToPortableText(legacy)
    if (normalized?.length) return normalized
  }

  return fallback
}
