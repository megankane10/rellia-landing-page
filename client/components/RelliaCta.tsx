import type { ReactNode } from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { HEADING_CTA_BAND_COMPACT, HEADING_CTA_BAND_DEFAULT } from "@/lib/typography"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"

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

/** Wrap phrases in `**double asterisks**` for teal emphasis on black headlines. */
const parseTitleEmphasis = (title: string): ReactNode[] => {
  const segments = title.split(/(\*\*[^*]+\*\*)/g)
  return segments.map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**") && segment.length >= 4) {
      const inner = segment.slice(2, -2)
      return (
        <span key={`e-${index}`} className="font-semibold text-rellia-teal">
          {inner}
        </span>
      )
    }
    return <span key={`t-${index}`}>{segment}</span>
  })
}

export type RelliaCtaProps = {
  /** Main headline — black; use `**phrase**` for teal highlight */
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
  /** Optional icon to display above the title */
  icon?: ReactNode
  /** Override the outer section rounding (defaults to rounded top corners). */
  roundedClassName?: string
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
      {action.label}
      <ArrowRight />
    </>
  )

  const responsiveCtaClass =
    "w-full min-w-0 max-w-full justify-center px-4 py-3.5 text-sm leading-snug sm:w-auto sm:px-8 sm:py-4 sm:text-base sm:leading-normal whitespace-normal sm:whitespace-nowrap focus-visible:ring-offset-rellia-greyTeal"

  const relliaVariant = variant === "primary" ? "relliaCtaPrimary" : "relliaCtaSecondary"

  if (action.to) {
    return (
      <RelliaAction asChild variant={relliaVariant} size="comfortable" className={responsiveCtaClass}>
        <Link to={action.to}>{content}</Link>
      </RelliaAction>
    )
  }

  return (
    <RelliaAction asChild variant={relliaVariant} size="comfortable" className={responsiveCtaClass}>
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
      {action.label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </>
  )

  const linkClassName =
    "inline-flex items-center justify-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:text-rellia-teal hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-greyTeal"

  if (action.to) {
    return (
      <Link to={action.to} className={linkClassName} aria-label={action.label}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={action.href}
      className={linkClassName}
      aria-label={action.label}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  )
}

/**
 * Bottom-of-page CTA on the grey-teal band. Radial blob behind copy; black headline with teal `**accents**`;
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
  roundedClassName = "rounded-t-[28px] md:rounded-t-[36px]",
}: RelliaCtaProps) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--footer-backdrop", "#C5D8D5")
    return () => {
      root.style.removeProperty("--footer-backdrop")
    }
  }, [])

  return (
    <section
      className={cn(
        "relative mt-0 flex w-full flex-col justify-center overflow-hidden bg-rellia-greyTeal px-[30px] pt-[7.5rem] pb-[9rem] md:mt-0 md:pt-[10.5rem] md:pb-48 lg:mt-0 lg:pt-[13.5rem] lg:pb-[15rem]",
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
                "max-w-4xl font-host-grotesk font-medium tracking-tight leading-[1.12] text-rellia-teal [&_span]:text-rellia-teal [&_span]:!text-rellia-teal",
                size === "compact" ? HEADING_CTA_BAND_COMPACT : HEADING_CTA_BAND_DEFAULT,
              )}
            >
              {parseTitleEmphasis(title)}
            </h2>

            {body ? (
              <p
                className={cn(
                  "mt-5 max-w-2xl font-urbanist leading-relaxed text-black",
                  size === "compact" ? "text-base md:text-lg" : "text-lg md:text-xl lg:text-2xl",
                )}
              >
                {body}
              </p>
            ) : null}

            {primaryStyle === "text" ? (
              <div className="mt-6">
                <CtaActionTextLink action={primary} />
              </div>
            ) : (
              <div className="mt-12 flex w-full max-w-full flex-col items-stretch justify-center gap-4 sm:mt-14 sm:flex-row sm:items-center">
                <CtaActionButton action={primary} variant="primary" />
                {secondary ? <CtaActionButton action={secondary} variant="secondary" /> : null}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none z-[1]" />
    </section>
  )
}
