import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  Database,
  Github,
  ExternalLink,
  FileEdit,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Server,
  Stethoscope,
  Users,
  X,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const FAVICON_SRC = "/favicon.ico"

const ADMIN_DOC_URL =
  "https://docs.google.com/document/d/17lMkt2Jqa4fswCd_DpjHpvwMQH-5QBMDvzcw5MGLDVo/edit?usp=sharing"
const SANITY_STUDIO_URL = "https://relliahealth.sanity.studio"
const SUPABASE_ORG_URL = "https://supabase.com/dashboard/org/upargbhxqypivsqdsehp"
const VERCEL_PROJECT_URL = "https://vercel.com/relliahealth"
const GITHUB_REPO_URL = "https://github.com/Agrolax/rellia-landing-page"
const WEBSITE_URL = "https://relliahealth.com"

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  isActiveMatch?: (pathname: string) => boolean
}

const MAIN_MENU: NavItem[] = [
  { to: "/admin/overview", label: "Overview", icon: LayoutDashboard, end: true },
  {
    to: "/admin/submissions",
    label: "Submissions",
    icon: Mail,
    isActiveMatch: (pathname) =>
      pathname.startsWith("/admin/submissions") ||
      pathname.startsWith("/admin/contacts") ||
      pathname.startsWith("/admin/companies"),
  },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/content", label: "Content Drafts", icon: FileEdit },
]

type ExternalTool = {
  href: string
  label: string
  icon: typeof FileText
}

const ADMIN_TOOLS: ExternalTool[] = [
  { href: ADMIN_DOC_URL, label: "Documentation", icon: FileText },
  { href: SANITY_STUDIO_URL, label: "Sanity Studio", icon: FileEdit },
  { href: SUPABASE_ORG_URL, label: "Supabase", icon: Database },
  { href: VERCEL_PROJECT_URL, label: "Vercel", icon: Server },
  { href: GITHUB_REPO_URL, label: "GitHub", icon: Github },
  { href: WEBSITE_URL, label: "Website", icon: ExternalLink },
]

const SECTION_HEADING = "px-3 pb-2 font-urbanist text-[10px] font-normal uppercase tracking-[0.14em] text-rellia-teal"

const navLinkClass = (isActive: boolean) =>
  cn(
    "flex w-full items-center gap-3 rounded-full px-3 py-2.5 font-urbanist text-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
    isActive
      ? "bg-rellia-mint/35 text-rellia-teal"
      : "text-black/45 hover:bg-black/[0.06] hover:text-black/70",
  )

const navIconClass = (isActive: boolean) =>
  cn("h-[18px] w-[18px] shrink-0", isActive ? "text-rellia-teal" : "text-black/40")

type AdminSidebarProps = {
  mobileOpen: boolean
  onMobileClose: () => void
}

const AdminSidebar = ({ mobileOpen, onMobileClose }: AdminSidebarProps) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const emailInitial = user?.email?.trim().charAt(0).toUpperCase() ?? "?"

  const panel = (
    <aside className="flex h-full min-h-0 w-[260px] shrink-0 flex-col border-r border-black/[0.06] bg-white/95 px-4 py-6 backdrop-blur-sm">
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
            <p className="font-urbanist text-xs text-black/50">Rellia Health</p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-black/50 hover:bg-black/[0.06] lg:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <nav className="mt-10 flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Admin navigation">
        <p className={SECTION_HEADING}>Main Menu</p>
        <ul className="space-y-1">
          {MAIN_MENU.map((item) => {
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
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>

        <div className="my-6 border-t border-black/[0.06]" role="separator" />

        <div className="flex items-center gap-1.5 px-3 pb-2">
          <p className={SECTION_HEADING}>Admin Tools</p>
          <ExternalLink className="h-3 w-3 text-rellia-teal/50" aria-hidden />
        </div>
        <ul className="space-y-1">
          {ADMIN_TOOLS.map((tool) => (
            <li key={tool.href + tool.label}>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 font-urbanist text-sm text-black/45 transition-colors hover:bg-black/[0.06] hover:text-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
              >
                <tool.icon className="h-[18px] w-[18px] shrink-0 text-black/40" aria-hidden strokeWidth={1.5} />
                <span>{tool.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto shrink-0 border-t border-black/[0.06] pt-4">
        <div className="flex items-start gap-3 px-2">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rellia-mint/30 font-urbanist text-sm text-rellia-teal"
            aria-hidden
          >
            {emailInitial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-urbanist text-sm text-black/75">{user?.email ?? "Signed in"}</p>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="mt-1 inline-flex items-center gap-1 font-urbanist text-xs text-rellia-teal/80 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
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
          "fixed inset-y-0 left-0 z-50 flex h-screen transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {panel}
      </div>
    </>
  )
}

export default AdminSidebar
