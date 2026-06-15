export type RelatedStoryCandidate = {
  slug: string
  title: string
  excerpt?: string
  coverImageSrc?: string
  coverImageAlt?: string
  tag?: string
  publishedAt?: string
}

const storyPublishedTime = (value?: string): number => {
  if (typeof value !== "string" || !value.trim()) return 0
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

/** Pick up to `limit` related stories: same category first, then newest others. */
export const pickRelatedStories = (
  stories: RelatedStoryCandidate[],
  currentSlug: string,
  currentTag?: string,
  limit = 3,
): RelatedStoryCandidate[] => {
  const normalizedSlug = currentSlug.trim()
  if (!normalizedSlug) return []

  const others = stories.filter((story) => {
    const slug = story.slug?.trim()
    const title = story.title?.trim()
    const cover = story.coverImageSrc?.trim()
    return Boolean(slug && title && cover && slug !== normalizedSlug)
  })

  if (others.length === 0) return []

  const tag = currentTag?.trim()
  const sameTag = tag ? others.filter((story) => (story.tag ?? "").trim() === tag) : []
  const differentTag = tag ? others.filter((story) => (story.tag ?? "").trim() !== tag) : others

  const byNewest = (a: RelatedStoryCandidate, b: RelatedStoryCandidate) =>
    storyPublishedTime(b.publishedAt) - storyPublishedTime(a.publishedAt)

  const ordered = [...sameTag.sort(byNewest), ...differentTag.sort(byNewest)]
  const seen = new Set<string>()
  const result: RelatedStoryCandidate[] = []

  for (const story of ordered) {
    const slug = story.slug.trim()
    if (seen.has(slug)) continue
    seen.add(slug)
    result.push(story)
    if (result.length >= limit) break
  }

  return result
}

const normalizeRelatedTag = (value?: string): string => value?.trim().toLowerCase() ?? ""

/** Pick related items: same primary tag first, then fill with others (optional sort). */
export const pickRelatedByPrimaryTag = <T>(
  items: T[],
  currentKey: string,
  primaryTag: string | undefined,
  limit: number,
  getKey: (item: T) => string,
  getPrimaryTag: (item: T) => string | undefined,
  getSortScore: (item: T) => number = () => 0,
): T[] => {
  const normalizedKey = currentKey.trim()
  if (!normalizedKey) return []

  const others = items.filter((item) => {
    const key = getKey(item).trim()
    return Boolean(key && key !== normalizedKey)
  })
  if (others.length === 0) return []

  const tag = normalizeRelatedTag(primaryTag)
  const sameTag = tag
    ? others.filter((item) => normalizeRelatedTag(getPrimaryTag(item)) === tag)
    : []
  const differentTag = tag
    ? others.filter((item) => normalizeRelatedTag(getPrimaryTag(item)) !== tag)
    : others

  const byScore = (a: T, b: T) => getSortScore(b) - getSortScore(a)
  const ordered = [...sameTag.sort(byScore), ...differentTag.sort(byScore)]
  const seen = new Set<string>()
  const result: T[] = []

  for (const item of ordered) {
    const key = getKey(item).trim()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
    if (result.length >= limit) break
  }

  return result
}
