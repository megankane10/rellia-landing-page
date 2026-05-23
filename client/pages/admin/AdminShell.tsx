import { Outlet } from "react-router-dom"
import AdminSidebar from "@/components/admin/AdminSidebar"

const AdminShell = () => (
  <div className="flex min-h-screen bg-[linear-gradient(165deg,hsl(var(--rellia-cream))_0%,#f4f8f9_45%,#eef6f4_100%)] font-host-grotesk">
    <AdminSidebar />
    <main id="main-content" className="min-w-0 flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <Outlet />
    </main>
  </div>
)

export default AdminShell
