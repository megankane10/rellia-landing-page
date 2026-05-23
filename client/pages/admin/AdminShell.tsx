import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu } from "lucide-react"
import AdminSidebar from "@/components/admin/AdminSidebar"

const AdminShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-[linear-gradient(165deg,hsl(var(--rellia-cream))_0%,#f4f8f9_45%,#eef6f4_100%)] font-host-grotesk">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] bg-white/80 px-4 py-3 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-rellia-teal hover:bg-rellia-mint/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <p className="font-host-grotesk text-sm text-black/80">Admin Dashboard</p>
        </header>
        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminShell
