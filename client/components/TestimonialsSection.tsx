import { useMemo, useState } from "react"
import { ChevronDown, Info } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { HomeTestimonial } from "@shared/cms/types"

const carouselArrowClass = cn(
  "static translate-x-0 translate-y-0 relative",
  "h-12 w-12 rounded-full border-2 border-rellia-teal bg-white text-rellia-teal shadow-md",
  "hover:bg-rellia-teal hover:text-white",
  "disabled:opacity-40 disabled:pointer-events-none",
)

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
          <Info className="h-3.5 w-3.5" aria-hidden />
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
          <h5 className="font-host-grotesk font-bold text-rellia-mint border-b border-white/10 pb-2 mb-1">
            About {t.company}
          </h5>
          <p className="font-urbanist text-sm leading-relaxed text-white/90">{t.companyInfo}</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const imgSrc = t.imageSrc
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

  const shouldTruncate = t.quote.length > 260
  const [expanded, setExpanded] = useState(false)
  const showExpand = shouldTruncate

  const handleToggleExpand = () => setExpanded((v) => !v)

  return (
    <div
      className={cn(
        "bg-white rounded-3xl p-7 md:p-8 w-full min-w-0 shadow-sm border border-black/5 hover:shadow-lg transition-shadow duration-300",
        "flex flex-col",
        !expanded ? "md:aspect-[4/3]" : "md:aspect-auto",
      )}
    >
      <div className="flex-1 min-h-0">
        <div className={cn("relative", showExpand && !expanded && "overflow-hidden")}>
          <p
            className={cn(
              "font-urbanist text-base md:text-lg text-black/80 leading-relaxed italic",
              showExpand && !expanded && "max-h-[8.25rem] md:max-h-[9.5rem]",
            )}
          >
            &ldquo;{t.quote}&rdquo;
          </p>
          {showExpand && !expanded ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/85 to-transparent"
            />
          ) : null}
        </div>
      </div>

      {/* Footer block — divider + expand control + avatar row */}
      <div className="relative mt-7 pt-5 border-t border-black/5">
        {showExpand ? (
          <button
            type="button"
            onClick={handleToggleExpand}
            className={cn(
              "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
              "h-9 w-9 rounded-full border border-black/10 bg-white text-black/55 shadow-sm",
              "transition-[transform,box-shadow,color,border-color] duration-200 motion-reduce:transition-none",
              "hover:text-rellia-teal hover:border-rellia-teal/30 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2",
            )}
            aria-label={expanded ? "Collapse testimonial" : "Expand testimonial"}
            aria-expanded={expanded}
          >
            <ChevronDown className={cn("h-4 w-4 mx-auto transition-transform duration-200", expanded && "rotate-180")} aria-hidden />
          </button>
        ) : null}

        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-2xl border-2 border-rellia-mint/30 shadow-sm shrink-0">
            <AvatarImage src={imgSrc} alt={t.name} className="object-cover" />
            <AvatarFallback className="rounded-2xl bg-rellia-teal text-white text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h4 className="font-host-grotesk font-bold text-black text-lg leading-snug">{t.name}</h4>
            <div className="mt-2 flex items-start justify-between gap-3">
              <p className="font-urbanist text-black/60 text-sm leading-snug">
                {t.role}, <span className="text-rellia-teal font-semibold">{t.company}</span>
              </p>
              <CompanyInfoPopover t={t} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type TestimonialsSectionProps = {
  titleLead: string;
  titleAccent: string;
  testimonials: HomeTestimonial[];
};

export default function TestimonialsSection({ titleLead, titleAccent, testimonials }: TestimonialsSectionProps) {
  return (
    <section className="w-full bg-rellia-cream/40 py-14 md:py-20 px-6 md:px-10 overflow-x-hidden">
      <div className="max-w-[1300px] mx-auto w-full min-w-0">
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
            className="w-full max-w-full min-w-0"
          >
            <div className="flex flex-col gap-6 md:gap-7">
              {/*
                Viewport clips horizontally; each slide min-w-0 prevents flex overflow.
                1 / 2 / 3 cards visible — same proportional width as the old 3-col grid.
              */}
              <CarouselContent className="-ml-4 md:-ml-6">
                {testimonials.map((t) => (
                  <CarouselItem
                    key={t.name}
                    className={cn(
                      "pl-4 md:pl-6 min-w-0",
                      "basis-full md:basis-1/2 xl:basis-1/3",
                    )}
                  >
                    <TestimonialCard t={t} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="flex items-center justify-center gap-4">
                <CarouselPrevious className={carouselArrowClass} />
                <CarouselNext className={carouselArrowClass} />
              </div>
            </div>
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  )
}
