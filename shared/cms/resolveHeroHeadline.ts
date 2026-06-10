import { twoPartHeroHeadline, threePartHeroHeadline } from "./inlineHeroHeadline"
import { normalizeToPortableText } from "./normalizePortableText"
import type { SanityPortableText } from "./types"

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

  const title = cms?.heroTitle?.trim()
  const accent = cms?.heroAccentPhrase?.trim()
  const suffix = cms?.heroTitleSuffix?.trim()

  if (title && accent && suffix) {
    return threePartHeroHeadline(title, accent, suffix.startsWith(" ") ? suffix : ` ${suffix}`)
  }
  if (title && accent) {
    return twoPartHeroHeadline(title, accent)
  }
  if (title) {
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

  const legacy = cms?.welcomeSplashHeading?.trim()
  if (legacy) {
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

  const legacy = cms?.metricsHeading?.trim()
  if (legacy) {
    const normalized = normalizeToPortableText(legacy)
    if (normalized?.length) return normalized
  }

  return fallback
}
