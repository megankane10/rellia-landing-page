import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type IconTooltipWrapProps = {
  label: string
  children: ReactNode
  className?: string
  position?: "top" | "bottom"
}

export const IconTooltipWrap = ({
  label,
  children,
  className,
  position = "top",
}: IconTooltipWrapProps) => (
  <div className={cn("relative group", className)}>
    {children}
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200",
        "group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100",
        position === "top" ? "bottom-full mb-2" : "top-full mt-2",
      )}
      role="tooltip"
    >
      <div className="relative whitespace-nowrap rounded-xl bg-black px-2.5 py-1.5 text-xs font-bold text-white shadow-md">
        {label}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
            position === "top" ? "top-full border-t-black" : "bottom-full border-b-black",
          )}
          aria-hidden
        />
      </div>
    </div>
  </div>
)
