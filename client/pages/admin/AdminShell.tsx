import { type CSSProperties, useCallback, useState } from "react"
import { Outlet } from "react-router-dom"
import AdminAppSidebar from "@/components/admin/AdminAppSidebar"
import AdminHeaderClock from "@/components/admin/AdminHeaderClock"
import AdminSidebarTrigger from "@/components/admin/AdminSidebarTrigger"
import AdminPageFooter from "@/components/admin/AdminPageFooter"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const SIDEBAR_COOKIE_NAME = "sidebar:state"

const readInitialSidebarOpen = (): boolean => {
  if (typeof document === "undefined") return true
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${SIDEBAR_COOKIE_NAME}=(true|false)`))
  if (!match) return true
  return match[1] === "true"
}

const AdminShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(readInitialSidebarOpen)

  const handleSidebarOpenChange = useCallback((open: boolean) => {
    setSidebarOpen(open)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${60 * 60 * 24 * 7}`
  }, [])

  return (
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
      <div className="flex min-h-[100dvh] w-full bg-background font-host-grotesk">
        <AdminAppSidebar />
        <SidebarInset className="min-w-0">
          <header className="relative sticky top-0 z-30 flex h-[4.25rem] shrink-0 items-center gap-3 border-b border-border/80 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:gap-4">
            <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
              <AdminSidebarTrigger />
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden -translate-x-1/2 items-center md:flex">
              <AdminHeaderClock className="pointer-events-auto" />
            </div>
            <div className="relative z-10 ml-auto shrink-0">
              <AdminSystemStatus compact />
            </div>
          </header>
          <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
            <AdminPageFooter />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default AdminShell
