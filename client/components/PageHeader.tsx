import type { ReactNode } from "react"
import { CalendarDays } from "lucide-react"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { HEADING_PAGE, HEADING_PAGE_SUBTITLE } from "@/lib/typography"
import { cmsDisplayText } from "@/lib/cmsStega"

/** Default page title size — matches Stories and standard `PageHeader` pages. Use with `font-bold leading-tight tracking-tight` plus text color. */
export const PAGE_HEADER_TITLE_SIZE_CLASS = HEADING_PAGE

/** Default subtitle size under the page title. */
export const PAGE_HEADER_SUBTITLE_SIZE_CLASS = HEADING_PAGE_SUBTITLE

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
  effectiveDatePlacement?: "top" | "bottom"
}

const DARK_BG = [
  "overflow-hidden relative",
  "bg-gradient-to-br from-[#071f26] via-rellia-teal to-[#144853]",
  "pt-24 pb-12 md:pt-32 md:pb-16",
].join(" ")

const LIGHT_BG = [
  "overflow-hidden relative",
  "bg-gradient-to-br from-rellia-greyTeal via-rellia-cream to-white",
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
  effectiveDatePlacement = "top",
}: PageHeaderProps) {
  const isDark = variant === "dark"
  const effectiveDateTrimmed = effectiveDate?.trim() ?? ""
  const renderedSubtitle =
    typeof subtitle === "string" ? cmsDisplayText(subtitle) : subtitle

  return (
    <section className={cn(isDark ? DARK_BG : LIGHT_BG, className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute inset-0",
            isDark
              ? "bg-[radial-gradient(ellipse_90%_70%_at_0%_0%,rgba(157,214,208,0.42),transparent_55%),radial-gradient(ellipse_75%_55%_at_100%_20%,rgba(255,255,255,0.14),transparent_50%),radial-gradient(ellipse_65%_50%_at_50%_100%,rgba(157,214,208,0.28),transparent_58%)]"
              : "bg-[radial-gradient(ellipse_85%_65%_at_10%_0%,rgba(157,214,208,0.55),transparent_52%),radial-gradient(ellipse_70%_50%_at_95%_30%,rgba(13,53,64,0.08),transparent_55%),radial-gradient(ellipse_60%_45%_at_40%_100%,rgba(197,216,213,0.65),transparent_60%)]",
          )}
        />
        <div
          className={cn(
            "absolute -left-20 -top-24 h-[380px] w-[380px] rounded-full blur-3xl md:h-[500px] md:w-[500px]",
            isDark ? "bg-rellia-mint/40" : "bg-rellia-mint/35",
          )}
        />
        <div
          className={cn(
            "absolute -right-12 top-1/4 h-[440px] w-[440px] -translate-y-1/4 rounded-full blur-3xl md:-right-24 md:h-[540px] md:w-[540px]",
            isDark ? "bg-white/10" : "bg-rellia-teal/10",
          )}
        />
        <div
          className={cn(
            "absolute bottom-[-180px] left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-3xl md:h-[580px] md:w-[580px]",
            isDark ? "bg-rellia-mint/30" : "bg-rellia-greyTeal/80",
          )}
        />
        {isDark ? (
          <div className="absolute inset-0 bg-gradient-to-tr from-rellia-mint/18 via-transparent to-transparent" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-rellia-mint/15" />
        )}
        <div
          className={cn(
            "absolute inset-0 mix-blend-soft-light",
            isDark
              ? "opacity-25 [background-image:linear-gradient(125deg,rgba(255,255,255,0.08)_0%,transparent_42%,rgba(157,214,208,0.12)_100%)]"
              : "opacity-30 [background-image:linear-gradient(120deg,rgba(255,255,255,0.65)_0%,transparent_45%,rgba(13,53,64,0.04)_100%)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.035] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
        <ScrollReveal>
          {effectiveDateTrimmed && effectiveDatePlacement === "top" ? (
            <div
              className={cn(
                "mb-6 flex w-fit items-center gap-3 md:mb-7 md:gap-3.5",
                isDark ? "text-white" : "text-black",
              )}
              role="note"
              aria-label={`Effective date ${effectiveDateTrimmed}`}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                  isDark
                    ? "border-white/20 bg-white/10 text-rellia-mint"
                    : "border-black/10 bg-white/80 text-rellia-teal shadow-sm",
                )}
                aria-hidden
              >
                <CalendarDays className="h-[18px] w-[18px]" aria-hidden strokeWidth={2.25} />
              </span>
              <p className={cn("font-urbanist text-base leading-snug md:text-lg")}>
                <span className={cn(isDark ? "text-white/75" : "text-black/55")}>Effective date</span>{" "}
                <span className={cn("font-bold", isDark ? "text-white" : "text-rellia-teal")}>
                  {effectiveDateTrimmed}
                </span>
              </p>
            </div>
          ) : null}
          <div className="relative w-fit">
            <h1
              className={cn(
                "relative font-bold leading-tight tracking-tight",
                isDark
                  ? "text-rellia-mint [&_span]:!text-rellia-mint [&_strong]:!text-rellia-mint [&_em]:!text-rellia-mint"
                  : "text-rellia-teal [&_span]:!text-rellia-teal [&_strong]:!text-rellia-teal [&_em]:!text-rellia-teal",
                titleClassName ?? PAGE_HEADER_TITLE_SIZE_CLASS,
                "mb-5",
              )}
            >
              {title}
            </h1>
          </div>

          {renderedSubtitle ? (
            <div
              className={cn(
                "max-w-3xl font-urbanist leading-relaxed",
                isDark
                  ? "text-white [&_span]:!text-white [&_strong]:!text-white"
                  : "text-black/85 [&_span]:!text-black/85 [&_strong]:!text-black/85",
                subtitleClassName ?? PAGE_HEADER_SUBTITLE_SIZE_CLASS,
              )}
            >
              {renderedSubtitle}
            </div>
          ) : null}

          {effectiveDateTrimmed && effectiveDatePlacement === "bottom" ? (
            <div className="mt-7 flex items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                  isDark ? "border-white/20 bg-white/10 text-rellia-mint" : "border-black/10 bg-white/80 text-rellia-teal",
                )}
                aria-hidden
              >
                <CalendarDays className="h-4 w-4" aria-hidden strokeWidth={2.25} />
              </span>
              <p
                className={cn(
                  "font-urbanist text-sm leading-snug",
                  isDark ? "text-white/85" : "text-black/70",
                )}
                role="note"
                aria-label={`Effective date ${effectiveDateTrimmed}`}
              >
                <span className={cn(isDark ? "text-white" : "text-black/70")}>Effective date </span>
                <span className={cn("font-semibold", isDark ? "text-rellia-mint" : "text-rellia-teal")}>
                  {effectiveDateTrimmed}
                </span>
              </p>
            </div>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  )
}

