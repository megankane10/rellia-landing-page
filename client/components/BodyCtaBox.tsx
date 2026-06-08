import { Link } from "react-router-dom"
import { HEADING_CARD } from "@/lib/typography"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"

export type BodyCtaBoxProps = {
  title: string
  body?: string | null
  buttonLabel: string
  buttonHref: string
  secondaryButtonLabel?: string | null
  secondaryButtonHref?: string | null
}

const CtaButton = ({
  label,
  href,
  variant = "relliaCtaPrimary",
}: {
  label: string
  href: string
  variant?: "relliaCtaPrimary" | "outlineOnWhite"
}) => {
  const trimmedHref = href.trim() || "/"
  const useRouterLink = trimmedHref.startsWith("/") && !trimmedHref.startsWith("//")

  if (useRouterLink) {
    return (
      <RelliaAction
        asChild
        variant={variant}
        size="comfortable"
        className="w-full sm:w-auto"
        aria-label={label}
      >
        <Link to={trimmedHref}>{label}</Link>
      </RelliaAction>
    )
  }

  return (
    <RelliaAction
      asChild
      variant={variant}
      size="comfortable"
      className="w-full sm:w-auto"
      aria-label={label}
    >
      <a
        href={trimmedHref}
        target={/^mailto:|^tel:/i.test(trimmedHref) ? undefined : "_blank"}
        rel={/^mailto:|^tel:/i.test(trimmedHref) ? undefined : "noopener noreferrer"}
      >
        {label}
      </a>
    </RelliaAction>
  )
}

/**
 * Call-to-action panel matching Story article CTAs — use inside portable text (`bodyCtaBox`).
 */
export const BodyCtaBox = ({
  title,
  body,
  buttonLabel,
  buttonHref,
  secondaryButtonLabel,
  secondaryButtonHref,
}: BodyCtaBoxProps) => {
  const secondaryLabel = secondaryButtonLabel?.trim() ?? ""
  const secondaryHref = secondaryButtonHref?.trim() ?? ""
  const showSecondary = Boolean(secondaryLabel && secondaryHref)

  return (
    <div className="my-10 rounded-3xl border border-black/10 bg-white px-7 py-7 md:my-12 md:px-10 md:py-9">
      <h3 className={cn("font-host-grotesk font-semibold tracking-tight text-black", HEADING_CARD)}>{title}</h3>
      {body?.trim() ? (
        <p className="mt-3 font-urbanist text-base leading-relaxed text-black/65 md:text-lg">{body.trim()}</p>
      ) : null}
      <div
        className={cn(
          "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
          showSecondary && "sm:gap-4",
        )}
      >
        <CtaButton label={buttonLabel} href={buttonHref} />
        {showSecondary ? (
          <CtaButton
            label={secondaryLabel}
            href={secondaryHref}
            variant="outlineOnWhite"
          />
        ) : null}
      </div>
    </div>
  )
}
