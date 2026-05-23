import { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  ChevronDown,
  FileEdit,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Users,
  X,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const FAVICON_SRC = "/favicon.ico"
const SIMPLE_ICONS_CDN = "https://unpkg.com/simple-icons@v14/icons"

const ADMIN_DOC_URL =
  "https://docs.google.com/document/d/17lMkt2Jqa4fswCd_DpjHpvwMQH-5QBMDvzcw5MGLDVo/edit?usp=sharing"
const SANITY_STUDIO_URL = "https://relliahealth.sanity.studio"
const SUPABASE_PROJECT_URL = "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy"
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

type AdminTool = {
  href: string
  label: string
  description: string
  iconSlug?: string
}

const ADMIN_TOOLS: AdminTool[] = [
  {
    href: ADMIN_DOC_URL,
    label: "Documentation",
    description: "Instructions for using this dashboard",
  },
  {
    href: SANITY_STUDIO_URL,
    label: "Sanity Studio",
    description: "Edit marketing pages, stories, and drafts",
    iconSlug: "sanity",
  },
  {
    href: SUPABASE_PROJECT_URL,
    label: "Supabase",
    description: "Manage auth users, database, and invites",
    iconSlug: "supabase",
  },
  {
    href: VERCEL_PROJECT_URL,
    label: "Vercel",
    description: "Deployments, domains, and environment variables",
    iconSlug: "vercel",
  },
  {
    href: GITHUB_REPO_URL,
    label: "GitHub",
    description: "Source code, pull requests, and issues",
    iconSlug: "github",
  },
  {
    href: WEBSITE_URL,
    label: "Website",
    description: "Open the public marketing site",
  },
]

const SECTION_HEADING =
  "px-3 pb-2 text-left font-urbanist text-[10px] font-normal uppercase tracking-[0.14em] text-rellia-teal"

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

const BrandIcon = ({ slug }: { slug: string }) => (
  <img
    src={`${SIMPLE_ICONS_CDN}/${slug}.svg`}
    alt=""
    width={18}
    height={18}
    className="h-[18px] w-[18px] shrink-0 opacity-50"
    style={{ filter: "brightness(0) saturate(100%) invert(24%) sepia(18%) saturate(900%) hue-rotate(128deg)" }}
    aria-hidden
  />
)

type AdminSidebarProps = {
  mobileOpen: boolean
  onMobileClose: () => void
}

const AdminSidebar = ({ mobileOpen, onMobileClose }: AdminSidebarProps) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [toolsOpen, setToolsOpen] = useState(true)

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const emailInitial = user?.email?.trim().charAt(0).toUpperCase() ?? "?"

  const panel = (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-r border-black/[0.06] bg-white/95 px-4 py-6 backdrop-blur-sm lg:w-[260px]">
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

        <button
          type="button"
          onClick={() => setToolsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
          aria-expanded={toolsOpen}
        >
          <span className={SECTION_HEADING.replace("pb-2", "pb-0")}>Admin Tools</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-rellia-teal/70 transition-transform",
              toolsOpen ? "rotate-0" : "-rotate-90",
            )}
            aria-hidden
          />
        </button>

        {toolsOpen ? (
          <ul className="mt-2 space-y-1">
            {ADMIN_TOOLS.map((tool) => (
              <li key={tool.href + tool.label}>
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
                >
                  <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                    {tool.iconSlug ? (
                      <BrandIcon slug={tool.iconSlug} />
                    ) : tool.label === "Website" ? (
                      <Globe className="h-[18px] w-[18px] text-black/40" aria-hidden strokeWidth={1.5} />
                    ) : (
                      <FileText className="h-[18px] w-[18px] text-black/40" aria-hidden strokeWidth={1.5} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-urbanist text-sm text-black/75">{tool.label}</span>
                    <span className="mt-0.5 block font-urbanist text-xs leading-snug text-black/45">
                      {tool.description}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-black/30" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
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
