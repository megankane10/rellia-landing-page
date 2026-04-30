import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import { BackgroundBeams } from "@/components/ui/beams"

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

export type RelliaCtaProps = {
  /** Main headline inside the card. */
  title: string
  /** Optional supporting paragraph beneath the title. */
  body?: string
  /** Required primary action — rendered as the prominent mint button. */
  primary: RelliaCtaAction
  /** Optional secondary action — rendered as a ghost-on-teal button. */
  secondary?: RelliaCtaAction
  /** Smaller typography for shorter CTAs (FAQ, etc.) */
  size?: "default" | "compact"
  /** Render the primary action as a button or a text link. */
  primaryStyle?: "button" | "text"
  /** Override the outer section className (advanced — defaults handle spacing/footer gap). */
  className?: string
}

function CtaActionButton({
  action,
  variant,
}: {
  action: RelliaCtaAction
  variant: "heroSolidOnTeal" | "heroGhostOnTeal"
}) {
  const content = (
    <>
      {action.label}
      <ArrowRight />
    </>
  )

  const responsiveCtaClass =
    "w-full min-w-0 max-w-full justify-center px-4 py-3.5 text-sm leading-snug sm:w-auto sm:px-8 sm:py-4 sm:text-base sm:leading-normal whitespace-normal sm:whitespace-nowrap"

  if (action.to) {
    return (
      <RelliaAction asChild variant={variant} size="comfortable" className={responsiveCtaClass}>
        <Link to={action.to}>{content}</Link>
      </RelliaAction>
    )
  }

  return (
    <RelliaAction asChild variant={variant} size="comfortable" className={responsiveCtaClass}>
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
    "inline-flex items-center justify-center gap-2 font-host-grotesk text-sm font-semibold text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal"

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
 * Modular bottom-of-page call to action.
 *
 * Renders a contained, rounded teal card centered in a max-width container, with built-in
 * vertical spacing so it stays visually separated from both the section above and the footer
 * below. Used as the closing CTA on every public page.
 */
export default function RelliaCta({
  title,
  body,
  primary,
  secondary,
  size = "default",
  primaryStyle = "button",
  className,
}: RelliaCtaProps) {
  return (
    <section
      className={cn(
        "w-full bg-white px-6 md:px-10 pt-12 md:pt-16 pb-20 md:pb-28 overflow-hidden",
        className,
      )}
    >
      <div className="max-w-[1300px] mx-auto">
        <ScrollReveal>
          <div
            className={cn(
              "relative overflow-hidden rounded-[24px] md:rounded-[28px]",
              "bg-rellia-teal text-white",
              "px-6 py-12 sm:px-10 sm:py-14 md:px-14 md:py-16",
              "border border-white/10",
              "shadow-[0_40px_110px_-85px_rgba(0,0,0,0.7)]",
            )}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <BackgroundBeams className="opacity-[0.16]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
              <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_15%_25%,rgba(157,214,208,0.38),transparent_52%),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.14),transparent_55%),radial-gradient(circle_at_40%_95%,rgba(157,214,208,0.26),transparent_55%)]" />
            </div>

            <div className="relative z-10 mx-auto flex w-full flex-col items-start text-left">
              <h2
                className={cn(
                  "text-white font-medium tracking-tight leading-[1.1] w-full",
                  size === "compact" ? "text-2xl md:text-3xl lg:text-4xl" : "text-3xl md:text-4xl lg:text-5xl",
                )}
              >
                {title}
              </h2>

              {body ? (
                <p
                  className={cn(
                    "mt-4 font-urbanist text-white/85 leading-relaxed max-w-2xl",
                    size === "compact" ? "text-sm md:text-base" : "text-lg md:text-xl",
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
                <div className="mt-10 flex w-full max-w-full flex-col items-stretch justify-start gap-4 sm:flex-row sm:items-center sm:px-0">
                  <CtaActionButton action={primary} variant="heroSolidOnTeal" />
                  {secondary ? <CtaActionButton action={secondary} variant="heroGhostOnTeal" /> : null}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
