import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href)

const normalizeHref = (href: string) => {
  const trimmed = href.trim()
  if (!trimmed) return "/"
  if (isExternalHref(trimmed)) return trimmed
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

type CmsCtaLinkProps = {
  href: string
  className?: string
  onClick?: () => void
  children: ReactNode
}

export const CmsCtaLink = ({ href, className, onClick, children }: CmsCtaLinkProps) => {
  const normalized = normalizeHref(href)

  if (isExternalHref(normalized)) {
    return (
      <a
        href={normalized}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to={normalized} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}

export const cmsCtaButtonClass = cn(
  "inline-flex h-14 w-full items-center justify-center rounded-full px-4",
  "bg-rellia-teal font-host-grotesk text-sm font-semibold text-white",
  "transition-colors duration-200 hover:bg-rellia-teal/90",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40 focus-visible:ring-offset-2",
)
