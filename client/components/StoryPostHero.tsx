import type { ReactNode } from "react"
import { useState } from "react"
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
  const [layoutMode, setLayoutMode] = useState<"background" | "block">("background")

  const isBgMode = layoutMode === "background" && coverSrc

  return (
    <section 
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        isBgMode 
          ? "bg-rellia-teal text-white pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-[120px] lg:pb-[100px] group layout-background" 
          : "bg-rellia-cream text-black pt-24 pb-12 md:pt-32 md:pb-16"
      )}
    >
      {isBgMode ? (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={toAbsoluteImageUrl(coverSrc)}
            alt={coverAlt}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div 
            className="absolute inset-0" 
            style={{
              background: "linear-gradient(to right, rgba(13,53,64,0.97) 0%, rgba(13,53,64,0.85) 45%, rgba(13,53,64,0.4) 75%, rgba(13,53,64,0.15) 100%)"
            }}
          />
        </div>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full bg-rellia-mint/20 blur-3xl" />
          <div className="absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-rellia-teal/10 blur-3xl" />
          <div className="absolute bottom-[-220px] left-1/3 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-rellia-mint/15 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.18] mix-blend-multiply [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.09),transparent_55%)]" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 md:px-10">
        <div className="mx-auto w-full max-w-[1100px]">
          <ScrollReveal>
            <div
              className={cn(
                "flex flex-col gap-8",
                (coverSrc && !isBgMode) && "lg:grid lg:grid-cols-[minmax(0,1fr)_min(42%,440px)] lg:items-start lg:gap-10",
              )}
            >
              <div className={cn("flex min-w-0 flex-col", isBgMode ? "max-w-[850px] z-10" : "")}>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-rellia-mint px-3 py-1.5 shrink-0">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
                    <span className="font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em] text-rellia-teal">
                      {tag}
                    </span>
                  </div>

                  {coverSrc && (
                    <div className={cn(
                      "inline-flex items-center gap-0.5 rounded-full p-0.5 transition-colors duration-300",
                      isBgMode ? "bg-white/10" : "bg-black/[0.06]"
                    )}>
                      <button
                        type="button"
                        onClick={() => setLayoutMode("background")}
                        className={cn(
                          "rounded-full px-2.5 py-1 font-host-grotesk text-[9px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                          isBgMode
                            ? "bg-white text-rellia-teal shadow-sm"
                            : "text-black/60 hover:text-black"
                        )}
                      >
                        Background
                      </button>
                      <button
                        type="button"
                        onClick={() => setLayoutMode("block")}
                        className={cn(
                          "rounded-full px-2.5 py-1 font-host-grotesk text-[9px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                          !isBgMode
                            ? "bg-rellia-teal text-white shadow-sm"
                            : "text-white/60 hover:text-white"
                        )}
                      >
                        Block
                      </button>
                    </div>
                  )}
                </div>

                <h1 className={cn(
                  "mt-6 font-host-grotesk text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl",
                  isBgMode ? "text-white" : "text-rellia-teal"
                )}>
                  {title}
                </h1>
                {excerpt ? (
                  <p className={cn(
                    "mt-4 max-w-3xl font-urbanist text-base font-normal leading-relaxed md:text-lg",
                    isBgMode ? "text-white/90" : "text-black"
                  )}>
                    {excerpt}
                  </p>
                ) : null}

                <div className="h-8 md:h-10" aria-hidden />
                {shareBlock}
              </div>

              {(coverSrc && !isBgMode) ? (
                <figure className="relative w-full shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-[0_20px_48px_-28px_rgba(13,53,64,0.45)] aspect-[16/10] lg:aspect-[4/3]">
                  <img
                    src={toAbsoluteImageUrl(coverSrc)}
                    alt={coverAlt}
                    className="h-full w-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </figure>
              ) : null}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
