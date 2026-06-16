import { Moon, Sun } from "lucide-react"
import type { AdminThemePreference } from "@/context/AdminThemeContext"
import { cn } from "@/lib/utils"

export const THEME_CYCLE_ORDER: AdminThemePreference[] = ["system", "light", "dark"]

export const getNextThemePreference = (current: AdminThemePreference): AdminThemePreference => {
  const index = THEME_CYCLE_ORDER.indexOf(current)
  return THEME_CYCLE_ORDER[(index + 1) % THEME_CYCLE_ORDER.length]
}

export const getThemeCycleTooltip = (current: AdminThemePreference): string => {
  const next = getNextThemePreference(current)
  if (next === "light") return "Switch to light mode"
  if (next === "dark") return "Switch to dark mode"
  return "Switch to system theme"
}

const headerIconColorClass = "text-rellia-teal dark:text-rellia-mint"

export const SystemAdaptiveIcon = ({
  className,
  size = 20,
  colorClass = headerIconColorClass,
  filled = false,
}: {
  className?: string
  size?: number
  colorClass?: string
  filled?: boolean
}) => (
  <span className={cn("relative inline-flex shrink-0", className)} style={{ width: size, height: size }} aria-hidden>
    <Sun
      className={cn("absolute inset-0", colorClass, filled && "fill-current")}
      style={{ clipPath: "inset(0 50% 0 0)", width: size, height: size }}
      strokeWidth={1.75}
      fill={filled ? "currentColor" : "none"}
    />
    <Moon
      className={cn("absolute inset-0", colorClass, filled && "fill-current")}
      style={{ clipPath: "inset(0 0 0 50%)", width: size, height: size }}
      strokeWidth={1.75}
      fill={filled ? "currentColor" : "none"}
    />
  </span>
)

export const ThemePreferenceIcon = ({
  preference,
  className,
  size = 20,
  variant = "header",
  selected = false,
}: {
  preference: AdminThemePreference
  className?: string
  size?: number
  variant?: "header" | "sidebar-mobile"
  selected?: boolean
}) => {
  const filled = variant === "sidebar-mobile" && selected
  const colorClass =
    variant === "sidebar-mobile"
      ? selected
        ? "text-rellia-mint"
        : "text-slate-400"
      : headerIconColorClass

  if (preference === "system") {
    return (
      <SystemAdaptiveIcon
        className={className}
        size={size}
        colorClass={colorClass}
        filled={filled}
      />
    )
  }
  if (preference === "light") {
    return (
      <Sun
        className={cn(colorClass, className, filled && "fill-current")}
        style={{ width: size, height: size }}
        strokeWidth={1.75}
        fill={filled ? "currentColor" : "none"}
        aria-hidden
      />
    )
  }
  return (
    <Moon
      className={cn(colorClass, className, filled && "fill-current")}
      style={{ width: size, height: size }}
      strokeWidth={1.75}
      fill={filled ? "currentColor" : "none"}
      aria-hidden
    />
  )
}

export const adminHeaderIconButtonClass = cn(
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-transparent",
  "text-rellia-teal transition-[background-color,border-color,box-shadow,transform]",
  "hover:border-rellia-teal/25 hover:bg-rellia-mint/15 dark:text-rellia-mint",
  "dark:hover:border-rellia-mint/25 dark:hover:bg-rellia-mint/10",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
  "active:scale-95",
)
