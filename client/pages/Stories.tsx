import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import PageHeader from "@/components/PageHeader"
import { cn } from "@/lib/utils"
import { STORIES, type StoryTag } from "@/content/stories"
import FeaturedStories from "@/components/FeaturedStories"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { useStories, useStoriesPage } from "@/hooks/useCmsDocuments"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE } from "@shared/cms/inlineHeroHeadline"

const tags: Array<StoryTag | "All"> = ["All", "Founder Story", "Industry Insight", "Program Update"]

const PAGE_SIZE = 12

const StoryGridCard = ({
  story,
}: {
  story: {
    slug: string
    title: string
    excerpt: string
    coverImageSrc: string
    coverImageAlt: string
    tag: string
    publishedAt: string
  }
}) => {
  const cleanTitle = useMemo(() => {
    const raw = (story.title ?? "").trim()
    return raw.replace(/^(founder story|industry insight|program update)\s*:\s*/i, "")
  }, [story.title])

  return (
    <article className="h-full w-full">
      <Link
        to={`/stories/${story.slug}`}
        className={cn(
          "group flex h-[410px] w-full flex-col overflow-hidden rounded-2xl md:h-[430px]",
          "transition-transform duration-200 ease-out hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        )}
        aria-label={`Read ${story.title}`}
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-rellia-teal/5">
          <img
            src={story.coverImageSrc}
            alt={story.coverImageAlt}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-1.5 pt-3 pb-1">
          <div className="inline-flex items-center gap-2 w-fit">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
            <span className="font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em] text-rellia-teal">
              {story.tag}
            </span>
          </div>

          <h3
            className="mt-1 line-clamp-2 font-host-grotesk text-[16px] font-semibold leading-snug text-black group-hover:underline group-hover:underline-offset-4 md:text-lg"
          >
            {cleanTitle}
          </h3>

          <p
            className="mt-1.5 max-h-[6rem] overflow-hidden break-words font-urbanist text-sm leading-relaxed text-black/70 md:max-h-[6.9rem] md:text-base"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {story.excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
}

const DEFAULT_STORIES_SUBTITLE =
  "The latest founder spotlights, industry insights, & program updates. Stay current with the people and ideas shaping the future of health."

export default function Stories() {
  const { data: cmsStories } = useStories()
  const { data: storiesLanding } = useStoriesPage()
  useApplyCmsSeo(storiesLanding?.seo)

  const heroSubtitle = storiesLanding?.subheadline?.trim() || DEFAULT_STORIES_SUBTITLE

  const [activeTag, setActiveTag] = useState<(typeof tags)[number]>("All")
  const [page, setPage] = useState(1)

  const stories = useMemo(() => {
    const normalized = (cmsStories ?? [])
      .map((s) => ({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt ?? "",
        coverImageSrc: s.coverImageSrc ?? "",
        coverImageAlt: (s.coverImageAlt ?? "Story cover").trim() || "Story cover",
        tag: (s.tag ?? "Story").trim() || "Story",
        publishedAt: typeof s.publishedAt === "string" ? s.publishedAt : "",
      }))
      .filter((s) => s.slug && s.title && s.coverImageSrc)

    return normalized.length > 0 ? normalized : STORIES
  }, [cmsStories])

  const filtered = useMemo(() => {
    if (activeTag === "All") return stories
    return stories.filter((s) => s.tag === activeTag)
  }, [activeTag, stories])

  useEffect(() => {
    setPage(1)
  }, [activeTag])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageStories = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1))
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />
      <main id="main-content">
        <PageHeader
          variant="dark"
          title={
            <HeroHeadlinePortable
              value={storiesLanding?.headlinePortable ?? DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE}
            />
          }
          subtitle={heroSubtitle}
        />

        <FeaturedStories showViewAll viewAllTo="#all-stories" />

        <section id="all-stories" className="px-6 md:px-10 pt-8 md:pt-10 pb-16 md:pb-20 bg-white">
          <div className="max-w-[1300px] mx-auto">
            <ScrollReveal>
              <div className="mb-4">
                <h2 className="font-host-grotesk text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-black">
                  Browse stories
                </h2>
              </div>

              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:w-auto">
                  {/* Mobile: dropdown */}
                  <div className="md:hidden">
                    <label className="sr-only" htmlFor="stories-filter">
                      Filter stories
                    </label>
                    <select
                      id="stories-filter"
                      value={activeTag}
                      onChange={(e) => setActiveTag(e.target.value as (typeof tags)[number])}
                      className={cn(
                        "h-12 w-full rounded-2xl border border-black/10 bg-white px-4",
                        "font-host-grotesk text-[13px] font-semibold uppercase tracking-[0.14em] text-black/80",
                        "focus:outline-none focus:ring-2 focus:ring-rellia-mint focus:ring-offset-2 focus:ring-offset-white",
                      )}
                      aria-label="Filter stories"
                    >
                      {tags.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Desktop: segmented tabs */}
                  <div className="hidden md:block">
                    <Tabs value={activeTag} onValueChange={(v) => setActiveTag(v as (typeof tags)[number])}>
                      <TabsList
                        className={cn(
                          "relative h-auto w-fit gap-1 rounded-full bg-white p-1.5",
                          "border border-black/10 shadow-[0_12px_32px_-22px_rgba(0,0,0,0.22)]",
                        )}
                      >
                        {tags.map((t) => (
                          <TabsTrigger
                            key={t}
                            value={t}
                            className={cn(
                              "relative rounded-full px-4 py-2.5",
                              "font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em]",
                              "text-black/80 hover:text-rellia-teal",
                              "data-[state=active]:text-white data-[state=active]:!bg-transparent data-[state=active]:shadow-none",
                              "focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                            )}
                          >
                            {activeTag === t ? (
                              <motion.span
                                layoutId="stories-filter-pill"
                                className="absolute inset-0 z-0 rounded-full bg-rellia-teal shadow-sm"
                                transition={{ type: "spring", stiffness: 520, damping: 42 }}
                                aria-hidden
                              />
                            ) : null}
                            <span className="relative z-[1]">{t}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <p className="font-urbanist text-sm text-black/55 md:text-right">
                  Showing {pageStories.length} of {filtered.length} stories
                </p>
              </div>
            </ScrollReveal>

            {filtered.length === 0 ? (
              <FilteredListEmptyState
                className="mt-6"
                icon={BookOpen}
                title="No stories"
                description="No stories match this filter. Try another category or choose All to browse every story."
              />
            ) : (
              <motion.div
                layout
                transition={{ layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
                className="mt-6 grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-8 xl:grid-cols-3 will-change-transform"
              >
                <AnimatePresence mode="sync" initial={false}>
                  {pageStories.map((story, i) => (
                    <motion.div
                      key={story.slug}
                      layout="position"
                      className="h-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.22,
                        ease: [0.16, 1, 0.3, 1],
                        layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                      }}
                    >
                      <ScrollReveal delay={i * 0.05} className="h-full">
                        <StoryGridCard story={story} />
                      </ScrollReveal>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {totalPages > 1 ? (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-full border font-host-grotesk font-semibold transition-colors",
                    page <= 1
                      ? "cursor-not-allowed border-black/10 bg-white text-black/30"
                      : "border-black/10 bg-white text-rellia-teal hover:border-rellia-teal hover:text-rellia-teal",
                  )}
                  aria-label="Previous stories page"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>

                <p className="font-urbanist text-base text-black/60" aria-label="Stories page indicator">
                  Page {page} of {totalPages}
                </p>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-full border font-host-grotesk font-semibold transition-colors",
                    page >= totalPages
                      ? "cursor-not-allowed border-black/10 bg-white text-black/30"
                      : "border-black/10 bg-white text-rellia-teal hover:border-rellia-teal hover:text-rellia-teal",
                  )}
                  aria-label="Next stories page"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

