import type { ReactNode } from "react"
import { IconTooltipWrap } from "@/components/share/IconTooltipWrap"
import { cn } from "@/lib/utils"

type ShareToolbarIconLinkProps = {
  href: string
  label: string
  className?: string
  children: ReactNode
  external?: boolean
}

export const ShareToolbarIconLink = ({
  href,
  label,
  className,
  children,
  external = true,
}: ShareToolbarIconLinkProps) => (
  <IconTooltipWrap label={label}>
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(className)}
      aria-label={label}
    >
      {children}
    </a>
  </IconTooltipWrap>
)
