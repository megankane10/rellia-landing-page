import { motion, useReducedMotion } from "framer-motion"
import { useAdminTheme, type AdminThemePreference } from "@/context/AdminThemeContext"
import { ThemePreferenceIcon } from "@/components/admin/adminThemeIcons"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const MOBILE_OPTIONS: AdminThemePreference[] = ["system", "light", "dark"]

const THEME_ARIA_LABELS: Record<AdminThemePreference, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
}

const selectionSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.85,
}

const AdminMobileThemePicker = () => {
  const { preference, setPreference } = useAdminTheme()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="mb-4 flex w-full items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/50 p-1"
      role="radiogroup"
      aria-label="Theme"
    >
      {MOBILE_OPTIONS.map((option) => {
        const selected = preference === option
        return (
          <Tooltip key={option}>
            <TooltipTrigger asChild>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={THEME_ARIA_LABELS[option]}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  setPreference(option, {
                    origin: {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    },
                  })
                }}
                className={cn(
                  "relative flex h-11 min-w-0 flex-1 items-center justify-center rounded-full",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint/45",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="admin-mobile-theme-selection"
                    className="absolute inset-0 rounded-full bg-rellia-mint/15"
                    transition={prefersReducedMotion ? { duration: 0 } : selectionSpring}
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10 flex items-center justify-center">
                  <ThemePreferenceIcon
                    preference={option}
                    size={20}
                    variant="sidebar-mobile"
                    selected={selected}
                  />
                </span>
              </button>
            </TooltipTrigger>
            <AdminTooltipContent side="top" align="center">
              {THEME_ARIA_LABELS[option]}
            </AdminTooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default AdminMobileThemePicker
