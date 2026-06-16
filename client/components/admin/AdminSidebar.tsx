import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { FileEdit, Inbox, LayoutDashboard, LogOut, Settings, Users, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { isActiveSubmissionStatus } from "@/lib/adminSubmissionStatus"
import { cn } from "@/lib/utils"

const FAVICON_SRC = "/favicon.ico"

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
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

const navLinkClass = (isActive: boolean) =>
  cn(
    "flex w-full items-center gap-3 rounded-full px-3 py-2.5 font-urbanist text-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
    isActive
      ? "bg-rellia-mint/35 text-rellia-teal"
      : "text-muted-foreground hover:bg-black/[0.06] hover:text-muted-foreground",
  )

const navIconClass = (isActive: boolean) =>
  cn("h-[18px] w-[18px] shrink-0", isActive ? "text-rellia-teal" : "text-muted-foreground")

type AdminSidebarProps = {
  mobileOpen: boolean
  onMobileClose: () => void
}

const AdminSidebar = ({ mobileOpen, onMobileClose }: AdminSidebarProps) => {
  const { user, signOut, session } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { data: unresolvedCount = 0 } = useQuery({
    queryKey: ["admin-unresolved-submissions-count"],
    queryFn: fetchUnresolvedCount,
    enabled: Boolean(session),
    staleTime: 30_000,
  })

  const mainMenu: NavItem[] = [
    { to: "/admin/overview", label: "Overview", icon: LayoutDashboard, end: true },
    {
      to: "/admin/submissions",
      label: "Submissions",
      icon: Inbox,
      badge: unresolvedCount > 0 ? unresolvedCount : undefined,
      isActiveMatch: (path) =>
        path.startsWith("/admin/submissions") ||
        path.startsWith("/admin/contacts") ||
        path.startsWith("/admin/companies"),
    },
    { to: "/admin/team", label: "Team", icon: Users },
    { to: "/admin/content", label: "Content Drafts", icon: FileEdit },
    { to: "/admin/resources", label: "Resources", icon: Settings },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const emailInitial = user?.email?.trim().charAt(0).toUpperCase() ?? "?"

  const panel = (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-r border-border bg-card/95 px-4 py-6 backdrop-blur-sm lg:w-[260px]">
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={FAVICON_SRC}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-xl"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="font-host-grotesk text-[15px] leading-tight text-black/90">Admin Dashboard</p>
            <p className="font-urbanist text-xs text-muted-foreground">Rellia Health</p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-black/[0.06] lg:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <nav className="mt-10 flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Admin navigation">
        <ul className="space-y-1">
          {mainMenu.map((item) => {
            const active = item.isActiveMatch ? item.isActiveMatch(pathname) : pathname === item.to
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={() => navLinkClass(active)}
                  onClick={onMobileClose}
                >
                  <item.icon className={navIconClass(active)} aria-hidden strokeWidth={1.5} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined ? (
                    <span
                      className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rellia-teal px-1.5 font-urbanist text-[10px] font-semibold text-white"
                      aria-label={`${item.badge} unresolved`}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto shrink-0 border-t border-border pt-4">
        <div className="flex items-start gap-3 px-2">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rellia-mint/30 font-urbanist text-sm text-rellia-teal"
            aria-hidden
          >
            {emailInitial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-urbanist text-sm text-muted-foreground">{user?.email ?? "Signed in"}</p>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="mt-1 inline-flex items-center gap-1 rounded font-urbanist text-xs text-rellia-teal/80 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
        onClick={onMobileClose}
      />
      <div
        className={cn(
          "fixed inset-0 z-50 flex h-[100dvh] w-full transition-transform duration-200 lg:static lg:z-auto lg:h-screen lg:w-[260px] lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {panel}
      </div>
    </>
  )
}

export default AdminSidebar
