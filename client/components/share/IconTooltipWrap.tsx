import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type IconTooltipPosition = "top" | "bottom" | "left"

type IconTooltipWrapProps = {
  label: string
  children: ReactNode
  className?: string
  position?: IconTooltipPosition
  /** When set, tooltips below `md` use this position instead of `position`. */
  mobilePosition?: IconTooltipPosition
}

const tooltipShellClass: Record<IconTooltipPosition, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
}

const tooltipArrowClass: Record<IconTooltipPosition, string> = {
  top: "left-1/2 top-full -translate-x-1/2 border-t-black",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-black",
  left: "left-full top-1/2 -translate-y-1/2 border-l-black",
}

const TooltipBubble = ({
  label,
  position,
  visibilityClass,
}: {
  label: string
  position: IconTooltipPosition
  visibilityClass?: string
}) => (
  <div
    className={cn(
      "pointer-events-none absolute z-50 scale-95 opacity-0 transition-all duration-200",
      "group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100",
      tooltipShellClass[position],
      visibilityClass,
    )}
    role="tooltip"
  >
    <div className="relative whitespace-nowrap rounded-xl bg-black px-3 py-2 text-sm font-bold text-white shadow-md">
      {label}
      <div
        className={cn("absolute border-4 border-transparent", tooltipArrowClass[position])}
        aria-hidden
      />
    </div>
  </div>
)

export const IconTooltipWrap = ({
  label,
  children,
  className,
  position = "top",
  mobilePosition,
}: IconTooltipWrapProps) => (
  <div className={cn("relative group", className)}>
    {children}
    {mobilePosition ? (
      <>
        <TooltipBubble label={label} position={mobilePosition} visibilityClass="md:hidden" />
        <TooltipBubble label={label} position={position} visibilityClass="hidden md:block" />
      </>
    ) : (
      <TooltipBubble label={label} position={position} />
    )}
  </div>
)
