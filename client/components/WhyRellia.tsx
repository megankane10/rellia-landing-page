import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import SectionHeading from "@/components/SectionHeading"
import { cn } from "@/lib/utils"
import type { HomeWhyFeature } from "@shared/cms/types"

type WhyRelliaProps = {
  sectionTitle: string;
  features: HomeWhyFeature[];
};

export default function WhyRellia({ sectionTitle, features }: WhyRelliaProps) {
  const cards = useMemo(() => features.slice(0, 4), [features])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mobileIndex, setMobileIndex] = useState(0)
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null)
  const mobileCardRefs = useRef<Array<HTMLElement | null>>([])

  const imageByIndex = useMemo(
    () => [
      "/images/whyrellia-network-2.jpg",
      "/images/whyrellia-founders-2.jpg",
      "/images/whyrellia-programs-2.jpg",
      "/images/whyrellia-outcomes-2.jpg",
    ],
    [],
  )

  const handleScrollToIndex = useCallback((idx: number) => {
    const el = mobileCardRefs.current[idx]
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
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

    const observed = mobileCardRefs.current.filter(Boolean) as HTMLElement[]
    if (observed.length === 0) return

    setMobileIndex(0)
    setActiveIndex(null)

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]

        if (!inView?.target) return

        const idx = observed.findIndex((el) => el === inView.target)
        if (idx < 0) return
        setMobileIndex(idx)
        // Keep mobile cards in their collapsed state by default. Users can still
        // interact with the carousel controls without forced expansion.
        setActiveIndex(null)
      },
      { root, threshold: [0.55, 0.6, 0.7] },
    )

    observed.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [cards.length])

  return (
    <section className="w-full bg-rellia-cream/25 py-16 md:py-24 px-6 md:px-10 overflow-x-hidden">
      <div className="max-w-[1300px] mx-auto">
        <SectionHeading
          align="left"
          title={sectionTitle}
          description="A curated network and practical support system to help you move through the moments that make or break a healthcare startup."
          className="mb-12 md:mb-16"
        />

        <ScrollReveal>
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
                    key={c.title}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-black/10 bg-white",
                      "transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
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
                      className="absolute inset-0 z-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-2xl"
                      aria-label={`Select ${c.title}`}
                    />

                    <div aria-hidden className="absolute inset-0">
                      <img
                        src={img}
                        alt=""
                        className={cn(
                          "absolute inset-0 h-full w-full object-cover",
                          "transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
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
                          "transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                          isActive ? "delay-200 -translate-y-4" : "delay-0 translate-y-0",
                        )}
                      >
                        {c.title}
                      </h3>

                      <div
                        className={cn(
                          "mt-4 overflow-hidden",
                          "transition-[max-height,opacity,transform] duration-[1050ms] ease-[cubic-bezier(0.42,0,1,1)] motion-reduce:transition-none",
                          isActive
                            ? "delay-300 max-h-56 opacity-100 translate-y-0"
                            : "delay-0 max-h-0 opacity-0 translate-y-6",
                        )}
                      >
                        <p className="font-urbanist text-white/85 text-base leading-relaxed max-w-[40ch]">
                          {c.description}
                        </p>
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
                  className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth overscroll-x-contain -mx-6 px-6 scroll-px-6"
                  style={{ WebkitOverflowScrolling: "touch" }}
                  aria-label="Why Rellia features"
                >
                  {cards.map((c, idx) => {
                    const isActive = activeIndex === idx
                    const img = imageByIndex[idx] ?? "/images/whyrellia-network.jpg"

                    return (
                      <article
                        key={c.title}
                        ref={(el) => {
                          mobileCardRefs.current[idx] = el
                        }}
                        tabIndex={0}
                        aria-label={c.title}
                        className={cn(
                          "relative shrink-0 snap-start overflow-hidden rounded-2xl border border-black/10 bg-white",
                          "min-h-[360px] w-[92%]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        )}
                      >
                        <img
                          src={img}
                          alt=""
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-0 h-full w-full object-cover",
                            "transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                            isActive ? "scale-[1.04]" : "scale-100",
                          )}
                        />
                        <div
                          className={cn(
                            "absolute inset-0",
                            isActive
                              ? "bg-gradient-to-t from-black/80 via-black/40 to-black/16"
                              : "bg-gradient-to-t from-black/74 via-black/36 to-black/14",
                          )}
                        />
                        <div aria-hidden className="absolute inset-0 bg-black/10" />

                        <div className="relative z-20 flex h-full flex-col justify-end p-6">
                          <h3
                            className={cn(
                              "font-host-grotesk font-normal text-white text-2xl tracking-tight leading-tight",
                              "transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                              isActive ? "delay-200 -translate-y-3" : "delay-0 translate-y-0",
                            )}
                          >
                            {c.title}
                          </h3>

                          <div
                            className={cn(
                              "mt-4 overflow-hidden",
                              "transition-[max-height,opacity,transform] duration-[1050ms] ease-[cubic-bezier(0.42,0,1,1)] motion-reduce:transition-none",
                              isActive
                                ? "delay-300 max-h-64 opacity-100 translate-y-0"
                                : "delay-0 max-h-0 opacity-0 translate-y-6",
                            )}
                          >
                            <p className="font-urbanist text-white/85 text-base leading-relaxed">
                              {c.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div aria-hidden className="flex w-full items-center gap-2">
                  {cards.map((c, idx) => {
                    const isPast = idx < mobileIndex
                    const isActive = idx === mobileIndex
                    return (
                      <div key={c.title} className="relative h-1 flex-1 overflow-hidden rounded-full bg-black/10">
                        {isPast ? <div className="h-full w-full bg-rellia-teal" /> : null}
                        {isActive ? <div className="h-full w-full bg-rellia-teal" /> : null}
                      </div>
                    )
                  })}
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
