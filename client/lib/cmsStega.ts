import { stegaClean } from "@sanity/client/stega"
import { cmsTextToPlain } from "@shared/cms/cmsFieldUtils"
import { isSanityPresentationIframe } from "@/lib/sanityPresentation"

/** True when Presentation iframe or draft-mode preview should preserve stega encoding. */
export const isVisualEditingPreview = (): boolean => {
  if (typeof window === "undefined") return false
  return isSanityPresentationIframe()
}

/**
 * Render CMS string values in the DOM without stripping Content Source Maps.
 * Use for visible text nodes during Presentation / visual editing only.
 */
export const cmsDisplayText = (value: string | null | undefined): string => {
  const raw = value ?? ""
  if (!raw) return ""
  if (isVisualEditingPreview()) return raw
  return stegaClean(raw)
}

/** Safe trim for logic (filters, href checks) — always uses clean text. */
export const cmsCleanText = (value: string | null | undefined): string =>
  cmsTextToPlain(value)

/**
 * Splits a stega-encoded string into cleaned text and its encoded stega metadata.
 * Useful when stega characters interfere with layout/CSS (e.g. negative letter-spacing)
 * or string manipulation (like splitting words), allowing you to render the cleaned text
 * and put the encoded metadata in a hidden span to preserve click-to-edit.
 */
export const splitStega = (
  value: string | null | undefined,
): { cleaned: string; encoded: string } => {
  const original = value ?? ""
  const cleaned = stegaClean(original)
  const encoded = original.slice(cleaned.length)
  return { cleaned, encoded }
}

/**
 * Transform visible text while preserving stega metadata for Presentation overlays.
 */
export const cmsDisplayTextTransformed = (
  value: string | null | undefined,
  transform: (cleaned: string) => string,
): string => {
  const raw = value ?? ""
  if (!raw) return ""
  const { cleaned, encoded } = splitStega(raw)
  const transformed = transform(cleaned)
  if (isVisualEditingPreview()) return transformed + encoded
  return transformed
}

const STORY_TITLE_PREFIX_RE =
  /^(founder story|industry insight|program update)\s*:\s*/i

export const cmsDisplayTextOr = (
  value: string | null | undefined,
  fallback: string,
): string => (cmsCleanText(value) ? cmsDisplayText(value) : fallback)

/** Strip redundant story category prefixes without breaking click-to-edit overlays. */
export const cmsDisplayStoryTitle = (
  value: string | null | undefined,
): string =>
  cmsDisplayTextTransformed(value, (cleaned) =>
    cleaned.replace(STORY_TITLE_PREFIX_RE, "").trim(),
  )

