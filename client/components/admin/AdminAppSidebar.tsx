import { NavLink, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { CircleHelp, FileEdit, Inbox, LayoutDashboard, Users, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { isActiveSubmissionStatus } from "@/lib/adminSubmissionStatus"
import AdminAccountMenu from "@/components/admin/AdminAccountMenu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const FAVICON_SRC = "/favicon.ico"

type NavItem = {
  to: string
  label: string
  icon: typeof Inbox
  end?: boolean
  badge?: number
  isActiveMatch?: (pathname: string) => boolean
}

const fetchUnresolvedCount = async (): Promise<number> => {
  const [contactsRes, profilesRes] = await Promise.all([
    supabase.from("contact_responses").select("status"),
    supabase.from("company_profiles").select("status"),
  ])
  if (contactsRes.error) throw new Error(contactsRes.error.message)
  if (profilesRes.error) throw new Error(profilesRes.error.message)

  const contactCount = (contactsRes.data ?? []).filter((row) =>
    isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null),
  ).length
  const diagnosticCount = (profilesRes.data ?? []).filter((row) =>
    isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null),
  ).length

  return contactCount + diagnosticCount
}

const MAIN_NAV: NavItem[] = [
  { to: "/admin/overview", label: "Overview", icon: LayoutDashboard, end: true },
  {
    to: "/admin/inbox",
    label: "Inbox",
    icon: Inbox,
    isActiveMatch: (path) =>
      path.startsWith("/admin/inbox") ||
      path.startsWith("/admin/submissions") ||
      path.startsWith("/admin/contacts") ||
      path.startsWith("/admin/companies"),
  },
  { to: "/admin/team", label: "Team", icon: Users, end: true },
  {
    to: "/admin/drafts",
    label: "Sanity drafts",
    icon: FileEdit,
    isActiveMatch: (path) => path.startsWith("/admin/drafts") || path.startsWith("/admin/content"),
  },
  { to: "/admin/help", label: "Help", icon: CircleHelp, end: true },
]

const AdminAppSidebar = () => {
  const { session } = useAuth()
  const { pathname } = useLocation()
  const isMobile = useIsMobile()
  const { setOpenMobile } = useSidebar()

  const { data: unresolvedCount = 0 } = useQuery({
    queryKey: ["admin-unresolved-submissions-count"],
    queryFn: fetchUnresolvedCount,
    enabled: Boolean(session),
    staleTime: 30_000,
  })

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="offcanvas" className="flex flex-col border-slate-800 bg-slate-900 text-slate-400">
      <SidebarHeader className="border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={FAVICON_SRC} alt="" width={32} height={32} className="h-8 w-8 rounded-lg" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate font-host-grotesk text-sm font-semibold text-white">Rellia Admin</p>
            <p className="truncate font-urbanist text-xs text-slate-400">Internal dashboard</p>
          </div>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                "border border-slate-700 bg-slate-800 text-slate-200",
                "transition-all hover:bg-white/10 hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="font-urbanist text-[11px] uppercase tracking-wider text-slate-500">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => {
                const active = item.isActiveMatch ? item.isActiveMatch(pathname) : pathname === item.to
                const badge =
                  item.to === "/admin/inbox" && unresolvedCount > 0 ? unresolvedCount : item.badge

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "text-slate-400 transition-all rounded-lg",
                        "hover:bg-white/10 hover:text-white",
                        "data-[active=true]:bg-white/10 data-[active=true]:text-white data-[active=true]:font-medium",
                      )}
                    >
                      <NavLink to={item.to} end={item.end} className="flex w-full items-center" onClick={handleNavClick}>
                        <item.icon aria-hidden />
                        <span className="flex min-w-0 flex-1 items-center gap-2">
                          <span>{item.label}</span>
                          {badge !== undefined && badge > 0 ? (
                            <span
                              className={cn(
                                "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5",
                                "bg-rellia-teal text-[10px] font-semibold text-white tabular-nums",
                                "group-data-[collapsible=icon]:hidden",
                              )}
                              aria-label={`${badge} need attention`}
                            >
                              {badge > 99 ? "99+" : badge}
                            </span>
                          ) : null}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-slate-800 p-3">
        <AdminAccountMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminAppSidebar
