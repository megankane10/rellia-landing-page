export type StoryTag = "Founder Story" | "Industry Insight" | "Program Update"

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
  body: Array<{ type: "p"; text: string }>
}

export const STORIES: Story[] = [
  {
    slug: "why-rellia-exists",
    title: "Why Rellia exists",
    excerpt:
      "Healthcare is hard to build in—especially when you’re doing it alone. Here’s the story behind Rellia and the kind of support we wished existed sooner.",
    tag: "Founder Story",
    featured: true,
    coverImageSrc: "/images/cta-home-conference.webp",
    coverImageAlt: "Rellia community event",
    publishedAt: "2026-04-01",
    seoTitle: "Why Rellia exists — Rellia Health",
    seoDescription:
      "The founding story of Rellia Health and the network we’re building for digital health founders.",
    body: [
      {
        type: "p",
        text: "Healthcare innovation is full of brilliant teams—and avoidable pitfalls. Rellia exists to surround founders with the expertise that prevents costly detours.",
      },
      {
        type: "p",
        text: "We connect founders to operators, clinicians, and partners who have lived the details: procurement, compliance, evidence, and adoption inside complex systems.",
      },
    ],
  },
  {
    slug: "the-real-cost-of-generic-startup-advice",
    title: "The real cost of generic startup advice in healthcare",
    excerpt:
      "What works in consumer or SaaS often breaks in health tech. Here are the common traps—and the better questions to ask.",
    tag: "Industry Insight",
    featured: true,
    coverImageSrc: "/images/hero-network.png",
    coverImageAlt: "Network visualization",
    publishedAt: "2026-03-18",
    body: [
      {
        type: "p",
        text: "In health tech, credibility is part of the product. Your commercialization plan must account for evidence, workflows, and the realities of adoption inside healthcare systems.",
      },
      {
        type: "p",
        text: "The fastest path is usually not the loudest one—it’s the path aligned to clinical utility, reimbursement, and implementation.",
      },
    ],
  },
  {
    slug: "program-update-qms-sprints",
    title: "Program update: QMS sprints that actually ship",
    excerpt:
      "A behind-the-scenes look at how we structure work so founders leave with artifacts—not just notes.",
    tag: "Program Update",
    featured: false,
    coverImageSrc: "/images/programs-qms.png",
    coverImageAlt: "QMS program",
    publishedAt: "2026-02-27",
    body: [
      {
        type: "p",
        text: "Our programs are outcome-first. Each sprint is designed so you can produce tangible deliverables and reduce uncertainty in the path ahead.",
      },
    ],
  },
]

export const getStoryBySlug = (slug: string): Story | undefined =>
  STORIES.find((s) => s.slug === slug)

export const getFeaturedStories = (): Story[] =>
  STORIES.filter((s) => s.featured)

