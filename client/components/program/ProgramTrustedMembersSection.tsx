import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import ScrollReveal from "@/components/ScrollReveal"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

import { type TrustedMemberTestimonial } from "@shared/cms/types"

const DEFAULT_TESTIMONIALS: TrustedMemberTestimonial[] = [
  {
    name: "Dr Stevie Foglia",
    role: "Founder & CEO",
    company: "Neuro-Mod",
    image: "/images/drstrevie.png",
    logo: "/images/portfolio-neuromod.png",
    quote:
      "The QMS fits seamlessly within our workflows and is directly personalized to our company and product. Rellia has been excellent to work with - they are true experts in their field.",
  },
  {
    name: "Ibukun Elebute",
    role: "Founder & COO",
    company: "Cellect",
    image: "/images/ibukun.jpg",
    logo: "/images/cellect-logo.png",
    quote:
      "The Rellia QMS program was practical and startup-friendly, the process was easy to follow, and the support helped us understand not just what needed to be done, but how to do it properly.",
  },
  {
    name: "Rooaa Shanshal",
    role: "Co-Founder",
    company: "Power of Play",
    image: "/images/testimonials-rooaaS.jpeg",
    logo: "/images/portfolio-pop.png",
    quote:
      "Being part of Rellia has been so incredibly valuable. Since joining, we've made real progress on building our QMS which is something that previously felt overwhelming.",
  },
]

type ProgramTrustedMembersSectionProps = {
  title?: string
  testimonials?: TrustedMemberTestimonial[]
  className?: string
}

export default function ProgramTrustedMembersSection({
  title = "Already trusted by Rellia members",
  testimonials = DEFAULT_TESTIMONIALS,
  className,
}: ProgramTrustedMembersSectionProps) {
  const [carouselApi, setCarouselApi] = useState<any>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselCount, setCarouselCount] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => {
      setCarouselIndex(carouselApi.selectedScrollSnap?.() ?? 0)
      setCarouselCount(carouselApi.scrollSnapList?.().length ?? 0)
      setCanScrollPrev(Boolean(carouselApi.canScrollPrev?.()))
      setCanScrollNext(Boolean(carouselApi.canScrollNext?.()))
    }
    onSelect()
    carouselApi.on?.("select", onSelect)
    carouselApi.on?.("reInit", onSelect)
  }, [carouselApi])

  return (
    <section className={cn("relative w-full bg-[#fdfdfd] py-16 md:py-24 px-6 md:px-10 overflow-hidden border-b border-black/[0.03]", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-rellia-mint/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <h2 className="mb-14 text-center font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-black md:text-3xl">
            {title.includes("Already trusted") ? (
              <>
                <span className="text-rellia-teal">Already trusted</span>
                {title.replace("Already trusted", "")}
              </>
            ) : (
              title
            )}
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
                <CarouselItem key={t.name} className="basis-full pl-4">
                  <div className="relative flex min-h-[340px] flex-col justify-center overflow-hidden md:min-h-[400px]">
                    <div className="mx-auto flex w-full max-w-[980px] flex-col items-start">
                      <div className="relative z-10 flex w-full flex-col items-start justify-center pt-4 md:pt-8">
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -left-10 -top-6 h-40 w-40 rounded-full bg-rellia-mint/35 blur-3xl md:-left-14 md:-top-10 md:h-52 md:w-52"
                        />
                        <Quote
                          className="mb-6 h-12 w-12 fill-current text-rellia-teal md:h-14 md:w-14"
                          fill="currentColor"
                          stroke="none"
                          aria-hidden
                        />
                        <p className="w-full font-host-grotesk text-xl font-medium leading-[1.25] tracking-tight text-rellia-teal md:text-2xl lg:text-3xl">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>

                      <div className="relative z-10 mt-8 flex w-full items-center justify-between">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-rellia-teal/5 md:h-16 md:w-16">
                            <img src={t.image} alt={t.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                          </div>
                          <div className="flex min-w-0 flex-col items-start">
                            <h4 className="font-host-grotesk text-lg font-medium leading-tight text-black md:text-xl">
                              {t.name}
                            </h4>
                            <p className="mt-0.5 font-urbanist text-sm font-medium text-black/60 md:text-base">
                              {t.role} &bull; {t.company}
                            </p>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-0 flex w-full flex-col gap-4">
              <div aria-hidden className="relative h-1 w-full overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full bg-rellia-teal transition-[width] duration-500 ease-out"
                  style={{
                    width:
                      carouselCount <= 1
                        ? "100%"
                        : `${(carouselIndex / Math.max(1, carouselCount - 1)) * 100}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="font-host-grotesk text-sm font-bold text-rellia-teal/60">
                  {carouselCount ? carouselIndex + 1 : 0} / {carouselCount || 0}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => carouselApi?.scrollPrev?.()}
                    disabled={!canScrollPrev}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-rellia-teal shadow-sm transition hover:bg-rellia-teal hover:border-rellia-teal hover:text-white disabled:opacity-40"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => carouselApi?.scrollNext?.()}
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

