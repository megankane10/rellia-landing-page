import type { ReactNode } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"

/** Default page title size — matches Stories and standard `PageHeader` pages. Use with `font-bold leading-tight tracking-tight` plus text color. */
export const PAGE_HEADER_TITLE_SIZE_CLASS = "text-4xl md:text-5xl lg:text-6xl"

/** Default subtitle size under the page title. */
export const PAGE_HEADER_SUBTITLE_SIZE_CLASS = "text-base md:text-lg"

/** Dark hero subtitle — same rhythm as default `PageHeader` subtitle (Urbanist, relaxed, white/80). */
export const PAGE_HEADER_DARK_SUBTITLE_CLASS =
  "max-w-3xl font-urbanist leading-relaxed text-white/80 text-base md:text-lg"

type PageHeaderVariant = "dark" | "light"

export type PageHeaderProps = {
  title: ReactNode
  subtitle?: ReactNode
  variant?: PageHeaderVariant
  className?: string
  /** Override default display title scale (e.g. tighter About page) */
  titleClassName?: string
  subtitleClassName?: string
}

const DARK_BG = [
  "bg-rellia-teal overflow-hidden",
  "relative",
  "pt-24 pb-12 md:pt-32 md:pb-16",
].join(" ")

const LIGHT_BG = [
  "bg-rellia-cream overflow-hidden",
  "relative",
  "pt-24 pb-12 md:pt-32 md:pb-16",
].join(" ")

export default function PageHeader({
  title,
  subtitle,
  variant = "dark",
  className,
  titleClassName,
  subtitleClassName,
}: PageHeaderProps) {
  const isDark = variant === "dark"

  return (
    <section className={cn(isDark ? DARK_BG : LIGHT_BG, className)}>
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r",
            isDark ? "from-rellia-teal/92 via-rellia-teal/70 to-rellia-teal/45" : "from-rellia-cream via-white/60 to-rellia-cream",
          )}
        />
        <div
          className={cn(
            "absolute -left-24 -top-28 h-[420px] w-[420px] md:h-[520px] md:w-[520px] rounded-full blur-3xl",
            isDark ? "bg-rellia-mint/16 md:bg-rellia-mint/25" : "bg-rellia-mint/20",
          )}
        />
        <div
          className={cn(
            "absolute -right-16 sm:-right-28 md:-right-40 top-1/3 h-[520px] w-[520px] md:h-[560px] md:w-[560px] -translate-y-1/2 rounded-full blur-3xl",
            isDark ? "bg-white/7 md:bg-white/10" : "bg-rellia-teal/10",
          )}
        />
        <div
          className={cn(
            "absolute left-1/3 bottom-[-220px] h-[520px] w-[520px] md:h-[620px] md:w-[620px] -translate-x-1/2 rounded-full blur-3xl",
            "bg-rellia-mint/10 md:bg-rellia-mint/15",
          )}
        />
        {/* Extra small mint blobs on mobile (adds depth without overpowering teal) */}
        {isDark ? (
          <>
            <div
              aria-hidden
              className="md:hidden absolute right-10 top-16 h-24 w-24 rounded-full bg-rellia-mint/18 blur-2xl"
            />
            <div
              aria-hidden
              className="md:hidden absolute left-10 bottom-20 h-20 w-20 rounded-full bg-rellia-mint/14 blur-2xl"
            />
            <div
              aria-hidden
              className="md:hidden absolute right-20 bottom-10 h-16 w-16 rounded-full bg-rellia-mint/12 blur-2xl"
            />
          </>
        ) : null}
        <div
          className={cn(
            "absolute inset-0 opacity-[0.22] mix-blend-soft-light",
            isDark
              ? "[background-image:radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.12),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(255,255,255,0.14),transparent_55%)]"
              : "opacity-[0.18] mix-blend-multiply [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.09),transparent_55%)]",
          )}
        />
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
        <ScrollReveal>
          <div className="relative w-fit">
            <h1
              className={cn(
                "relative font-bold leading-tight tracking-tight",
                isDark ? "text-white" : "text-black",
                titleClassName ?? PAGE_HEADER_TITLE_SIZE_CLASS,
                "mb-5",
              )}
            >
              {title}
            </h1>
          </div>

          {subtitle ? (
            <div
              className={cn(
                "max-w-3xl font-urbanist leading-relaxed",
                isDark ? "text-white/80" : "text-black/65",
                subtitleClassName ?? PAGE_HEADER_SUBTITLE_SIZE_CLASS,
              )}
            >
              {subtitle}
            </div>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  )
}

