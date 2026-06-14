import { hasCmsString } from "./cmsFieldUtils"
import { normalizeToPortableText } from "./normalizePortableText"
import type { SanityPortableText } from "./types"

export type LegacySectionHeadlineFields = {
  headlinePortable?: SanityPortableText | null
  /** @deprecated Plain string — use headlinePortable. */
  title?: string | SanityPortableText | null
  /** @deprecated Plain string — use headlinePortable. */
  headingTitle?: string | null
  /** @deprecated Plain string — use headlinePortable. */
  heading?: string | null
}

/** Section heading with fallback from legacy plain-string fields. */
export const resolveSectionHeadlinePortable = (
  cms: LegacySectionHeadlineFields | null | undefined,
  fallback?: SanityPortableText | null,
): SanityPortableText | null => {
  if (Array.isArray(cms?.headlinePortable) && cms.headlinePortable.length > 0) {
    return cms.headlinePortable
  }

  const legacyPlain =
    (typeof cms?.title === "string" ? cms.title : undefined) ??
    cms?.headingTitle ??
    cms?.heading
  if (hasCmsString(legacyPlain)) {
    const normalized = normalizeToPortableText(legacyPlain)
    if (normalized?.length) return normalized
  }

  if (Array.isArray(fallback) && fallback.length > 0) return fallback
  return null
}
