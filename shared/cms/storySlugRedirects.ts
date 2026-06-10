import { slugifyCmsTitle } from "./slugify"

/** Legacy story slugs → canonical slug (static fallbacks when CMS has no previousSlugs). */
export const STORY_SLUG_REDIRECTS: Record<string, string> = {
  "website-launch": "a-clearer-path-for-digital-health-founders",
  "welcome-to-the-new-rellia-website": "a-clearer-path-for-digital-health-founders",
}

export const resolveStorySlugRedirect = (slug: string): string | undefined => {
  const trimmed = slug.trim()
  if (!trimmed) return undefined
  return STORY_SLUG_REDIRECTS[trimmed]
}

export const canonicalStorySlugForTitle = (title: string): string => slugifyCmsTitle(title)
