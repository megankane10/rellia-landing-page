import { useEffect, useMemo, useRef, useState } from "react"
import { CircleHelp, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { HomeTestimonial } from "@shared/cms/types"
import LogoMarquee from "@/components/LogoMarquee"

const carouselArrowClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-rellia-teal shadow-sm transition hover:bg-rellia-teal hover:text-white hover:border-rellia-teal disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"

type Testimonial = HomeTestimonial;

function CompanyInfoPopover({ t }: { t: Testimonial }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
            "text-black/35 transition-colors hover:text-rellia-teal",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
          )}
          aria-label={`About ${t.company}`}
        >
          <CircleHelp className="h-3.5 w-3.5" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className={cn(
          "border-rellia-teal bg-rellia-teal p-5 text-white shadow-2xl",
          "w-[min(calc(100vw-2rem),20rem)] sm:w-80 rounded-2xl z-50",
        )}
      >
        <div className="flex flex-col gap-2">
          <h5 className="font-host-grotesk font-semibold text-rellia-mint border-b border-white/10 pb-2 mb-1">
            About {t.company}
          </h5>
          <p className="font-urbanist text-sm leading-relaxed text-white/90">{t.companyInfo}</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function TestimonialCard({
  t,
  isExpanded,
  onRequestExpand,
  onRequestCollapse,
}: {
  t: Testimonial
  isExpanded: boolean
  onRequestExpand: () => void
  onRequestCollapse: () => void
}) {
  const isMelissa = t.name.toLowerCase().includes("melissa")
  const imgSrc = isMelissa ? "/images/testimonials-melissaW.jpg" : t.imageSrc
  const role = isMelissa ? "Founder" : t.role
  const quoteRef = useRef<HTMLParagraphElement | null>(null)
  const initials = useMemo(
    () =>
      t.name
        .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 3),
    [t.name],
  )

  const [showExpand, setShowExpand] = useState(false)

  useEffect(() => {
    if (isExpanded) return
    const el = quoteRef.current
    if (!el) return

    const compute = () => {
      const next = el.scrollHeight > el.clientHeight + 1
      setShowExpand(next)
    }

    const raf = requestAnimationFrame(compute)
    const ro = new ResizeObserver(() => compute())
    ro.observe(el)
    window.addEventListener("resize", compute)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("resize", compute)
    }
  }, [isExpanded, t.quote])

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 md:p-6 w-full min-w-0 border border-black/10",
        "flex flex-col overflow-hidden",
        "transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        isExpanded ? "h-auto max-h-[2400px]" : "h-[220px] md:h-[232px] max-h-[220px] md:max-h-[232px]",
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 rounded-lg border border-black/10 shrink-0">
          <AvatarImage
            src={imgSrc}
            alt={t.name}
            className={cn("object-cover", isMelissa && "object-[38%_50%]")}
          />
          <AvatarFallback className="rounded-lg bg-rellia-teal text-white text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-host-grotesk font-semibold text-black text-base leading-snug truncate">
                {t.name}
              </h4>
              <p className="mt-1 font-urbanist text-black/75 text-sm leading-snug truncate">
                <span className="font-medium text-black/80">{role}</span>,{" "}
                <span className="text-black/45">{t.company}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <CompanyInfoPopover t={t} />
            </div>
          </div>
        </div>
      </div>

      <div className={cn("mt-4", isExpanded ? "flex-1" : "flex-1 min-h-0")}>
        <div
          className={cn(
            "relative",
            !isExpanded && "h-full",
            showExpand && !isExpanded && "overflow-hidden",
          )}
        >
          <p
            ref={quoteRef}
            className={cn(
              "font-urbanist text-[15px] md:text-base text-black/75 leading-relaxed",
              isExpanded ? "whitespace-normal opacity-100" : "line-clamp-5 opacity-90",
              "transition-opacity duration-300 ease-out motion-reduce:transition-none",
            )}
          >
            &ldquo;{t.quote}&rdquo;
          </p>
          {showExpand ? (
            <>
              {!isExpanded ? (
                <>
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/90 to-transparent" />
                  <button
                    type="button"
                    onClick={onRequestExpand}
                    className={cn(
                      "absolute inset-x-0 bottom-0 mx-auto w-fit",
                      "inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-rellia-teal shadow-sm",
                      "transition-colors hover:bg-rellia-teal hover:text-white hover:border-rellia-teal",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    )}
                    aria-label="Expand testimonial"
                    aria-expanded={isExpanded}
                  >
                    <ChevronDown className="h-5 w-5" aria-hidden />
                  </button>
                </>
              ) : (
                null
              )}
            </>
          ) : null}
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onRequestCollapse}
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-rellia-teal shadow-sm",
              "transition-colors hover:bg-rellia-teal hover:text-white hover:border-rellia-teal",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            )}
            aria-label="Collapse testimonial"
            aria-expanded={true}
          >
            <ChevronUp className="h-5 w-5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  )
}

