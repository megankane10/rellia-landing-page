import { Moon, Sun, type LucideIcon } from "lucide-react"
import type { AdminThemePreference } from "@/context/AdminThemeContext"
import { cn } from "@/lib/utils"

export const getCollapsedNextThemePreference = (
  resolvedTheme: AdminThemePreference,
): AdminThemePreference => (resolvedTheme === "dark" ? "light" : "dark")

export const getCollapsedThemeToggleTooltip = (resolvedTheme: AdminThemePreference): string =>
  resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"

const headerIconColorClass = "text-rellia-teal dark:text-rellia-mint"

const THEME_PREFERENCE_ICONS: Record<AdminThemePreference, LucideIcon> = {
  light: Sun,
  dark: Moon,
}

const ThemeGlyph = ({
  Icon,
  className,
  size,
  filled,
}: {
  Icon: LucideIcon
  className?: string
  size: number
  filled: boolean
}) => (
  <Icon
    className={cn(className, filled && "fill-current")}
    style={{ width: size, height: size }}
    strokeWidth={filled ? 1.5 : 1.75}
    fill={filled ? "currentColor" : "none"}
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
