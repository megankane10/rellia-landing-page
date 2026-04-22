import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
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

  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-[1300px] mx-auto">
        <SectionHeading align="left" title={sectionTitle} className="mb-12 md:mb-16" />

        <ScrollReveal>
          <div className="flex flex-col md:flex-row gap-4 md:gap-5" onMouseLeave={() => setActiveIndex(null)}>
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
                    "transition-[flex-grow] duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                    "min-h-[260px] md:min-h-[460px]",
                    !hasActive && "md:flex-1",
                    hasActive && isActive && "md:flex-[2.25]",
                    hasActive && !isActive && "md:flex-[0.95]",
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
                      "transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
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

                  <div className="relative z-20 flex h-full flex-col justify-end p-6 md:p-7">
                    <h3
                      className={cn(
                        "font-host-grotesk font-normal text-white text-2xl md:text-3xl tracking-tight leading-tight",
                        "transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                        isActive ? "-translate-y-2 md:-translate-y-4" : "translate-y-0",
                      )}
                    >
                      {c.title}
                    </h3>

                    <div
                      className={cn(
                        "mt-4 overflow-hidden",
                        "transition-[max-height,opacity,transform] duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                        isActive ? "max-h-56 opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-4",
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
        </ScrollReveal>
      </div>
    </section>
  )
}
