import { type CSSProperties, useCallback, useEffect, useMemo, useState } from "react"
import { Outlet } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import AdminAppSidebar from "@/components/admin/AdminAppSidebar"
import AdminHeaderPageTitle from "@/components/admin/AdminHeaderPageTitle"
import AdminHeaderClock from "@/components/admin/AdminHeaderClock"
import AdminSidebarTrigger from "@/components/admin/AdminSidebarTrigger"
import AdminPageFooter from "@/components/admin/AdminPageFooter"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
import { adminCanvasClass, adminHeaderClass } from "@/components/admin/adminThemeClasses"
import { AdminThemeProvider, useAdminTheme } from "@/context/AdminThemeContext"
import { useAuth } from "@/context/AuthContext"
import { postAdminPresenceHeartbeat } from "@/lib/adminApi"
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
  const { session } = useAuth()
  const queryClient = useQueryClient()
  const token = session?.access_token ?? ""
  const enabled = useMemo(() => Boolean(token), [token])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const sendHeartbeat = async () => {
      if (cancelled) return
      try {
        await postAdminPresenceHeartbeat(token)
        queryClient.invalidateQueries({ queryKey: ["admin-team", token] })
      } catch {
        // Presence is best-effort only
      }
    }

    sendHeartbeat()
    const id = window.setInterval(sendHeartbeat, 60_000)

    const handleVisibility = () => {
      if (document.visibilityState === "visible") sendHeartbeat()
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      cancelled = true
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [enabled, queryClient, token])

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
      <SidebarInset className={cn("min-w-0 !bg-admin-canvas")}>
        <header
          className={cn(
            "sticky top-0 z-30 grid h-[4.25rem] shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:gap-4",
            adminHeaderClass,
          )}
        >
          <div className="flex min-w-0 items-center gap-3 justify-self-start">
            <AdminSidebarTrigger />
            <AdminHeaderPageTitle />
          </div>
          <div className="hidden justify-self-center md:flex">
            <AdminHeaderClock />
          </div>
          <div className="flex w-full min-w-0 items-center justify-end justify-self-end">
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
