import { stegaClean } from "@sanity/client/stega"
import { portableTextToPlainText } from "./portableTextPlain"
import type { SanityPortableText } from "./types"

/** Coerce CMS string or legacy portable-text value to plain text (stega stripped). */
export const cmsTextToPlain = (value: unknown): string => {
  if (value == null) return ""

  if (typeof value === "string") {
    const cleaned = stegaClean(value)
    return typeof cleaned === "string" ? cleaned.trim() : ""
  }

  if (Array.isArray(value)) return portableTextToPlainText(value)

  return ""
}

/** True when a CMS string has visible content (ignores stega metadata). */
export const hasCmsString = (value: unknown): boolean => Boolean(cmsTextToPlain(value))

/** Keep the raw CMS string (with stega) when populated; otherwise use fallback. */
export const pickCmsString = (
  cmsValue: string | null | undefined,
  fallback: string,
): string => (hasCmsString(cmsValue) ? cmsValue! : fallback)

/** Prefer API portable text (stega intact) over merged defaults. */
export const pickCmsPortableText = (
  raw: SanityPortableText | null | undefined,
  merged: SanityPortableText | null | undefined,
  fallback: SanityPortableText,
): SanityPortableText => {
  if (Array.isArray(raw) && raw.length > 0) return raw
  if (Array.isArray(merged) && merged.length > 0) return merged
  return fallback
}

/** Raw API string first, then merged, then fallback — for Presentation overlays. */
export const pickRawOrMergedString = (
  raw: string | null | undefined,
  merged: string | null | undefined,
  fallback: string,
): string => {
  if (hasCmsString(raw)) return raw!
  if (hasCmsString(merged)) return merged!
  return fallback
}
