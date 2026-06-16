import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
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

const THEME_PREFERENCE_ICONS: Record<AdminThemePreference, LucideIcon> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

/** Sun/Moon fill cleanly; Monitor reads better as outline vs bold stroke. */
const THEME_ICON_FILLS_WHEN_SELECTED: Record<AdminThemePreference, boolean> = {
  system: false,
  light: true,
  dark: true,
}

const ThemeGlyph = ({
  Icon,
  className,
  size,
  filled,
  fillable,
}: {
  Icon: LucideIcon
  className?: string
  size: number
  filled: boolean
  fillable: boolean
}) => (
  <Icon
    className={cn(className, filled && fillable && "fill-current")}
    style={{ width: size, height: size }}
    strokeWidth={filled ? (fillable ? 1.5 : 2.25) : 1.75}
    fill={filled && fillable ? "currentColor" : "none"}
    aria-hidden
  />
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

  return (
    <ThemeGlyph
      Icon={THEME_PREFERENCE_ICONS[preference]}
      className={cn(colorClass, className)}
      size={size}
      filled={filled}
      fillable={THEME_ICON_FILLS_WHEN_SELECTED[preference]}
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
