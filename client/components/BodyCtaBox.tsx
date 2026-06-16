import { Link } from "react-router-dom"
import { Rocket } from "lucide-react"
import { HEADING_CARD } from "@/lib/typography"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { resolveLucideIcon } from "@/lib/resolveLucideIcon"
import { cmsCleanText, cmsDisplayText, cmsHasDisplayText } from "@/lib/cmsStega"

export type BodyCtaBoxProps = {
  title: string
  body?: string | null
  iconKey?: string | null
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
  const trimmedHref = cmsCleanText(href) || "/"
  const displayLabel = cmsDisplayText(label)
  const useRouterLink = trimmedHref.startsWith("/") && !trimmedHref.startsWith("//")

  if (useRouterLink) {
    return (
      <RelliaAction
        asChild
        variant={variant}
        size="comfortable"
        className="w-full sm:w-auto"
        aria-label={cmsCleanText(label)}
      >
        <Link to={trimmedHref}>{displayLabel}</Link>
      </RelliaAction>
    )
  }

  return (
    <RelliaAction
      asChild
      variant={variant}
      size="comfortable"
      className="w-full sm:w-auto"
      aria-label={cmsCleanText(label)}
    >
      <a
        href={trimmedHref}
        target={/^mailto:|^tel:/i.test(trimmedHref) ? undefined : "_blank"}
        rel={/^mailto:|^tel:/i.test(trimmedHref) ? undefined : "noopener noreferrer"}
      >
        {displayLabel}
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
  iconKey,
  buttonLabel,
  buttonHref,
  secondaryButtonLabel,
  secondaryButtonHref,
}: BodyCtaBoxProps) => {
  const secondaryLabel = secondaryButtonLabel ?? ""
  const secondaryHref = secondaryButtonHref ?? ""
  const showSecondary = cmsHasDisplayText(secondaryLabel) && cmsHasDisplayText(secondaryHref)
  const Icon = resolveLucideIcon(iconKey, Rocket)

  return (
    <div className="my-10 rounded-3xl border border-black/10 bg-white px-7 py-7 md:my-12 md:px-10 md:py-9">
      {cmsHasDisplayText(iconKey) ? (
        <Icon className="mb-4 h-8 w-8 text-rellia-teal" aria-hidden />
      ) : null}
      <h3 className={cn("font-host-grotesk font-semibold tracking-tight text-black", HEADING_CARD)}>
        {cmsDisplayText(title)}
      </h3>
      {cmsHasDisplayText(body) ? (
        <p className="mt-3 font-urbanist text-base leading-relaxed text-black/65 md:text-lg">
          {cmsDisplayText(body)}
        </p>
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
