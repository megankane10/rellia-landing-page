/** Confirmed story category tags shown on /stories and in Studio → Collections → Stories → Categories. */
export const CONFIRMED_STORY_TAGS = [
  "Founder Story",
  "Industry Insight",
  "Program Update",
] as const

export type StoryTag = (typeof CONFIRMED_STORY_TAGS)[number]

const slugifyStoryTag = (input: string): string =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "tag"

export const storyFilterIdForTag = (tag: string): string => `storyFilter-${slugifyStoryTag(tag)}`

export const storyFilterSlugForTag = (tag: string): string => slugifyStoryTag(tag)

export type StoryFilterMutation = {
  createOrReplace: {
    _id: string
    _type: "storyFilter"
    title: string
    slug: { _type: "slug"; current: string }
    description: string
    order: number
  }
}

export const buildStoryFilterMutations = (): StoryFilterMutation[] =>
  CONFIRMED_STORY_TAGS.map((tag, index) => ({
    createOrReplace: {
      _id: storyFilterIdForTag(tag),
      _type: "storyFilter",
      title: tag,
      slug: { _type: "slug", current: storyFilterSlugForTag(tag) },
      description: `Stories tagged as ${tag}.`,
      order: index,
    },
  }))
