export type StoryTag = "Founder Story" | "Industry Insight" | "Program Update"

export type StoryBodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | {
      type: "imageCarousel"
      title?: string
      slides: { src: string; alt: string; caption?: string }[]
    }
  | { type: "cta"; title: string; body: string; buttonLabel: string; buttonHref: string }

export type Story = {
  slug: string
  title: string
  excerpt: string
  tag: StoryTag
  featured: boolean
  coverImageSrc: string
  coverImageAlt: string
  publishedAt: string
  seoTitle?: string
  seoDescription?: string
  body: StoryBodyBlock[]
}

export const STORIES: Story[] = []


export const getStoryBySlug = (slug: string): Story | undefined =>
  STORIES.find((s) => s.slug === slug)

export const getFeaturedStories = (): Story[] =>
  STORIES.filter((s) => s.featured)

