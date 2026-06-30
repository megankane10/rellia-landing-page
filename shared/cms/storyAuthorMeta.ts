export type StoryAuthorDefaults = {
  hideStoryPublishDates?: boolean
  defaultAuthorName?: string
  defaultAuthorDescription?: string
  defaultAuthorImageSrc?: string
}

export type StoryAuthorFields = {
  authorName?: string
  authorDescription?: string
  authorImageSrc?: string
  hidePublishDate?: boolean
  publishedAt?: string
}

export type ResolvedStoryAuthorMeta = {
  authorName: string
  authorDescription?: string
  authorImageSrc: string
  publishedAtLabel?: string
}

const DEFAULT_AUTHOR_NAME = "Rellia Health"
const DEFAULT_AUTHOR_DESCRIPTION = "Insights and updates from the Rellia Health team."
const DEFAULT_AUTHOR_IMAGE_SRC = "/favicon.svg"

const formatStoryPublishDate = (raw?: string): string | undefined => {
  if (typeof raw !== "string" || !raw.trim()) return undefined
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export const resolveStoryPublishDateLabel = (
  story: Pick<StoryAuthorFields, "hidePublishDate" | "publishedAt"> | null | undefined,
  defaults?: Pick<StoryAuthorDefaults, "hideStoryPublishDates"> | null,
): string | undefined => {
  const hideDate =
    story?.hidePublishDate === true ||
    (story?.hidePublishDate !== false && defaults?.hideStoryPublishDates === true)

  if (hideDate) return undefined
  return formatStoryPublishDate(story?.publishedAt)
}

export const resolveStoryAuthorMeta = (
  story: StoryAuthorFields | null | undefined,
  defaults?: StoryAuthorDefaults | null,
): ResolvedStoryAuthorMeta => {
  const hideDate =
    story?.hidePublishDate === true ||
    (story?.hidePublishDate !== false && defaults?.hideStoryPublishDates === true)

  const authorName =
    story?.authorName?.trim() ||
    defaults?.defaultAuthorName?.trim() ||
    DEFAULT_AUTHOR_NAME

  const authorDescription =
    story?.authorDescription?.trim() ||
    defaults?.defaultAuthorDescription?.trim() ||
    DEFAULT_AUTHOR_DESCRIPTION

  const authorImageSrc =
    story?.authorImageSrc?.trim() ||
    defaults?.defaultAuthorImageSrc?.trim() ||
    DEFAULT_AUTHOR_IMAGE_SRC

  const publishedAtLabel = hideDate ? undefined : formatStoryPublishDate(story?.publishedAt)

  return {
    authorName,
    authorDescription,
    authorImageSrc,
    publishedAtLabel,
  }
}
