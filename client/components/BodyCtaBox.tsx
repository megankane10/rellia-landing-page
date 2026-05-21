import { Link } from "react-router-dom"
import { HEADING_CARD } from "@/lib/typography"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"

export type BodyCtaBoxProps = {
  title: string
  body?: string | null
  buttonLabel: string
  buttonHref: string
}

/**
 * Call-to-action panel matching Story article CTAs — use inside portable text (`bodyCtaBox`).
 */
export const BodyCtaBox = ({ title, body, buttonLabel, buttonHref }: BodyCtaBoxProps) => {
  const href = buttonHref.trim() || "/"
  const useRouterLink = href.startsWith("/") && !href.startsWith("//")

  const buttonInner = buttonLabel

  const button = useRouterLink ? (
    <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable" aria-label={buttonLabel}>
      <Link to={href}>{buttonInner}</Link>
    </RelliaAction>
  ) : (
    <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable" aria-label={buttonLabel}>
      <a
        href={href}
        target={/^mailto:|^tel:/i.test(href) ? undefined : "_blank"}
        rel={/^mailto:|^tel:/i.test(href) ? undefined : "noopener noreferrer"}
      >
        {buttonInner}
      </a>
    </RelliaAction>
  )

  return (
    <div className="my-10 rounded-3xl border border-black/10 bg-white px-7 py-7 md:my-12 md:px-10 md:py-9">
      <h3 className={cn("font-host-grotesk font-semibold tracking-tight text-black", HEADING_CARD)}>{title}</h3>
      {body?.trim() ? (
        <p className="mt-3 font-urbanist text-base leading-relaxed text-black/65 md:text-lg">{body.trim()}</p>
      ) : null}
      <div className="mt-6">{button}</div>
    </div>
  )
}
