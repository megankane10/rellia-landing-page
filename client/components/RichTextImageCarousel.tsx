import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import ImageExpandModal from "@/components/ImageExpandModal"

export type RichTextCarouselSlide = {
  imageSrc: string
  alt: string
  caption?: string
}

export type RichTextImageCarouselProps = {
  title?: string
  slides: RichTextCarouselSlide[]
  className?: string
}

export const RichTextImageCarousel = ({ title, slides, className }: RichTextImageCarouselProps) => {
  const validSlides = slides.filter((s) => s.imageSrc?.trim() && s.alt?.trim())
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: validSlides.length > 1 })
  const [selected, setSelected] = useState(0)
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("reInit", onSelect)
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  const handleScrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const handleScrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (validSlides.length === 0) return null

  const showNav = validSlides.length > 1

  return (
    <div
      className={cn("w-full", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={title?.trim() || "Image gallery"}
    >
      {title?.trim() ? (
        <h2 className="mb-4 mt-8 font-host-grotesk text-2xl font-bold leading-snug text-black first:mt-0 md:text-3xl">
          {title.trim()}
        </h2>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {validSlides.map((slide, index) => (
              <div key={`${slide.imageSrc}-${index}`} className="min-w-0 flex-[0_0_100%]">
                <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
                  <img
                    src={slide.imageSrc.trim()}
                    alt={slide.alt.trim()}
                    className={cn(
                      "h-full w-full object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200",
                      index === 0 && "object-top",
                    )}
                    onClick={() => setActiveImage({ src: slide.imageSrc.trim(), alt: slide.alt.trim() })}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                {slide.caption?.trim() ? (
                  <p className="border-t border-black/10 bg-white px-4 py-3 font-urbanist text-sm leading-snug text-black/55 md:px-5 md:text-[15px]">
                    {slide.caption.trim()}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {showNav ? (
          <>
            <button
              type="button"
              className={cn(
                "absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full",
                "border border-black/10 bg-white/95 text-rellia-teal shadow-sm backdrop-blur-sm",
                "transition-colors hover:bg-rellia-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-40",
              )}
              onClick={handleScrollPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              className={cn(
                "absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full",
                "border border-black/10 bg-white/95 text-rellia-teal shadow-sm backdrop-blur-sm",
                "transition-colors hover:bg-rellia-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-40",
              )}
              onClick={handleScrollNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {showNav ? (
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Slide indicators">
          {validSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Go to slide ${i + 1} of ${validSlides.length}`}
              className={cn(
                "h-2 rounded-full transition-[width,background-color] duration-200",
                i === selected ? "w-8 bg-rellia-teal" : "w-2 bg-black/20 hover:bg-black/35",
              )}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
      ) : null}

      <ImageExpandModal
        src={activeImage?.src ?? null}
        alt={activeImage?.alt ?? ""}
        open={Boolean(activeImage)}
        onOpenChange={(open) => !open && setActiveImage(null)}
      />
    </div>
  )
}
