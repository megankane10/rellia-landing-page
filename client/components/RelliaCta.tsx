import type { ReactNode } from "react"
import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { HEADING_CTA_BAND_COMPACT, HEADING_CTA_BAND_DEFAULT } from "@/lib/typography"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import { cmsCleanText, cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"
import { stegaClean } from "@sanity/client/stega"

/**
 * One CTA action — either an internal route (`to`) or an external link / mailto (`href`).
 * Provide exactly one of the two.
 */
export type RelliaCtaAction = {
  label: string
  to?: string
  href?: string
  /** Open the link in a new tab. Only meaningful with `href`. */
  external?: boolean
}

/** Use `to` for same-origin app routes so the SPA navigates without a full reload. */
export const ctaActionFromHref = (label: string, href: string): RelliaCtaAction => {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return { label, to: href }
  }
  return { label, href }
}

/** Secondary (or optional) CTA — omitted unless both label and link are non-empty. */
export const optionalCtaAction = (
  label?: string | null,
  href?: string | null,
): RelliaCtaAction | undefined => {
  const trimmedLabel = cmsCleanText(label)
  const trimmedHref = typeof href === "string" ? href.trim() : ""
  if (!trimmedLabel || !trimmedHref) return undefined
  return ctaActionFromHref(trimmedLabel, trimmedHref)
}

const stripCtaTitleMarkers = (title: string) => title.replace(/\*\*/g, "")

export type RelliaCtaProps = {
  /** Main headline — uniform teal typography (no inline emphasis markers). */
  title: string
  /** Optional supporting paragraph beneath the title. */
  body?: string
  /** Required primary action — teal pill; mint fill + lift on hover (`relliaCtaPrimary`). */
  primary: RelliaCtaAction
  /** Optional secondary action — white pill, teal border/text. */
  secondary?: RelliaCtaAction
  /** Smaller typography for shorter CTAs (FAQ, etc.) */
  size?: "default" | "compact"
  /** Render the primary action as a button or a text link. */
  primaryStyle?: "button" | "text"
  /** Override the outer section className (spacing against page content above). */
  className?: string
  /** Small gap above the band; matches the background of the section directly above. */
  aboveSectionTone?: "white" | "grey"
  /** Optional icon to display above the title */
  icon?: ReactNode
  /** Override the outer section rounding (defaults to rounded top corners). */
  roundedClassName?: string
  /** Optional override for supporting paragraph typography. */
  bodyClassName?: string
}

function CtaActionButton({
  action,
  variant,
}: {
  action: RelliaCtaAction
  variant: "primary" | "secondary"
}) {
  const content = (
    <>
      {cmsDisplayText(action.label)}
      <ArrowRight />
    </>
  )

  const heroWideButtonClass =
    "w-full justify-center sm:flex-1 sm:min-w-0"

  const relliaVariant = variant === "primary" ? "relliaCtaPrimary" : "relliaCtaSecondary"

  if (action.to) {
    return (
      <RelliaAction asChild variant={relliaVariant} size="comfortable" className={heroWideButtonClass}>
        <Link to={action.to}>{content}</Link>
      </RelliaAction>
    )
  }

  return (
    <RelliaAction asChild variant={relliaVariant} size="comfortable" className={heroWideButtonClass}>
      <a
        href={action.href}
        {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    </RelliaAction>
  )
}

function CtaActionTextLink({ action }: { action: RelliaCtaAction }) {
  const content = (
    <>
      {cmsDisplayText(action.label)}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </>
  )

  const linkClassName =
    "inline-flex items-center justify-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:text-rellia-teal hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-greyTeal"

  if (action.to) {
    return (
      <Link to={action.to} className={linkClassName} aria-label={cmsCleanText(action.label)}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={action.href}
      className={linkClassName}
      aria-label={cmsCleanText(action.label)}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  )
}

/**
 * Bottom-of-page CTA on the grey-teal band. Radial blob behind copy; teal headline;
 * black subcopy; primary teal button with white hover fill sweep; optional outline secondary.
 */
export default function RelliaCta({
  title,
  body,
  primary,
  secondary,
  size = "default",
  primaryStyle = "button",
  className,
  icon,
  aboveSectionTone,
  roundedClassName = "rounded-t-[48px] md:rounded-t-[80px]",
  bodyClassName,
}: RelliaCtaProps) {
  const displayTitle = useMemo(() => {
    if (isVisualEditingPreview()) return cmsDisplayText(title)
    return stripCtaTitleMarkers(stegaClean(title))
  }, [title])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--footer-backdrop", "#C5D8D5")
    return () => {
      root.style.removeProperty("--footer-backdrop")
    }
  }, [])

  const aboveGapClass =
    aboveSectionTone === "white"
      ? "bg-white"
      : aboveSectionTone === "grey"
        ? "bg-rellia-greyTeal"
        : null

  return (
    <>
      {aboveGapClass ? (
        <div aria-hidden className={cn("w-full", aboveGapClass, "h-5 md:h-7 lg:h-8")} />
      ) : null}
      <section
        className={cn(
          "relative mt-0 flex w-full flex-col justify-center overflow-hidden bg-rellia-greyTeal px-[30px] pt-[7.5rem] pb-[7.5rem] md:mt-0 md:pt-[10.5rem] md:pb-[10.5rem] lg:mt-0 lg:pt-[13.5rem] lg:pb-[13.5rem]",
          roundedClassName,
          className,
        )}
      >
      <ScrollReveal
        variant="ctaReveal"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[18%] h-[min(92vw,520px)] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-100 blur-[20px] sm:top-[22%] sm:h-[min(82vw,600px)] sm:w-[min(82vw,600px)] md:top-[26%] md:h-[min(60vw,720px)] md:w-[min(60vw,720px)] lg:top-[28%] lg:h-[min(52vw,760px)] lg:w-[min(52vw,760px)]"
          style={{
            background:
              "linear-gradient(180deg, #C5D8D5 0%, #9DD6D0 52%, #EEF2F2 100%)",
          }}
        />
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" className="relative z-10 w-full">
        <div className="relative mx-auto w-full max-w-[1300px]">
          <div className="relative mx-auto flex w-full flex-col items-center text-center">
            {icon && <div className="mb-8">{icon}</div>}
            <h2
              className={cn(
                "max-w-4xl font-host-grotesk font-medium tracking-tight leading-[1.12] text-rellia-teal",
                size === "compact" ? HEADING_CTA_BAND_COMPACT : HEADING_CTA_BAND_DEFAULT,
              )}
            >
              {displayTitle}
            </h2>

            {body ? (
              <p
                className={cn(
                  "mt-5 max-w-2xl font-urbanist leading-relaxed text-black",
                  size === "compact" ? "text-base md:text-lg" : "text-lg md:text-xl lg:text-2xl",
                  bodyClassName,
                )}
              >
                {cmsDisplayText(body)}
              </p>
            ) : null}

            {primaryStyle === "text" ? (
              <div className="mt-6">
                <CtaActionTextLink action={primary} />
              </div>
            ) : (
              <div className="mt-12 flex w-full max-w-3xl flex-col gap-4 sm:mt-14 sm:flex-row sm:items-stretch">
                <CtaActionButton action={primary} variant="primary" />
                {secondary ? <CtaActionButton action={secondary} variant="secondary" /> : null}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none z-[1]" />
      </section>
    </>
  )
}
