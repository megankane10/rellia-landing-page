import { motion, useReducedMotion } from "framer-motion"
import { useAdminTheme, type AdminThemePreference } from "@/context/AdminThemeContext"
import { ThemePreferenceIcon } from "@/components/admin/adminThemeIcons"
import { cn } from "@/lib/utils"

const MOBILE_OPTIONS: AdminThemePreference[] = ["system", "light", "dark"]

const THEME_ARIA_LABELS: Record<AdminThemePreference, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
}

const AdminMobileThemePicker = () => {
  const { preference, setPreference } = useAdminTheme()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="mb-4 flex items-center justify-center gap-3"
      role="radiogroup"
      aria-label="Theme"
    >
      {MOBILE_OPTIONS.map((option) => {
        const selected = preference === option
        return (
          <motion.button
            key={option}
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
            whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint/45",
              selected
                ? "border-rellia-mint/35 bg-rellia-mint/15"
                : "border-slate-700/80 bg-slate-900/50 hover:bg-white/[0.06]",
            )}
          >
            <motion.span
              key={selected ? `${option}-on` : `${option}-off`}
              initial={prefersReducedMotion ? false : { scale: selected ? 0.85 : 1 }}
              animate={{ scale: selected ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ThemePreferenceIcon
                preference={option}
                size={20}
                variant="sidebar-mobile"
                selected={selected}
              />
            </motion.span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default AdminMobileThemePicker
