import { useCallback, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useAdminTheme, type AdminThemePreference } from "@/context/AdminThemeContext"
import { ThemePreferenceIcon } from "@/components/admin/adminThemeIcons"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const MOBILE_OPTIONS: AdminThemePreference[] = ["light", "system", "dark"]

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

const isPointerInside = (element: HTMLElement, clientX: number, clientY: number) => {
  const rect = element.getBoundingClientRect()
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  )
}

const AdminMobileThemePicker = () => {
  const { preference, setPreference } = useAdminTheme()
  const prefersReducedMotion = useReducedMotion()
  const [hoveredOption, setHoveredOption] = useState<AdminThemePreference | null>(null)
  const pressedOptionRef = useRef<AdminThemePreference | null>(null)

  const syncHoveredFromPointer = useCallback(
    (element: HTMLElement, clientX: number, clientY: number, option: AdminThemePreference) => {
      setHoveredOption(isPointerInside(element, clientX, clientY) ? option : null)
    },
    [],
  )

  const getOptionPointerProps = useCallback(
    (option: AdminThemePreference) => ({
      onPointerEnter: () => setHoveredOption(option),
      onPointerLeave: () => {
        if (pressedOptionRef.current === option) return
        setHoveredOption((current) => (current === option ? null : current))
      },
      onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.button !== 0) return
        pressedOptionRef.current = option
        setHoveredOption(option)
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          // Pointer capture may be unavailable in some environments.
        }
      },
      onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
        const target = event.currentTarget
        if (target.hasPointerCapture(event.pointerId)) {
          target.releasePointerCapture(event.pointerId)
        }
        pressedOptionRef.current = null
        syncHoveredFromPointer(target, event.clientX, event.clientY, option)
      },
      onLostPointerCapture: (event: React.PointerEvent<HTMLButtonElement>) => {
        pressedOptionRef.current = null
        syncHoveredFromPointer(event.currentTarget, event.clientX, event.clientY, option)
      },
    }),
    [syncHoveredFromPointer],
  )

  return (
    <div
      className="flex w-full items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/50 p-1"
      role="radiogroup"
      aria-label="Theme"
    >
      {MOBILE_OPTIONS.map((option) => {
        const selected = preference === option
        const isHovered = hoveredOption === option
        return (
          <Tooltip key={option} open={isHovered}>
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
                {...getOptionPointerProps(option)}
                className={cn(
                  "relative flex h-11 min-w-0 flex-1 items-center justify-center rounded-full",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint/45",
                  isHovered && !selected && "bg-white/[0.06]",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="admin-mobile-theme-selection"
                    className="absolute inset-0 rounded-full bg-rellia-teal"
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
