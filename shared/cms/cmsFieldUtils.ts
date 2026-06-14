import { stegaClean } from "@sanity/client/stega"
import type { SanityPortableText } from "./types"

/** True when a CMS string has visible content (ignores stega metadata). */
export const hasCmsString = (value: string | null | undefined): boolean =>
  Boolean(stegaClean(value ?? "").trim())

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
