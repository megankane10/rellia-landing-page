import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
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

export type RelliaCtaProps = {
  /** Main headline inside the card. */
  title: string
  /** Optional supporting paragraph beneath the title. */
  body?: string
  /** Required primary action — rendered as the prominent mint button. */
  primary: RelliaCtaAction
  /** Optional secondary action — rendered as a ghost-on-teal button. */
  secondary?: RelliaCtaAction
  /** Override the outer section className (advanced — defaults handle spacing/footer gap). */
  className?: string
}

function CtaActionButton({
  action,
  variant,
}: {
  action: RelliaCtaAction
  variant: "mintOnTealStrip" | "heroGhostOnTeal"
}) {
  const content = (
    <>
      {action.label}
      <ArrowRight />
    </>
  )

  if (action.to) {
    return (
      <RelliaAction asChild variant={variant} size="comfortable">
        <Link to={action.to}>{content}</Link>
      </RelliaAction>
    )
  }

  return (
    <RelliaAction asChild variant={variant} size="comfortable">
      <a
        href={action.href}
        {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    </RelliaAction>
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
          <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-rellia-teal text-white px-8 py-14 md:px-16 md:py-20 text-center shadow-2xl">
            {/* Decorative grid lines — same modernist cue as the Network hero */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
            {/* Mint glow */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-25 pointer-events-none"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_var(--tw-gradient-stops))] from-rellia-mint via-transparent to-transparent blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
              <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                {title}
              </h2>

              {body ? (
                <p className="mt-5 font-urbanist text-white/75 text-lg md:text-xl leading-relaxed max-w-2xl">
                  {body}
                </p>
              ) : null}

              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <CtaActionButton action={primary} variant="mintOnTealStrip" />
                {secondary ? (
                  <CtaActionButton action={secondary} variant="heroGhostOnTeal" />
                ) : null}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
