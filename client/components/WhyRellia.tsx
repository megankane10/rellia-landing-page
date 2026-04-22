import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import SectionHeading from "@/components/SectionHeading"
import RelliaAction from "@/components/RelliaAction"
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

  const imageMap = useMemo(
    () =>
      ({
        target: "/images/hero-network.png",
        userRound: "/images/team-megankane.jpg",
        bookOpen: "/images/TabletMeeting.png",
        users: "/images/cta-home-conference.webp",
        circleDollarSign: "/images/portfolio-pop.png",
        stethoscope: "/images/hero-contact.png",
      }) as Record<string, string>,
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

  useEffect(() => {
    const root = mobileScrollerRef.current
    if (!root) return

    const observed = mobileCardRefs.current.filter(Boolean) as HTMLElement[]
    if (observed.length === 0) return

    setMobileIndex(0)
    setActiveIndex(0)

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]

        if (!inView?.target) return

        const idx = observed.findIndex((el) => el === inView.target)
        if (idx < 0) return
        setMobileIndex(idx)
        setActiveIndex(idx)
      },
      { root, threshold: [0.55, 0.6, 0.7] },
    )

    observed.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [cards.length])

  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-[1300px] mx-auto">
        <SectionHeading align="left" title={sectionTitle} className="mb-12 md:mb-16" />

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
                const img = imageMap[c.iconKey] ?? "/images/hero-network.png"

                return (
                  <article
                    key={c.title}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-black/10 bg-white",
                      "transition-[flex-grow] duration-[1400ms] ease-[cubic-bezier(0.83,0,0.17,1)] motion-reduce:transition-none",
                      "min-h-[460px]",
                      !hasActive && "flex-1",
                      hasActive && isActive && "flex-[2.25]",
                      hasActive && !isActive && "flex-[0.95]",
                    )}
                  >
                    <button
                      type="button"
                      onFocus={() => setActiveIndex(idx)}
                      onClick={() => setActiveIndex(idx)}
                      className="absolute inset-0 z-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-2xl"
                      aria-label={`Select ${c.title}`}
                    />

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
                          ? "bg-gradient-to-t from-black/70 via-black/35 to-black/15"
                          : "bg-gradient-to-t from-black/60 via-black/30 to-black/10",
                      )}
                    />

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
                        <div className="mt-5 pb-1">
                          <RelliaAction asChild variant="mintOnTealStrip" size="compact" className="px-4">
                            <Link to="/network" aria-label={`Learn more about ${c.title}`}>
                              Learn more
                            </Link>
                          </RelliaAction>
                        </div>
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
                  className="flex gap-4 overflow-x-auto pb-2 pr-6 snap-x snap-mandatory scroll-smooth overscroll-x-contain"
                  style={{ WebkitOverflowScrolling: "touch" }}
                  aria-label="Why Rellia features"
                >
                  {cards.map((c, idx) => {
                    const isActive = activeIndex === idx
                    const img = imageMap[c.iconKey] ?? "/images/hero-network.png"

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
                          "min-h-[340px] w-[86%]",
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
                              ? "bg-gradient-to-t from-black/70 via-black/35 to-black/15"
                              : "bg-gradient-to-t from-black/60 via-black/30 to-black/10",
                          )}
                        />

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
                            <div className="mt-5 pb-1">
                              <RelliaAction asChild variant="mintOnTealStrip" size="compact" className="px-4">
                                <Link to="/network" aria-label={`Learn more about ${c.title}`}>
                                  Learn more
                                </Link>
                              </RelliaAction>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-rellia-teal transition-[width] duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: `${((mobileIndex + 1) / Math.max(1, cards.length)) * 100}%` }}
                    aria-hidden
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGoPrev}
                    disabled={mobileIndex === 0}
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-rellia-teal transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none",
                      mobileIndex === 0 && "opacity-40",
                    )}
                    aria-label="Previous card"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={handleGoNext}
                    disabled={mobileIndex === cards.length - 1}
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-rellia-teal transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none",
                      mobileIndex === cards.length - 1 && "opacity-40",
                    )}
                    aria-label="Next card"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </>
        </ScrollReveal>
      </div>
    </section>
  )
}
