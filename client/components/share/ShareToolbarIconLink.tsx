import type { ReactNode } from "react"
import { IconTooltipWrap, type IconTooltipPosition } from "@/components/share/IconTooltipWrap"
import { cn } from "@/lib/utils"

type ShareToolbarIconLinkProps = {
  href: string
  label: string
  className?: string
  children: ReactNode
  external?: boolean
  tooltipPosition?: IconTooltipPosition
  tooltipMobilePosition?: IconTooltipPosition
}

export const ShareToolbarIconLink = ({
  href,
  label,
  className,
  children,
  external = true,
  tooltipPosition,
  tooltipMobilePosition,
}: ShareToolbarIconLinkProps) => (
  <IconTooltipWrap
    label={label}
    position={tooltipPosition}
    mobilePosition={tooltipMobilePosition}
  >
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
