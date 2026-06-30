import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { CircleHelp, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Medal, ArrowRight } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { HEADING_SECTION } from "@/lib/typography"
import type { HomeTestimonial, SanityPortableText } from "@shared/cms/types"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import LogoMarquee, { type LogoMark } from "@/components/LogoMarquee"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { buildResponsiveImageProps } from "@shared/image/optimizeImageUrl"

const carouselArrowClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-rellia-teal shadow-sm transition hover:bg-rellia-teal hover:text-white hover:border-rellia-teal disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"

/** Collapsed quote viewport: exactly 5 lines (15px Urbanist + `leading-relaxed` 1.625). Gradient + expand overlay this area only. */
const COLLAPSED_QUOTE_BLOCK_CLASS = "h-[calc(5*1.625*15px)]"

type Testimonial = HomeTestimonial

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
          "w-[min(calc(100vw-2rem),20rem)] sm:w-80 rounded-3xl z-50",
        )}
      >
        <div className="flex flex-col gap-2">
          <h5 className="font-host-grotesk font-semibold text-rellia-mint border-b border-white/10 pb-2 mb-1">
            About {t.company}
          </h5>
          <p className="font-urbanist text-sm leading-relaxed text-white/90">{cmsDisplayText(t.companyInfo)}</p>
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
  const cleanName = cmsCleanText(t.name)
  const isMelissa = cleanName.toLowerCase().includes("melissa")
  const imgSrc = isMelissa ? "/images/testimonials-melissaW.jpg" : t.imageSrc
  const avatarImage = buildResponsiveImageProps(imgSrc, "avatar")
  const role = isMelissa ? "Founder" : t.role
  const quoteRef = useRef<HTMLParagraphElement | null>(null)
  const initials = useMemo(
    () =>
      cmsCleanText(t.name)
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

  const expandPillClass = cn(
    "inline-flex items-center justify-center gap-1 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-rellia-teal shadow-sm",
    "transition-colors hover:border-rellia-teal hover:bg-rellia-teal hover:text-white",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
  )

  return (
    <div
      className={cn(
        "flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white p-4 md:p-5",
        "transition-[max-height] duration-500 transition-timing-function-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        isExpanded && "max-h-[min(92vh,2400px)] min-h-0"
      )}
    >
      <div className={cn("flex flex-1 flex-col", isExpanded && "min-h-0")}>
        <div
          className={cn(
            "relative shrink-0 overflow-hidden",
            isExpanded && "min-h-0",
          )}
        >
          <p
            ref={quoteRef}
            className={cn(
              "relative z-0 font-urbanist text-[15px] leading-relaxed text-black/75",
              isExpanded ? "whitespace-normal opacity-100" : "line-clamp-5 opacity-90 h-[121.875px]",
              "transition-opacity duration-300 ease-out motion-reduce:transition-none",
            )}
          >
            &ldquo;{cmsDisplayText(t.quote)}&rdquo;
          </p>
          {showExpand && !isExpanded ? (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[3.25rem] bg-gradient-to-t from-white from-20% via-white/90 to-transparent"
              />
              <button
                type="button"
                onClick={onRequestExpand}
                className={cn(
                  "absolute bottom-1 left-1/2 z-20 -translate-x-1/2 shadow-md",
                  expandPillClass,
                )}
                aria-label="Expand testimonial"
                aria-expanded={false}
              >
                <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
              </button>
            </>
          ) : null}
        </div>

        {isExpanded ? (
          <div className="mt-4 flex shrink-0 justify-center">
            <button
              type="button"
              onClick={onRequestCollapse}
              className={expandPillClass}
              aria-label="Collapse testimonial"
              aria-expanded={true}
            >
              <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <div className={cn("mt-auto shrink-0 pt-4 md:pt-5", isExpanded && "mt-6")}>
        <div className="flex items-start gap-3 md:gap-3.5">
          <Avatar className="h-12 w-12 shrink-0 rounded-lg border border-black/10">
            <AvatarImage
              src={avatarImage.src}
              srcSet={avatarImage.srcSet}
              sizes={avatarImage.sizes}
              alt={cleanName}
              className={cn("object-cover", isMelissa && "object-[38%_50%]")}
            />
            <AvatarFallback className="rounded-lg bg-rellia-teal text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h4 className="truncate font-host-grotesk text-base font-semibold leading-snug text-black">
              {cmsDisplayText(t.name)}
            </h4>
            <p className="mt-0.5 font-urbanist text-sm leading-snug text-black/75">
              <span className="font-medium text-black/80">{cmsDisplayText(role)},</span>{" "}
              <span className="inline-flex min-w-0 items-center gap-1 text-black/55">
                <span className="min-w-0 truncate">{cmsDisplayText(t.company)}</span>
                <CompanyInfoPopover t={t} />
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

type TestimonialsSectionProps = {
  titlePortable: SanityPortableText
  testimonials: HomeTestimonial[]
  showHeaderIcon?: boolean
  logoMarqueeMarks?: readonly LogoMark[]
}

export default function TestimonialsSection({
  titlePortable,
  testimonials,
  showHeaderIcon = true,
  logoMarqueeMarks,
}: TestimonialsSectionProps) {
  const [expandedName, setExpandedName] = useState<string | null>(null)
  const [carouselApi, setCarouselApi] = useState<unknown>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselCount, setCarouselCount] = useState(1)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const orderedTestimonials = useMemo(() => {
    const list = [...testimonials]
    const melissaIndex = list.findIndex((t) => cmsCleanText(t.name).toLowerCase().includes("melissa"))
    const mazharIndex = list.findIndex((t) => cmsCleanText(t.name).toLowerCase().includes("mazhar"))
    if (melissaIndex >= 0 && mazharIndex >= 0 && mazharIndex !== melissaIndex + 1) {
      const [mazhar] = list.splice(mazharIndex, 1)
      const insertAt = melissaIndex + 1
      list.splice(insertAt, 0, mazhar)
    }

    const sahilIndex = list.findIndex((t) => cmsCleanText(t.name).toLowerCase().includes("sahil"))
    const targetIndex = 2
    if (sahilIndex >= 0 && sahilIndex !== targetIndex) {
      const [sahil] = list.splice(sahilIndex, 1)
      list.splice(targetIndex, 0, sahil)
    }

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

      <section className="w-full overflow-x-hidden bg-white pb-10 pt-16 md:pb-12 md:pt-24">
      <div className="relative w-full overflow-visible">
        <div className="max-w-[1300px] mx-auto w-full min-w-0 px-6 md:px-10">
        <ScrollReveal className="mb-10 md:mb-14">
          <div className="relative isolate mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <div
              className="pointer-events-none absolute -inset-x-6 -inset-y-8 overflow-visible sm:-inset-x-10 md:-inset-x-14 md:-inset-y-10"
              aria-hidden
            >
              <div
                className="absolute left-1/2 top-[54%] w-[min(116%,520px)] -translate-x-1/2 -translate-y-1/2 md:w-[min(122%,640px)]"
                style={{
                  height: "min(14rem, 38vw)",
                  background:
                    "radial-gradient(ellipse 72% 82% at 50% 48%, rgba(157, 214, 208, 0.38) 0%, rgba(157, 214, 208, 0.14) 42%, transparent 68%)",
                }}
              />
            </div>

            <div className="relative z-[1] flex flex-col items-center">
              {showHeaderIcon ? (
                <Medal
                  className="mb-5 h-9 w-9 shrink-0 text-rellia-teal md:mb-6 md:h-10 md:w-10"
                  strokeWidth={1.35}
                  aria-hidden
                />
              ) : null}
              <h2 className={cn("font-host-grotesk font-semibold text-rellia-teal [&_span]:text-rellia-teal [&_span]:!text-rellia-teal leading-tight tracking-tight max-w-3xl text-balance", HEADING_SECTION)}>
                <HeroHeadlinePortable value={titlePortable} />
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Carousel
            opts={{
              align: "center",
              loop: false,
            }}
            setApi={(api) => setCarouselApi(api as unknown)}
            className="relative w-full max-w-full min-w-0"
          >
            <div className="relative flex flex-col gap-4 md:gap-5">
              <div
                className={cn(
                  "transition-[mask-image] duration-300 ease-out",
                  canScrollNext && "md:[mask-image:linear-gradient(to_right,black_85%,transparent_100%)]"
                )}
              >
                <CarouselContent className="-ml-2 items-start md:-ml-6">
                  {orderedTestimonials.map((t, idx) => (
                    <CarouselItem
                      key={t.name}
                      className={cn(
                        "flex min-h-0 min-w-0 pl-2 md:pl-6",
                        "basis-full sm:basis-[75%] md:basis-[45%] lg:basis-[31%]",
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
              </div>

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

                <div className="flex w-full flex-wrap items-center justify-between gap-3">
                  <Link
                    to="/founders/alumni"
                    className="inline-flex items-center gap-1 font-host-grotesk text-sm font-bold text-rellia-teal transition-colors hover:text-black hover:underline underline-offset-4"
                  >
                    View Alumni <ArrowRight className="h-4 w-4" />
                  </Link>

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

        <div className="mt-6 md:mt-8">
          <LogoMarquee flush showHeading={false} sectionClassName="py-0" marks={logoMarqueeMarks} />
        </div>
        </div>
      </div>
      </section>
    </div>
  )
}
