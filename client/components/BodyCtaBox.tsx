import { Link } from "react-router-dom"
import { Rocket } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { resolveLucideIcon } from "@/lib/resolveLucideIcon"
import { cmsCleanText, cmsDisplayText, cmsHasDisplayText } from "@/lib/cmsStega"
import {
  RichTextTealPanel,
  richTextTealPanelDescriptionClassName,
  richTextTealPanelPaddingClassName,
  richTextTealPanelQuoteClassName,
} from "@/components/RichTextTealPanel"

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
  variant = "heroSolidOnTeal",
  className,
}: {
  label: string
  href: string
  variant?: "heroSolidOnTeal" | "heroGhostOnTeal"
  className?: string
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
        className={cn("w-full sm:w-auto", className)}
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
      className={cn("w-full sm:w-auto", className)}
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
 * Call-to-action panel for portable text (`bodyCtaBox`) — matches quote box teal panel styling.
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
    <RichTextTealPanel className={cn("my-12 md:my-14", richTextTealPanelPaddingClassName)}>
      <div className="relative z-10">
        {cmsHasDisplayText(iconKey) ? (
          <Icon className="mb-4 h-8 w-8 text-rellia-mint" aria-hidden />
        ) : null}
        <p className={richTextTealPanelQuoteClassName}>{cmsDisplayText(title)}</p>
        {cmsHasDisplayText(body) ? (
          <p className={richTextTealPanelDescriptionClassName}>{cmsDisplayText(body)}</p>
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
              variant="heroGhostOnTeal"
              className="border-white/45 text-white hover:border-white/80"
            />
          ) : null}
        </div>
      </div>
    </RichTextTealPanel>
  )
}
