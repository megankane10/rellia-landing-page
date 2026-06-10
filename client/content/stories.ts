import type { StoryTag } from "@shared/cms/storyFilters"

export type { StoryTag }

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

/** Preview/dev fallback when Sanity has no stories — production uses CMS only. */
export const STORIES: Story[] = [
  {
    slug: "a-clearer-path-for-digital-health-founders",
    title: "A clearer path for digital health founders.",
    excerpt:
      "Welcome to Rellia. We have redesigned our digital home to help you benchmark readiness, access specialized programs, and explore our healthcare network—all in one place.",
    tag: "Program Update",
    featured: true,
    coverImageSrc: "/images/website-launch-cartoon.png",
    coverImageAlt: "Health tech team collaborating in a bright workspace",
    publishedAt: "2026-06-01",
    seoTitle: "Welcome to the new Rellia website",
    seoDescription:
      "Discover Rellia Health: startup diagnostic, structured programs, live events, and network paths built for health tech founders.",
    body: [
      { type: "h2", text: "Built for health tech builders" },
      {
        type: "p",
        text: "Whether you are validating your first clinical workflow, preparing for a seed round, or looking for operators who have shipped in regulated environments, Rellia is designed to meet you where you are.",
      },
      {
        type: "quote",
        text: "The best health tech teams do not need more generic advice—they need clarity on regulatory, clinical, and commercial gaps before capital and pilots accelerate the wrong priorities.",
        attribution: "Rellia Health",
      },
      {
        type: "cta",
        title: "See where you stand",
        body: "Take the Startup Diagnostic and get a readiness snapshot with gap analysis you can share with your team.",
        buttonLabel: "Start the diagnostic",
        buttonHref: "/startup-diagnostic",
      },
    ],
  },
]

export const getStoryBySlug = (slug: string): Story | undefined =>
  STORIES.find((s) => s.slug === slug)

export const getFeaturedStories = (): Story[] =>
  STORIES.filter((s) => s.featured)
