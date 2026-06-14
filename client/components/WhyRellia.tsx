import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import SectionHeading from "@/components/SectionHeading"
import { cn } from "@/lib/utils"
import type { HomeWhyFeature } from "@shared/cms/types"
import { cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

const DEFAULT_SECTION_DESCRIPTION =
  "A curated network and practical support system to help you move through the moments that make or break a healthcare startup."

type WhyRelliaProps = {
  sectionTitle: string
  features: HomeWhyFeature[]
  /** Overrides the default SectionHeading paragraph under the title */
  sectionDescription?: string
  /** Per-card hero images (first four slots). When omitted, uses built-in homepage art direction */
  cardImages?: string[]
  /** Outer section background (e.g. careers band) */
  sectionClassName?: string
}

export default function WhyRellia({
  sectionTitle,
  features,
  sectionDescription,
  cardImages,
  sectionClassName,
}: WhyRelliaProps) {
  const previewMode = isVisualEditingPreview()
  const cards = useMemo(() => features.slice(0, 4), [features])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mobileIndex, setMobileIndex] = useState(0)
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null)
  const mobileCardRefs = useRef<Array<HTMLElement | null>>([])

  const defaultCardImages = useMemo(
    () => [
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200", // network/outcomes (team collaborating on charts/outcomes)
      "https://images.pexels.com/photos/3182761/pexels-photo-3182761.jpeg?auto=compress&cs=tinysrgb&w=1200", // founders/advisors (1:1 business mentorship/advisory consultation)
      "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=1200", // programs/resources (active workshop/technical training with post-its)
      "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=1200", // outcomes/community (professional group networking/talking)
    ],
    [],
  )

  const imageByIndex = useMemo(() => {
    return cards.map((c, idx) => c.imageSrc ?? cardImages?.[idx] ?? defaultCardImages[idx] ?? "/images/whyrellia-network.jpg")
  }, [cardImages, cards, defaultCardImages])

  const handleScrollToIndex = useCallback((idx: number) => {
    const el = mobileCardRefs.current[idx]
    const root = mobileScrollerRef.current
    if (!el || !root) return
    root.scrollTo({ left: el.offsetLeft - root.offsetLeft, behavior: "smooth" })
  }, [])

  const handleGoPrev = useCallback(() => {
    const next = Math.max(0, mobileIndex - 1)
    handleScrollToIndex(next)
  }, [handleScrollToIndex, mobileIndex])

  const handleGoNext = useCallback(() => {
    const next = Math.min(cards.length - 1, mobileIndex + 1)
    handleScrollToIndex(next)
  }, [cards.length, handleScrollToIndex, mobileIndex])

  const arrowBtnClassName =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-rellia-teal shadow-sm transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"

  useEffect(() => {
    const root = mobileScrollerRef.current
    if (!root) return

    setMobileIndex(0)
    setActiveIndex(null)

    let frame = 0
    const syncActiveIndex = () => {
      const cards = mobileCardRefs.current.filter(Boolean) as HTMLElement[]
      if (cards.length === 0) return

      const rootRect = root.getBoundingClientRect()
      const rootCenter = rootRect.left + rootRect.width / 2
      let bestIdx = 0
      let bestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.left + rect.width / 2
        const distance = Math.abs(cardCenter - rootCenter)
        if (distance < bestDistance) {
          bestDistance = distance
          bestIdx = idx
        }
      })

      setMobileIndex((prev) => (prev === bestIdx ? prev : bestIdx))
    }

    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        syncActiveIndex()
      })
    }

    root.addEventListener("scroll", handleScroll, { passive: true })
    syncActiveIndex()

    return () => {
      root.removeEventListener("scroll", handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [cards.length])

  return (
    <section
      className={cn(
        "w-full overflow-x-hidden bg-white px-6 py-16 md:px-10 md:py-24 lg:px-10",
        sectionClassName,
      )}
    >
      <div className="mx-auto max-w-[1300px]">
        <SectionHeading
          align="left"
          title={sectionTitle}
          description={sectionDescription ?? DEFAULT_SECTION_DESCRIPTION}
        />

        <ScrollReveal className="mt-10 lg:mt-14">
          <>
            {/* Desktop: hover-expand cards */}
            <div
              className="hidden md:flex md:flex-row gap-4 md:gap-5"
              onMouseLeave={() => setActiveIndex(null)}
            >
              {cards.map((c, idx) => {
                const hasActive = activeIndex != null
                const isActive = activeIndex === idx
                const img = imageByIndex[idx] ?? "/images/whyrellia-network.jpg"

                return (
                  <article
                    key={c._key ?? `${c.title}-${idx}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border border-black/10 bg-white",
                      "transition-[flex-grow] transition-duration-[900ms] transition-timing-function-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                      "will-change-[flex-grow]",
                      "min-h-[440px]",
                    )}
                    style={{
                      flexBasis: 0,
                      flexGrow: !hasActive ? 1 : isActive ? 2.25 : 0.95,
                    }}
                  >
                    <button
                      type="button"
                      onFocus={() => setActiveIndex(idx)}
                      onClick={() => setActiveIndex(idx)}
                      className={cn(
                        "absolute inset-0 z-10 cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        previewMode && "pointer-events-none",
                      )}
                      aria-label={`Select ${c.title}`}
                    />

                    <div aria-hidden className="absolute inset-0">
                      <img
                        src={img}
                        alt=""
                        className={cn(
                          "absolute inset-0 h-full w-full object-cover",
                          "transition-transform transition-duration-[1200ms] transition-timing-function-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                          isActive ? "scale-[1.03]" : "scale-100",
                        )}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/42 to-black/18" />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="relative z-20 flex h-full flex-col justify-end p-7">
                      <h3
                        className={cn(
                          "font-host-grotesk font-normal text-white text-3xl tracking-tight leading-tight",
                          "transition-transform transition-duration-[700ms] transition-timing-function-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                          isActive ? "delay-200 -translate-y-1" : "delay-0 translate-y-0",
                        )}
                      >
                        {cmsDisplayText(c.title)}
                      </h3>

                      <div
                        className={cn(
                          "mt-2.5 overflow-hidden",
                          "transition-[max-height,opacity,transform] transition-duration-[1050ms] transition-timing-function-[cubic-bezier(0.42,0,1,1)] motion-reduce:transition-none",
                          isActive
                            ? "delay-300 max-h-56 opacity-100 translate-y-0"
                            : "delay-0 max-h-0 opacity-0 translate-y-6",
                        )}
                      >
                        <p className="max-w-[40ch] font-urbanist text-base leading-relaxed text-white/85">
                          {cmsDisplayText(c.description)}
                        </p>
                        {c.buttonLabel && c.buttonPath && (
                          <Link
                            to={c.buttonPath}
                            className="relative z-30 mt-4 inline-flex items-center text-sm font-bold text-rellia-mint hover:underline hover:underline-offset-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {cmsDisplayText(c.buttonLabel)}
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Mobile: carousel with peek + progress + controls */}
            <div className="md:hidden">
              <div className="relative">
                <div
                  ref={mobileScrollerRef}
                  className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory overscroll-x-contain -mx-6 px-6 scroll-px-6 touch-pan-x"
                  style={{ WebkitOverflowScrolling: "touch" }}
                  aria-label="Why Rellia features"
                >
                  {cards.map((c, idx) => {
                    const img = imageByIndex[idx] ?? "/images/whyrellia-network.jpg"

                    return (
                      <article
                        key={c._key ?? `${c.title}-${idx}`}
                        ref={(el) => {
                          mobileCardRefs.current[idx] = el
                        }}
                        tabIndex={0}
                        aria-label={c.title}
                        className={cn(
                          "relative shrink-0 snap-start overflow-hidden rounded-3xl border border-black/10 bg-white",
                          "min-h-[360px] w-[92%]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        )}
                      >
                        <img
                          src={img}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                          className={cn(
                            "absolute inset-0",
                            "bg-gradient-to-t from-black/85 via-black/42 to-black/18",
                          )}
                        />
                        <div aria-hidden className="absolute inset-0 bg-black/10" />

                        <div className="relative z-20 flex h-full flex-col justify-end p-6">
                          <h3
                            className="font-host-grotesk font-normal text-white text-2xl tracking-tight leading-tight"
                          >
                            {cmsDisplayText(c.title)}
                          </h3>

                          <div className="mt-2.5 overflow-hidden max-h-64 opacity-100 translate-y-0">
                            <p className="font-urbanist text-base leading-relaxed text-white/85">
                              {cmsDisplayText(c.description)}
                            </p>
                            {c.buttonLabel && c.buttonPath && (
                              <Link
                                to={c.buttonPath}
                                className="mt-4 inline-flex items-center text-sm font-bold text-rellia-mint hover:underline hover:underline-offset-4"
                              >
                                {cmsDisplayText(c.buttonLabel)}
                              </Link>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div aria-hidden className="relative h-1 w-full overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full bg-rellia-teal transition-[width] duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: `${((mobileIndex + 1) / Math.max(1, cards.length)) * 100}%` }}
                  />
                </div>

                <div className="flex w-full items-center justify-between">
                  <p className="min-w-0 text-left text-xs font-semibold uppercase tracking-[0.14em] text-black/55">
                    {`${mobileIndex + 1} / ${Math.max(1, cards.length)}`}
                  </p>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGoPrev}
                      disabled={mobileIndex === 0}
                      className={arrowBtnClassName}
                      aria-label="Previous card"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={handleGoNext}
                      disabled={mobileIndex === cards.length - 1}
                      className={arrowBtnClassName}
                      aria-label="Next card"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        </ScrollReveal>
      </div>
    </section>
  )
}
