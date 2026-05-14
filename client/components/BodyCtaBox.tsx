import { Link } from "react-router-dom"

const buttonClassName =
  "inline-flex items-center rounded-full border-2 border-rellia-teal bg-white px-6 py-3 font-host-grotesk font-semibold text-rellia-teal transition-colors hover:bg-rellia-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2"

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

  const button = useRouterLink ? (
    <Link to={href} className={buttonClassName} aria-label={buttonLabel}>
      {buttonLabel}
    </Link>
  ) : (
    <a
      href={href}
      className={buttonClassName}
      aria-label={buttonLabel}
      target={/^mailto:|^tel:/i.test(href) ? undefined : "_blank"}
      rel={/^mailto:|^tel:/i.test(href) ? undefined : "noopener noreferrer"}
    >
      {buttonLabel}
    </a>
  )

  return (
    <div className="my-10 rounded-3xl border border-black/10 bg-white px-7 py-7 md:my-12 md:px-10 md:py-9">
      <h3 className="font-host-grotesk text-xl font-semibold tracking-tight text-black md:text-2xl">{title}</h3>
      {body?.trim() ? (
        <p className="mt-3 font-urbanist text-base leading-relaxed text-black/65 md:text-lg">{body.trim()}</p>
      ) : null}
      <div className="mt-6">{button}</div>
    </div>
  )
}
