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
  /**
   * Renders a pill above the title, e.g. `March 18, 2026` → “Effective March 18, 2026”
   * (legal / policy pages).
   */
  effectiveDate?: string
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
  effectiveDate,
}: PageHeaderProps) {
  const isDark = variant === "dark"
  const effectiveDateTrimmed = effectiveDate?.trim() ?? ""

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
            isDark ? "bg-rellia-mint/35 md:bg-rellia-mint/40" : "bg-rellia-mint/25",
          )}
        />
        <div
          className={cn(
            "absolute -right-16 sm:-right-28 md:-right-40 top-1/3 h-[520px] w-[520px] md:h-[560px] md:w-[560px] -translate-y-1/2 rounded-full blur-3xl",
            isDark ? "bg-rellia-mint/20 md:bg-white/12" : "bg-rellia-teal/12",
          )}
        />
        <div
          className={cn(
            "absolute left-1/3 bottom-[-220px] h-[520px] w-[520px] md:h-[620px] md:w-[620px] -translate-x-1/2 rounded-full blur-3xl",
            isDark ? "bg-rellia-mint/25 md:bg-rellia-mint/30" : "bg-rellia-mint/18",
          )}
        />
        {/* Progressive mint-to-teal gradient overlay specifically visible on mobile, giving rich premium aesthetics */}
        {isDark && (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-tr from-rellia-mint/22 via-transparent to-rellia-mint/12 opacity-80 md:hidden pointer-events-none"
          />
        )}
        {/* Extra progressive mint blobs on mobile (adds rich depth and clear branding contrast) */}
        {isDark ? (
          <>
            <div
              aria-hidden
              className="md:hidden absolute right-6 top-12 h-36 w-36 rounded-full bg-rellia-mint/25 blur-3xl"
            />
            <div
              aria-hidden
              className="md:hidden absolute left-4 bottom-16 h-32 w-32 rounded-full bg-rellia-mint/22 blur-3xl"
            />
            <div
              aria-hidden
              className="md:hidden absolute right-16 bottom-4 h-28 w-28 rounded-full bg-rellia-mint/18 blur-3xl"
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
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
        <ScrollReveal>
          {effectiveDateTrimmed ? (
            <p
              className={cn(
                "mb-4 flex w-fit items-center rounded-full border px-4 py-1.5 font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em] md:mb-5 md:text-xs",
                isDark
                  ? "border-white/25 bg-white/10 text-white/90"
                  : "border-black/12 bg-white/80 text-black/70 shadow-sm",
              )}
            >
              Effective {effectiveDateTrimmed}
            </p>
          ) : null}
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

