import { type CSSProperties, useCallback, useState } from "react"
import { Outlet } from "react-router-dom"
import AdminAppSidebar from "@/components/admin/AdminAppSidebar"
import AdminHeaderClock from "@/components/admin/AdminHeaderClock"
import AdminHeaderThemeCycle from "@/components/admin/AdminHeaderThemeCycle"
import AdminSidebarTrigger from "@/components/admin/AdminSidebarTrigger"
import AdminPageFooter from "@/components/admin/AdminPageFooter"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
import { adminCanvasClass, adminHeaderClass } from "@/components/admin/adminThemeClasses"
import { AdminThemeProvider, useAdminTheme } from "@/context/AdminThemeContext"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar:state"

const readInitialSidebarOpen = (): boolean => {
  if (typeof document === "undefined") return true
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${SIDEBAR_COOKIE_NAME}=(true|false)`))
  if (!match) return true
  return match[1] === "true"
}

const AdminShellContent = () => {
  const { resolvedTheme, isThemeTransitioning } = useAdminTheme()

  return (
    <div
      className={cn(
        "admin-shell flex min-h-[100dvh] w-full font-host-grotesk",
        adminCanvasClass,
        resolvedTheme === "dark" && "dark",
        isThemeTransitioning && "admin-theme-transitioning",
      )}
    >
      <AdminAppSidebar />
      <SidebarInset className="min-w-0 !bg-transparent">
        <header
          className={cn(
            "relative sticky top-0 z-30 flex h-[4.25rem] shrink-0 items-center gap-3 px-4 md:gap-4",
            adminHeaderClass,
          )}
        >
          <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
            <AdminSidebarTrigger />
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden -translate-x-1/2 items-center md:flex">
            <div className="pointer-events-auto flex items-center gap-2.5">
              <AdminHeaderThemeCycle />
              <AdminHeaderClock />
            </div>
          </div>
          <div className="relative z-10 ml-auto shrink-0">
            <AdminSystemStatus compact />
          </div>
        </header>
        <main
          id="main-content"
          className={cn("flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8", adminCanvasClass)}
        >
          <Outlet />
          <AdminPageFooter />
        </main>
      </SidebarInset>
    </div>
  )
}

const AdminShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(readInitialSidebarOpen)

  const handleSidebarOpenChange = useCallback((open: boolean) => {
    setSidebarOpen(open)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${60 * 60 * 24 * 7}`
  }, [])

  return (
    <AdminThemeProvider>
      <SidebarProvider
        open={sidebarOpen}
        onOpenChange={handleSidebarOpenChange}
        style={
          {
            "--sidebar-width": "17rem",
            "--sidebar-width-icon": "5rem",
          } as CSSProperties
        }
      >
        <AdminShellContent />
      </SidebarProvider>
    </AdminThemeProvider>
  )
}

export default AdminShell
