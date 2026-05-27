import { Outlet } from "react-router-dom"
import AdminAppSidebar from "@/components/admin/AdminAppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const AdminShell = () => (
  <SidebarProvider defaultOpen>
    <div className="flex min-h-[100dvh] w-full bg-background font-host-grotesk">
      <AdminAppSidebar />
      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/80 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger className="-ml-1 text-rellia-teal" aria-label="Toggle navigation menu" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <p className="font-urbanist text-sm text-muted-foreground">Rellia Health admin</p>
        </header>
        <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>
)

export default AdminShell
