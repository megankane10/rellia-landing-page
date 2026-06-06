import { Link } from "react-router-dom"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import RelliaAction from "@/components/RelliaAction"
import { getFeaturedStories } from "@/content/stories"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import SectionHeading from "@/components/SectionHeading"
import PillTag, { PILL_ON_IMAGE_BLUR_CLASS } from "@/components/PillTag"
import { useFeaturedStories } from "@/hooks/useCmsDocuments"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import { isSanityConfigured } from "@/lib/sanity"

/** Auto-advance interval (progress bar uses same duration) */
const ROTATE_MS = 6500
/** Small pause before progress begins on each slide */
const START_DELAY_MS = 1000
/** Crossfade duration — longer overlap reads smoother (keep ≪ ROTATE_MS) */
const CROSSFADE_S = 1.05

export default function FeaturedStories({
  showHeading = true,
  showViewAll = true,
  title = "Featured Stories",
  description,
  compact = false,
  viewAllTo = "/stories",
  /** Merges into the section wrapper (e.g. tighter `pt-*` after Logo Marquee on home) */
  sectionClassName,
}: {
  showHeading?: boolean
  showViewAll?: boolean
  title?: string
  description?: string
  compact?: boolean
  viewAllTo?: string
  sectionClassName?: string
}) {
  const { data: cmsFeatured } = useFeaturedStories()

  const featured = useMemo(() => {
    if (!isSanityConfigured()) return []

    const normalized = (cmsFeatured ?? [])
      .map((s) => ({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt ?? "",
        tag: (s.tag ?? "Story").trim() || "Story",
        coverImageSrc: s.coverImageSrc ?? "",
        coverImageAlt: (s.coverImageAlt ?? "Featured story cover").trim() || "Featured story cover",
      }))
      .filter((s) => s.slug && s.title && s.coverImageSrc)

    if (normalized.length > 0) return normalized
    return allowCmsSeedFallbacks() ? getFeaturedStories() : []
  }, [cmsFeatured])
  const [activeIndex, setActiveIndex] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)

  const activeStory = featured[activeIndex]

  const canRotate = featured.length > 1

  const handleSetIndex = (nextIndex: number) => {
    if (featured.length === 0) return
    const normalized = ((nextIndex % featured.length) + featured.length) % featured.length
    setActiveIndex(normalized)
    setCycleKey((k) => k + 1)
  }

  const handlePrev = () => handleSetIndex(activeIndex - 1)
  const handleNext = () => handleSetIndex(activeIndex + 1)

  useEffect(() => {
    featured.forEach((story) => {
      const img = new Image()
      img.src = story.coverImageSrc
    })
  }, [featured])

  useEffect(() => {
    if (!canRotate) return
    const t = window.setTimeout(() => {
      handleSetIndex(activeIndex + 1)
    }, ROTATE_MS + START_DELAY_MS)

    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, canRotate, cycleKey])

  const storyHref = useMemo(() => (activeStory ? `/stories/${activeStory.slug}` : "/stories"), [activeStory])

  if (featured.length === 0) return null

  const arrowInsideClass =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white shadow-sm transition hover:bg-white/20 disabled:pointer-events-none disabled:opacity-40"

  return (
    <section
      className={cn(
        "w-full overflow-x-hidden bg-white",
        compact ? "py-8 md:py-10" : sectionClassName ? sectionClassName : "py-10 md:py-14",
      )}
    >
      <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10">
        <div>
          <ScrollReveal>
            <div className="relative w-full overflow-hidden rounded-3xl bg-rellia-teal shadow-[0_22px_56px_-18px_rgba(12,61,73,0.42),0_8px_24px_-12px_rgba(0,0,0,0.14)] md:rounded-[32px]">
              <div
                className={cn(
                  "relative w-full overflow-hidden",
                  compact ? "h-[320px] sm:h-[360px] md:h-[420px] lg:h-[460px]" : "h-[480px] sm:h-[520px] md:h-[580px] lg:h-[620px]",
                )}
              >
                <AnimatePresence mode="sync" initial={false}>
                  {activeStory ? (
                    <motion.img
                      key={activeStory.slug}
                      src={activeStory.coverImageSrc}
                      alt={activeStory.coverImageAlt}
                      className="absolute inset-0 z-0 h-full w-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        opacity: {
                          duration: CROSSFADE_S,
                          ease: [0.45, 0.05, 0.55, 0.95],
                        },
                      }}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  ) : null}
                </AnimatePresence>

                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10"
                />

                <div className="absolute inset-0 flex flex-col px-6 pt-8 pb-4 md:px-10 md:pt-10 md:pb-5 lg:px-12 lg:pt-12 lg:pb-5">
                  {activeStory ? (
                    <>
                      <div className="flex min-h-0 flex-1 w-full flex-col items-start text-left overflow-hidden">
                        <div className="mb-5">
                          <PillTag
                            label={activeStory.tag}
                            className={PILL_ON_IMAGE_BLUR_CLASS}
                            dot={<span className="h-2 w-2 shrink-0 rounded-full bg-rellia-mint" aria-hidden />}
                          />
                        </div>

                        <h3 className="max-w-[1100px] font-host-grotesk font-medium text-white text-3xl tracking-tight leading-[1.05] sm:text-4xl md:text-5xl lg:text-[52px] line-clamp-3 md:line-clamp-none">
                          {activeStory.title}
                        </h3>

                        <p className="mt-4 max-w-[780px] text-pretty text-white/85 text-sm font-urbanist leading-relaxed md:mt-5 md:text-base line-clamp-3">
                          {activeStory.excerpt}
                        </p>
                      </div>

                      <div className="mt-7 md:mt-9 hidden md:flex items-center gap-4 pb-5">
                        <RelliaAction
                          asChild
                          variant="heroSolidOnTeal"
                          size="comfortable"
                          className="inline-flex h-11 min-h-[44px] px-5 text-sm !py-0 md:h-auto md:min-h-0 md:px-8 md:text-base md:!py-4"
                        >
                          <Link to={storyHref} aria-label={`Read: ${activeStory.title}`}>
                            Read story <ArrowRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </RelliaAction>

                        {showViewAll ? (
                          <RelliaAction
                            asChild
                            variant="heroGhostOnTeal"
                            size="comfortable"
                            className="md:px-7 border-white/45 text-white hover:border-white/80"
                          >
                            <Link to={viewAllTo} aria-label="View all stories">
                              View all
                            </Link>
                          </RelliaAction>
                        ) : null}
                      </div>

                      <div className="mt-6 w-full md:hidden pb-4">
                        <div className="flex items-center justify-between gap-4">
                          <Link
                            to={storyHref}
                            className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-mint hover:underline hover:underline-offset-4"
                            aria-label={`Read: ${activeStory.title}`}
                          >
                            Read story <ArrowRight className="h-4 w-4" aria-hidden />
                          </Link>

                          {showViewAll ? (
                            <Link
                              to={viewAllTo}
                              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-white hover:underline hover:underline-offset-4"
                              aria-label="View all stories"
                            >
                              View all <ArrowRight className="h-4 w-4" aria-hidden />
                            </Link>
                          ) : null}
                        </div>
                      </div>

                      <div aria-hidden className="pointer-events-none z-[15] mt-8 w-full">
                        <div className="flex w-full items-center gap-2">
                          {featured.map((story, idx) => {
                            const isPast = idx < activeIndex
                            const isActive = idx === activeIndex
                            const isFuture = idx > activeIndex

                            return (
                              <div
                                key={story.slug}
                                className={cn(
                                  "relative h-1 flex-1 overflow-hidden rounded-full",
                                  "bg-white/25",
                                )}
                              >
                                {isPast ? <div className="h-full w-full bg-white" /> : null}
                                {isFuture ? null : null}
                                {isActive ? (
                                  <motion.div
                                    key={`${story.slug}-${cycleKey}`}
                                    className="h-full bg-white"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                      duration: ROTATE_MS / 1000,
                                      delay: START_DELAY_MS / 1000,
                                      ease: "linear",
                                    }}
                                  />
                                ) : null}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div
                        className={cn(
                          "mt-3 flex w-full min-w-0 items-center gap-4",
                          featured.length > 0 ? "justify-between" : "justify-end",
                        )}
                      >
                        {featured.length > 0 ? (
                          <p className="min-w-0 text-left text-xs font-semibold uppercase tracking-[0.14em] text-white/55 md:text-xs">
                            {`${activeIndex + 1} / ${featured.length}`}
                          </p>
                        ) : null}
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={handlePrev}
                            disabled={!canRotate}
                            className={arrowInsideClass}
                            aria-label="Previous featured story"
                          >
                            <ChevronLeft className="h-5 w-5" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            disabled={!canRotate}
                            className={arrowInsideClass}
                            aria-label="Next featured story"
                          >
                            <ChevronRight className="h-5 w-5" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
