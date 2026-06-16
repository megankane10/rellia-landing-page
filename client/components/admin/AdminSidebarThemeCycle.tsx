import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useAdminTheme } from "@/context/AdminThemeContext"
import {
  getCollapsedNextThemePreference,
  getCollapsedThemeToggleTooltip,
  ThemePreferenceIcon,
} from "@/components/admin/adminThemeIcons"
import {
  adminSidebarIconSlot,
  adminSidebarNavButtonClass,
  adminSidebarNavLinkClass,
} from "@/components/admin/adminSidebarRail"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { useStickyHover } from "@/hooks/use-sticky-hover"
import { cn } from "@/lib/utils"

const iconTransition = {
  duration: 0.32,
  ease: [0.4, 0, 0.2, 1] as const,
}

const AdminSidebarThemeCycle = () => {
  const { resolvedTheme, setPreference } = useAdminTheme()
  const prefersReducedMotion = useReducedMotion()
  const { isHovered, stickyHoverProps } = useStickyHover()
  const nextPreference = getCollapsedNextThemePreference(resolvedTheme)
  const tooltip = getCollapsedThemeToggleTooltip(resolvedTheme)

  const handleCycle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPreference(nextPreference, {
      origin: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
    })
  }

  return (
    <SidebarMenuItem>
      <Tooltip open={isHovered}>
        <TooltipTrigger asChild>
          <SidebarMenuButton
            asChild
            className={cn(
              adminSidebarNavButtonClass,
              isHovered && "!bg-white/[0.07] !text-white",
            )}
          >
            <button
              type="button"
              onClick={handleCycle}
              className={adminSidebarNavLinkClass}
              aria-label={tooltip}
              {...stickyHoverProps}
            >
              <span className={adminSidebarIconSlot}>
                <span className="relative inline-flex size-5 items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={nextPreference}
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
                      <ThemePreferenceIcon
                        preference={nextPreference}
                        size={20}
                        variant="sidebar-mobile"
                        selected
                      />
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </button>
          </SidebarMenuButton>
        </TooltipTrigger>
        <AdminTooltipContent side="right" align="center">
          {tooltip}
        </AdminTooltipContent>
      </Tooltip>
    </SidebarMenuItem>
  )
}

export default AdminSidebarThemeCycle