type TestimonialsSectionProps = {
  titleLead: string;
  titleAccent: string;
  testimonials: HomeTestimonial[];
};

export default function TestimonialsSection({ titleLead, titleAccent, testimonials }: TestimonialsSectionProps) {
  const [expandedName, setExpandedName] = useState<string | null>(null)
  const [carouselApi, setCarouselApi] = useState<unknown>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselCount, setCarouselCount] = useState(1)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const orderedTestimonials = useMemo(() => {
    const list = [...testimonials]
    const melissaIndex = list.findIndex((t) => t.name.toLowerCase().includes("melissa"))
    const mazharIndex = list.findIndex((t) => t.name.toLowerCase().includes("mazhar"))
    if (melissaIndex < 0 || mazharIndex < 0) return list
    if (mazharIndex === melissaIndex + 1) return list

    const [mazhar] = list.splice(mazharIndex, 1)
    const insertAt = melissaIndex + 1
    list.splice(insertAt, 0, mazhar)
    return list
  }, [testimonials])

  useEffect(() => {
    const api = carouselApi as any
    if (!api) return

    const handleSelect = () => {
      setCarouselIndex(api.selectedScrollSnap?.() ?? 0)
      setCarouselCount(api.scrollSnapList?.().length ?? 1)
      setCanScrollPrev(Boolean(api.canScrollPrev?.()))
      setCanScrollNext(Boolean(api.canScrollNext?.()))
    }

    handleSelect()
    api.on?.("select", handleSelect)
    api.on?.("reInit", handleSelect)
    return () => {
      api.off?.("select", handleSelect)
      api.off?.("reInit", handleSelect)
    }
  }, [carouselApi])

  return (
    <div className="w-full bg-white">
      <div aria-hidden className="px-6 md:px-10">
        <div className="mx-auto max-w-[1300px]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>
      </div>

      <section className="w-full bg-white py-16 md:py-24 px-6 md:px-10 overflow-x-hidden">
      <div className="relative max-w-[1300px] mx-auto w-full min-w-0">
        <ScrollReveal className="mb-10 md:mb-14 flex flex-col items-center text-center">
          <h2 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight max-w-3xl">
            {titleLead}{" "}
            <span className="text-rellia-teal">{titleAccent}</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <Carousel
            opts={{
              align: "start",
              loop: false,
              containScroll: "trimSnaps",
            }}
            setApi={(api) => setCarouselApi(api as unknown)}
            className="w-full max-w-full min-w-0"
          >
            <div className="relative flex flex-col gap-4 md:gap-5">
              {/*
                Viewport clips horizontally; each slide min-w-0 prevents flex overflow.
                1 / 2 / 3 cards visible — same proportional width as the old 3-col grid.
              */}
              <CarouselContent className="-ml-4 md:-ml-6">
                {orderedTestimonials.map((t, idx) => (
                  <CarouselItem
                    key={t.name}
                    className={cn(
                      "pl-4 md:pl-6 min-w-0",
                      "basis-[88%] sm:basis-[78%] md:basis-1/2 xl:basis-1/3",
                    )}
                  >
                    <TestimonialCard
                      t={t}
                      isExpanded={expandedName === t.name}
                      onRequestExpand={() => setExpandedName(t.name)}
                      onRequestCollapse={() => setExpandedName(null)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* FeaturedStories-style control strip: loading bar + count + arrows */}
              <div className="flex w-full flex-col gap-2">
                <div aria-hidden className="relative h-1 w-full overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full bg-rellia-teal transition-[width] duration-500 ease-out motion-reduce:transition-none"
                    style={{
                      width:
                        carouselCount <= 1
                          ? "100%"
                          : `${(carouselIndex / Math.max(1, carouselCount - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex w-full items-center justify-between gap-4">
                  <p className="min-w-0 text-left text-xs font-semibold uppercase tracking-[0.14em] text-black/55">
                    {(() => {
                      const totalSwipes = Math.max(0, carouselCount - 1)
                      const current = Math.min(carouselIndex, totalSwipes)
                      return `${current} / ${totalSwipes}`
                    })()}
                  </p>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      className={carouselArrowClass}
                      onClick={() => (carouselApi as any)?.scrollPrev?.()}
                      disabled={!canScrollPrev}
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className={carouselArrowClass}
                      onClick={() => (carouselApi as any)?.scrollNext?.()}
                      disabled={!canScrollNext}
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Carousel>
        </ScrollReveal>

        <div className="mt-8 md:mt-10">
          <LogoMarquee showHeading={false} sectionClassName="py-0" />
        </div>
      </div>
      </section>
    </div>
  )
}
