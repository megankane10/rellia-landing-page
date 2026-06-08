import type { ReactNode } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"

export type StoryPostHeroProps = {
  tag: string
  title: string
  excerpt?: string | null
  coverImageSrc?: string | null
  coverImageAlt?: string | null
  toAbsoluteImageUrl: (src: string) => string
  shareBlock: ReactNode
}

export const StoryPostHero = ({
  tag,
  title,
  excerpt,
  coverImageSrc,
  coverImageAlt,
  toAbsoluteImageUrl,
  shareBlock,
}: StoryPostHeroProps) => {
  const coverSrc = coverImageSrc?.trim() || null
  const coverAlt = (coverImageAlt?.trim() || title).trim()

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-b-[2.5rem] md:rounded-b-[3.5rem]",
        "bg-gradient-to-br from-[#071f26] via-rellia-teal to-[#144853]",
        "pt-24 pb-12 md:pt-32 md:pb-16 lg:pb-20",
        "text-white",
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-rellia-mint/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 md:px-10">
        <div className="mx-auto w-full max-w-[1100px]">
          <ScrollReveal>
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-rellia-mint px-3 py-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
                  <span className="font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em] text-rellia-teal">
                    {tag}
                  </span>
                </div>
              </div>

              <h1 className="mt-6 font-host-grotesk text-3xl font-medium leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
                {title}
              </h1>
              {excerpt ? (
                <p className="mt-4 max-w-3xl font-urbanist text-base font-normal leading-relaxed text-white/85 md:text-lg">
                  {excerpt}
                </p>
              ) : null}

              {coverSrc ? (
                <figure className="relative mt-8 aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-black/20 shadow-[0_24px_56px_-28px_rgba(0,0,0,0.55)] md:mt-10">
                  <img
                    src={toAbsoluteImageUrl(coverSrc)}
                    alt={coverAlt}
                    className="h-full w-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </figure>
              ) : null}

              <div className="h-8 md:h-10" aria-hidden />
              {shareBlock}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
