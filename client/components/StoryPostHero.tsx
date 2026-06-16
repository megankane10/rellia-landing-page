import type { ReactNode } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"

export type StoryPostHeroLayout = "background" | "block"

export type StoryPostHeroProps = {
  tag: string
  title: string
  excerpt?: string | null
  coverImageSrc?: string | null
  coverImageAlt?: string | null
  layout?: StoryPostHeroLayout
  toAbsoluteImageUrl: (src: string) => string
  shareBlock: ReactNode
}

export const StoryPostHero = ({
  tag,
  title,
  excerpt,
  coverImageSrc,
  coverImageAlt,
  layout = "block",
  toAbsoluteImageUrl,
  shareBlock,
}: StoryPostHeroProps) => {
  const coverSrc = coverImageSrc?.trim() || null
  const coverAlt = (coverImageAlt?.trim() || title).trim()
  const useBackgroundLayout = layout === "background" && Boolean(coverSrc)

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-b-[2.5rem] md:rounded-b-[3.5rem]",
        useBackgroundLayout
          ? "flex min-h-[520px] flex-col bg-rellia-teal pt-24 pb-10 text-white md:min-h-[620px] md:pt-32 md:pb-12 lg:pb-14"
          : cn(
              "bg-gradient-to-br from-[#071f26] via-rellia-teal to-[#144853]",
              "pt-24 pb-12 md:pt-32 md:pb-16 lg:pb-20",
              "text-white",
            ),
      )}
    >
      {useBackgroundLayout ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <img
            src={toAbsoluteImageUrl(coverSrc!)}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-[#0d3540]/92" />
          <div className="absolute inset-0 bg-gradient-to-tr from-rellia-teal/35 via-transparent to-black/20" />
        </div>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-rellia-mint/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
      )}

      <div
        className={cn(
          "relative z-10 mx-auto max-w-[1300px] px-6 md:px-10",
          useBackgroundLayout && "flex min-h-[inherit] flex-1 flex-col",
        )}
      >
        <div
          className={cn(
            "mx-auto w-full max-w-[1100px]",
            useBackgroundLayout && "flex min-h-[inherit] flex-1 flex-col",
          )}
        >
          <ScrollReveal className={useBackgroundLayout ? "flex min-h-[inherit] flex-1 flex-col" : undefined}>
            <div
              className={cn(
                "flex min-w-0 flex-col",
                useBackgroundLayout && "min-h-[inherit] flex-1",
                !useBackgroundLayout && "md:relative",
              )}
            >
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
                <p
                  className={cn(
                    "max-w-3xl font-urbanist text-base font-normal leading-relaxed text-white/85 md:text-lg",
                    useBackgroundLayout ? "mt-6 md:mt-8" : "mt-4",
                  )}
                >
                  {excerpt}
                </p>
              ) : null}

              {!useBackgroundLayout && coverSrc ? (
                <div className="mt-8 md:mt-10">
                  <div className="relative">
                    <figure className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-black/20 shadow-[0_24px_56px_-28px_rgba(0,0,0,0.55)]">
                      <img
                        src={toAbsoluteImageUrl(coverSrc)}
                        alt={coverAlt}
                        className="block h-auto w-full"
                        loading="eager"
                        fetchpriority="high"
                      />
                    </figure>
                    <aside
                      className="hidden md:flex md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2"
                      aria-label="Share this story"
                    >
                      {shareBlock}
                    </aside>
                  </div>
                  <div className="mt-8 md:hidden">{shareBlock}</div>
                </div>
              ) : null}

              {useBackgroundLayout ? (
                <div className="mt-auto pt-10 pb-2 md:pt-14 md:pb-4">{shareBlock}</div>
              ) : !coverSrc ? (
                <>
                  <div className="mt-8 md:hidden">{shareBlock}</div>
                  <aside
                    className="hidden md:flex md:absolute md:right-0 md:top-6"
                    aria-label="Share this story"
                  >
                    {shareBlock}
                  </aside>
                </>
              ) : null}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
