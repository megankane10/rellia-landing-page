import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useAdminTheme } from "@/context/AdminThemeContext"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import {
  adminHeaderIconButtonClass,
  getNextThemePreference,
  getThemeCycleTooltip,
  ThemePreferenceIcon,
} from "@/components/admin/adminThemeIcons"
import { cn } from "@/lib/utils"

const iconTransition = {
  duration: 0.32,
  ease: [0.4, 0, 0.2, 1] as const,
}

type AdminHeaderThemeCycleProps = {
  className?: string
}

const AdminHeaderThemeCycle = ({ className }: AdminHeaderThemeCycleProps) => {
  const { preference, setPreference } = useAdminTheme()
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const tooltip = getThemeCycleTooltip(preference)

  const handleCycle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPreference(getNextThemePreference(preference), {
      origin: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
    })
  }

  return (
    <Tooltip open={isHovered}>
      <TooltipTrigger asChild>
        <motion.button
          type="button"
          onClick={handleCycle}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={cn(
            adminHeaderIconButtonClass,
            isHovered && "border-rellia-teal/25 bg-rellia-mint/15 dark:border-rellia-mint/25 dark:bg-rellia-mint/10",
            className,
          )}
          aria-label={tooltip}
        >
          <span className="relative inline-flex size-5 items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={preference}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, scale: 0.82, rotate: -18, filter: "blur(2px)" }
                }
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, scale: 0.82, rotate: 18, filter: "blur(2px)" }
                }
                transition={prefersReducedMotion ? { duration: 0 } : iconTransition}
                className="absolute inset-0 inline-flex items-center justify-center"
              >
                <ThemePreferenceIcon preference={preference} size={20} />
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>
      </TooltipTrigger>
      <AdminTooltipContent side="bottom" align="center">
        {tooltip}
      </AdminTooltipContent>
    </Tooltip>
  )
}

export default AdminHeaderThemeCycle
