import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { CircleHelp, FileEdit, Inbox, LogOut, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { isActiveSubmissionStatus } from "@/lib/adminSubmissionStatus"
import { getAdminDisplayName, getAdminInitials } from "@/lib/adminUserProfile"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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
  const { user, signOut, session } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { data: unresolvedCount = 0 } = useQuery({
    queryKey: ["admin-unresolved-submissions-count"],
    queryFn: fetchUnresolvedCount,
    enabled: Boolean(session),
    staleTime: 30_000,
  })

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const displayName = getAdminDisplayName(user) || user?.email || "Admin"
  const initials = getAdminInitials(user)

  return (
    <Sidebar collapsible="offcanvas" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={FAVICON_SRC} alt="" width={32} height={32} className="h-8 w-8 rounded-lg" aria-hidden />
          <div className="min-w-0">
            <p className="truncate font-host-grotesk text-sm font-semibold text-sidebar-foreground">Rellia Admin</p>
            <p className="truncate font-urbanist text-xs text-sidebar-foreground/60">Internal dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-urbanist text-[11px] uppercase tracking-wider">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => {
                const active = item.isActiveMatch ? item.isActiveMatch(pathname) : pathname === item.to
                const badge =
                  item.to === "/admin/inbox" && unresolvedCount > 0 ? unresolvedCount : item.badge

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <NavLink to={item.to} end={item.end}>
                        <item.icon aria-hidden />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                    {badge !== undefined ? (
                      <SidebarMenuBadge className="bg-rellia-teal text-white">
                        {badge > 99 ? "99+" : badge}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="h-9 w-9 border border-sidebar-border">
            <AvatarFallback className="bg-rellia-mint/40 font-urbanist text-xs text-rellia-teal">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-urbanist text-sm font-medium text-sidebar-foreground">{displayName}</p>
            {getAdminDisplayName(user) ? (
              <p className="truncate font-urbanist text-xs text-sidebar-foreground/55">{user?.email}</p>
            ) : null}
          </div>
        </div>
        <SidebarSeparator className="my-2" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 font-urbanist text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => void handleSignOut()}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminAppSidebar
