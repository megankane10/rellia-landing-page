import { NavLink, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { CircleHelp, FileEdit, Inbox, LayoutDashboard, Users, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { isActiveSubmissionStatus } from "@/lib/adminSubmissionStatus"
import AdminAccountMenu from "@/components/admin/AdminAccountMenu"
import AdminMobileThemePicker from "@/components/admin/AdminMobileThemePicker"
import AdminSidebarThemeCycle from "@/components/admin/AdminSidebarThemeCycle"
import { AdminSidebarDateTime } from "@/components/admin/AdminSidebarDateTime"
import {
  adminSidebarContentClass,
  adminSidebarDividerGapClass,
  adminSidebarFooterClass,
  adminSidebarHeaderClass,
  adminSidebarHeaderRowClass,
  adminSidebarHeaderTextClass,
  adminSidebarIconSlot,
  adminSidebarLabelWrapClass,
  adminSidebarNavButtonClass,
  adminSidebarNavLinkClass,
  adminSidebarRowClass,
} from "@/components/admin/adminSidebarRail"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const FAVICON_SRC = "/favicon_512.png"

const AttentionBadgeCount = ({
  count,
  className,
}: {
  count: number
  className?: string
}) => {
  if (count <= 0) return null
  const label = count > 99 ? "99+" : String(count)

  const isCompact = label.length === 1

  return (
    <span
      className={cn(
        "attention-badge-count inline-flex shrink-0 items-center justify-center rounded-full bg-rellia-mint",
        "font-urbanist text-xs font-semibold leading-none !text-rellia-teal tabular-nums",
        isCompact ? "size-6" : "h-6 min-w-6 px-1.5",
        className,
      )}
      aria-label={`${count} need attention`}
    >
      {label}
    </span>
  )
}

const AttentionBadgeDot = ({
  count,
  className,
}: {
  count: number
  className?: string
}) => {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        "absolute right-0.5 top-1 h-2.5 w-2.5 rounded-full bg-rellia-mint ring-2 ring-slate-950",
        className,
      )}
      aria-label={`${count} need attention`}
    />
  )
}

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
    label: "Content drafts",
    icon: FileEdit,
    isActiveMatch: (path) => path.startsWith("/admin/drafts") || path.startsWith("/admin/content"),
  },
  { to: "/admin/help", label: "Help", icon: CircleHelp, end: true },
]

const AdminAppSidebar = () => {
  const { session } = useAuth()
  const { pathname } = useLocation()
  const isMobile = useIsMobile()
  const { setOpenMobile, state: sidebarState } = useSidebar()
  const isCollapsed = sidebarState === "collapsed" && !isMobile

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
    <Sidebar
      collapsible="icon"
      className={cn(
        "flex flex-col overflow-hidden border-r border-slate-800/60 bg-slate-950 text-slate-200",
        "duration-300 ease-in-out",
      )}
    >
      <SidebarHeader className={adminSidebarHeaderClass}>
        <div className={adminSidebarHeaderRowClass}>
          <span className={adminSidebarIconSlot}>
            <img
              src={FAVICON_SRC}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-lg"
              aria-hidden
            />
          </span>
          <span className={adminSidebarHeaderTextClass}>
            <span className="truncate font-host-grotesk text-[15px] font-semibold leading-none text-white">
              Admin Dashboard
            </span>
          </span>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className={cn(
                "ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                "border border-slate-700/80 bg-slate-900 text-slate-100",
                "transition-colors hover:bg-card/10 hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent className={cn(adminSidebarContentClass, "flex min-h-0 flex-col")}>
        {isMobile ? (
          <div className="mb-6 shrink-0">
            <AdminSidebarDateTime variant="mobile" />
          </div>
        ) : null}

        <SidebarGroup className="!p-0 shrink-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
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
                      className={adminSidebarNavButtonClass}
                    >
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={adminSidebarNavLinkClass}
                        onClick={handleNavClick}
                      >
                        <span className={adminSidebarIconSlot}>
                          <item.icon aria-hidden strokeWidth={active ? 2.25 : 1.75} />
                          {badge !== undefined && badge > 0 ? (
                            <AttentionBadgeDot
                              count={badge}
                              className="hidden group-data-[collapsible=icon]:block"
                            />
                          ) : null}
                        </span>
                        <span className={adminSidebarLabelWrapClass}>
                          <span className="truncate">{item.label}</span>
                          {badge !== undefined && badge > 0 ? (
                            <AttentionBadgeCount
                              count={badge}
                              className="group-data-[collapsible=icon]:hidden"
                            />
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

        <div className={cn("mt-auto shrink-0", adminSidebarDividerGapClass)}>
          {isCollapsed ? (
            <SidebarMenu className="!gap-0 !p-0">
              <AdminSidebarThemeCycle />
            </SidebarMenu>
          ) : (
            <AdminMobileThemePicker />
          )}
        </div>
      </SidebarContent>

      <SidebarFooter className={adminSidebarFooterClass}>
        <AdminAccountMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminAppSidebar
