import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import PageHeader from "@/components/PageHeader"
import { cn } from "@/lib/utils"
import { mergeCmsStoriesWithDevSeed } from "@/content/stories"
import { CONFIRMED_STORY_TAGS, type StoryTag } from "@shared/cms/storyFilters"
import FeaturedStories from "@/components/FeaturedStories"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { useStories, useStoriesPage } from "@/hooks/useCmsDocuments"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { deriveSubheadlinePageSeo } from "@/lib/cmsPageSeoDefaults"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE } from "@shared/cms/inlineHeroHeadline"
import { isSanityConfigured } from "@/lib/sanity"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import { isCmsListAwaitingData, isCmsQueryLoading } from "@/lib/cmsQueryState"
import { CmsStoryGridSkeleton } from "@/components/cms/CmsPageSkeletons"
import StoryGridCard from "@/components/StoryGridCard"

const tags: Array<StoryTag | "All"> = ["All", ...CONFIRMED_STORY_TAGS]

const PAGE_SIZE = 12

const DEFAULT_STORIES_SUBTITLE =
  "The latest founder spotlights, industry insights, & program updates. Stay current with the people and ideas shaping the future of health."

export default function Stories() {
  const storiesQuery = useStories()
  const { data: cmsStories } = storiesQuery
  const storiesLandingQuery = useStoriesPage()
  const { data: storiesLanding } = storiesLandingQuery
  useApplyCmsSeo(
    storiesLanding?.seo,
    deriveSubheadlinePageSeo({
      pathname: "/stories",
      title: "Stories",
      subheadline: storiesLanding?.subheadline?.trim() || DEFAULT_STORIES_SUBTITLE,
    }),
  )

  const heroSubtitle = storiesLanding?.subheadline?.trim() || DEFAULT_STORIES_SUBTITLE

  const [activeTag, setActiveTag] = useState<(typeof tags)[number]>("All")
  const [page, setPage] = useState(1)

  const storiesLoading =
    isSanityConfigured() &&
    (isCmsQueryLoading(storiesQuery) || isCmsListAwaitingData(storiesQuery))

  const stories = useMemo(() => {
    if (!isSanityConfigured()) return []

    const normalized = mergeCmsStoriesWithDevSeed(
      (cmsStories ?? [])
        .map((s) => ({
          slug: s.slug,
          title: s.title,
          excerpt: s.excerpt ?? "",
          coverImageSrc: s.coverImageSrc ?? "",
          coverImageAlt: (s.coverImageAlt ?? "Story cover").trim() || "Story cover",
          tag: (s.tag ?? "Story").trim() || "Story",
          publishedAt: typeof s.publishedAt === "string" ? s.publishedAt : "",
        }))
        .filter((s) => s.slug && s.title && s.coverImageSrc),
      allowCmsSeedFallbacks(),
    )

    if (normalized.length > 0) return normalized
    return []
  }, [cmsStories])

  const filtered = useMemo(() => {
    if (activeTag === "All") return stories
    return stories.filter((s) => s.tag === activeTag)
  }, [activeTag, stories])

  useEffect(() => {
    setPage(1)
  }, [activeTag])

  useEffect(() => {
    const el = document.getElementById("all-stories")
    if (el && page > 1) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageStories = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1))
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar darkHeroNav />
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
                <h2 className="font-host-grotesk text-2xl md:text-[32px] lg:text-[36px] font-semibold leading-tight tracking-tight text-black">
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
                  {storiesLoading
                    ? "Loading stories…"
                    : `Showing ${pageStories.length} of ${filtered.length} stories`}
                </p>
              </div>
            </ScrollReveal>

            {storiesLoading ? (
              <CmsStoryGridSkeleton className="mt-6" count={6} />
            ) : filtered.length === 0 ? (
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
                className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 xl:grid-cols-3 will-change-transform"
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

