import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import ScrollReveal from "@/components/ScrollReveal"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { motion } from "framer-motion"

import { type TrustedMemberTestimonial } from "@shared/cms/types"
import { cmsDisplayText } from "@/lib/cmsStega"

const DEFAULT_TESTIMONIALS: TrustedMemberTestimonial[] = [
  {
    name: "Dr Stevie Foglia",
    role: "Founder & CEO",
    company: "Neuro-Mod",
    image: "/images/drstrevie.png",
    quote:
      "The QMS fits seamlessly within our workflows and is directly personalized to our company and product. Rellia has been excellent to work with - they are true experts in their field.",
  },
  {
    name: "Ibukun Elebute",
    role: "Founder & COO",
    company: "Cellect",
    image: "/images/ibukun.jpg",
    quote:
      "The Rellia QMS program was practical and startup-friendly, the process was easy to follow, and the support helped us understand not just what needed to be done, but how to do it properly.",
  },
  {
    name: "Rooaa Shanshal",
    role: "Co-Founder",
    company: "Power of Play",
    image: "/images/testimonials-rooaaS.jpeg",
    quote:
      "Being part of Rellia has been so incredibly valuable. Since joining, we've made real progress on building our QMS which is something that previously felt overwhelming.",
  },
]

function getQuoteFontSizeClass(quote: string) {
  const len = quote.trim().length
  if (len < 120) {
    return "text-xl sm:text-2xl md:text-3xl"
  } else if (len < 200) {
    return "text-lg sm:text-xl md:text-2xl"
  } else {
    return "text-base sm:text-lg md:text-xl"
  }
}

type ProgramTrustedMembersSectionProps = {
  title?: string
  testimonials?: TrustedMemberTestimonial[]
  className?: string
  /** Whether to auto-rotate the testimonials (default true) */
  autoRotate?: boolean
}

const ROTATE_MS = 6000

export default function ProgramTrustedMembersSection({
  title = "Already trusted by Rellia members",
  testimonials = DEFAULT_TESTIMONIALS,
  className,
  autoRotate = true,
}: ProgramTrustedMembersSectionProps) {
  const [carouselApi, setCarouselApi] = useState<any>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselCount, setCarouselCount] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)

  useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => {
      setCarouselIndex(carouselApi.selectedScrollSnap?.() ?? 0)
      setCarouselCount(carouselApi.scrollSnapList?.().length ?? 0)
      setCanScrollPrev(Boolean(carouselApi.canScrollPrev?.()))
      setCanScrollNext(Boolean(carouselApi.canScrollNext?.()))
      setCycleKey((k) => k + 1) // Reset timer on manual scroll
    }
    onSelect()
    carouselApi.on?.("select", onSelect)
    carouselApi.on?.("reInit", onSelect)
  }, [carouselApi])

  useEffect(() => {
    if (!autoRotate || !carouselApi || testimonials.length <= 1) return
    const t = window.setTimeout(() => {
      carouselApi.scrollNext()
      setCycleKey((k) => k + 1)
    }, ROTATE_MS)
    return () => window.clearTimeout(t)
  }, [carouselApi, autoRotate, carouselIndex, testimonials.length, cycleKey])

  return (
    <section className={cn("relative w-full bg-[#fdfdfd] py-16 md:py-24 px-6 md:px-10 overflow-hidden border-b border-black/[0.03]", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-rellia-mint/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <h2 className="mb-14 text-center font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-rellia-teal md:text-[32px] lg:text-[36px]">
            {cmsDisplayText(title)}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Carousel
            opts={{ align: "start", loop: true }}
            setApi={setCarouselApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="basis-full pl-4 py-4">
                  <div className="relative mx-auto flex h-auto min-h-[350px] sm:min-h-[300px] md:min-h-[250px] pb-8 w-full max-w-[980px] flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0d3540] via-[#104856] to-[#196b7f] border border-white/10 p-6 md:p-8 shadow-md">
                    <div className="relative z-10 flex flex-col items-start justify-start">
                      <p className={cn(
                        "w-full font-host-grotesk font-medium leading-[1.3] tracking-tight text-white",
                        getQuoteFontSizeClass(t.quote)
                      )}>
                        &ldquo;{cmsDisplayText(t.quote)}&rdquo;
                      </p>
                    </div>

                    <div className="relative z-10 mt-4 flex w-full items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                          <img src={t.image} alt={t.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                        </div>
                        <div className="flex min-w-0 flex-col items-start">
                          <h4 className="font-host-grotesk text-base font-semibold leading-tight text-rellia-mint md:text-lg">
                            {cmsDisplayText(t.name)}
                          </h4>
                          <p className="mt-0.5 font-urbanist text-xs font-normal text-white md:text-sm">
                            {cmsDisplayText(t.role)} &bull; {cmsDisplayText(t.company)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-0 flex w-full flex-col gap-4">
              <div aria-hidden className="relative h-1 w-full overflow-hidden rounded-full bg-black/5">
                {autoRotate && testimonials.length > 1 ? (
                  <motion.div
                    key={cycleKey}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                    className="h-full bg-rellia-teal"
                  />
                ) : (
                  <div
                    className="h-full bg-rellia-teal transition-[width] duration-500 ease-out"
                    style={{
                      width:
                        carouselCount <= 1
                          ? "100%"
                          : `${(carouselIndex / Math.max(1, carouselCount - 1)) * 100}%`,
                    }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="font-host-grotesk text-sm font-bold text-rellia-teal/60">
                  {carouselCount ? carouselIndex + 1 : 0} / {carouselCount || 0}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      carouselApi?.scrollPrev?.()
                      setCycleKey((k) => k + 1)
                    }}
                    disabled={!canScrollPrev}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-rellia-teal shadow-sm transition hover:bg-rellia-teal hover:border-rellia-teal hover:text-white disabled:opacity-40"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      carouselApi?.scrollNext?.()
                      setCycleKey((k) => k + 1)
                    }}
                    disabled={!canScrollNext}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-rellia-teal shadow-sm transition hover:bg-rellia-teal hover:border-rellia-teal hover:text-white disabled:opacity-40"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  )
}

