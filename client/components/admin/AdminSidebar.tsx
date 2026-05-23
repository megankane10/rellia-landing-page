import { NavLink, useNavigate } from "react-router-dom"
import {
  ExternalLink,
  FileEdit,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Stethoscope,
  Users,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const FAVICON_SRC = "/favicon.ico"

const ADMIN_DOC_URL =
  "https://docs.google.com/document/d/17lMkt2Jqa4fswCd_DpjHpvwMQH-5QBMDvzcw5MGLDVo/edit?usp=sharing"
const SANITY_STUDIO_URL = "https://relliahealth.sanity.studio"
const SUPABASE_ORG_URL = "https://supabase.com/dashboard/org/upargbhxqypivsqdsehp"
const VERCEL_PROJECT_URL = "https://vercel.com/relliahealth"

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const MAIN_MENU: NavItem[] = [
  { to: "/admin/overview", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/submissions", label: "Submissions", icon: Mail },
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
  { href: SUPABASE_ORG_URL, label: "Supabase", icon: Globe },
  { href: VERCEL_PROJECT_URL, label: "Vercel", icon: ExternalLink },
  { href: "/", label: "Website", icon: Globe },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex w-full items-center gap-3 rounded-full px-3 py-2.5 font-urbanist text-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
    isActive
      ? "bg-rellia-mint/35 text-rellia-teal"
      : "text-black/45 hover:bg-black/[0.06] hover:text-black/70",
  )

const navIconClass = (isActive: boolean) =>
  cn("h-[18px] w-[18px] shrink-0", isActive ? "text-rellia-teal" : "text-black/40")

const AdminSidebar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const emailInitial = user?.email?.trim().charAt(0).toUpperCase() ?? "?"

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-black/[0.06] bg-white/70 px-4 py-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-2">
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

      <nav className="mt-10 flex flex-1 flex-col overflow-y-auto" aria-label="Admin navigation">
        <p className="px-3 pb-2 font-urbanist text-[10px] font-normal uppercase tracking-[0.14em] text-black/40">
          Main Menu
        </p>
        <ul className="space-y-1">
          {MAIN_MENU.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    <item.icon className={navIconClass(isActive)} aria-hidden strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="my-6 border-t border-black/[0.06]" role="separator" />

        <div className="flex items-center gap-1.5 px-3 pb-2">
          <p className="font-urbanist text-[10px] font-normal uppercase tracking-[0.14em] text-black/40">
            Admin Tools
          </p>
          <ExternalLink className="h-3 w-3 text-black/35" aria-hidden />
        </div>
        <ul className="space-y-1">
          {ADMIN_TOOLS.map((tool) => (
            <li key={tool.href + tool.label}>
              <a
                href={tool.href}
                target={tool.href.startsWith("http") ? "_blank" : undefined}
                rel={tool.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 font-urbanist text-sm text-black/45 transition-colors hover:bg-black/[0.06] hover:text-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
              >
                <tool.icon className="h-[18px] w-[18px] shrink-0 text-black/40" aria-hidden strokeWidth={1.5} />
                <span>{tool.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto border-t border-black/[0.06] pt-4">
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
}

export default AdminSidebar
