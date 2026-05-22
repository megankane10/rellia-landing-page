import { Outlet, useNavigate } from "react-router-dom"
import { ExternalLink, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

const SANITY_STUDIO_URL = "https://relliahealth.sanity.studio"
const FAVICON_SRC = "/favicon.ico"

const displayUsername = (email: string | undefined): string => {
  if (!email) return "Admin"
  const local = email.split("@")[0]?.trim()
  if (!local) return email
  return local.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

const AdminLayout = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,hsl(var(--rellia-cream))_0%,#f4f8f9_45%,#eef6f4_100%)] font-host-grotesk">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={FAVICON_SRC}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-lg ring-1 ring-black/8"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="font-host-grotesk text-lg font-semibold leading-tight text-rellia-teal">
                Admin Dashboard
              </p>
              <p className="font-urbanist text-xs text-black/45">Rellia Health</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              asChild
              className="rounded-full font-urbanist text-xs text-black/55 hover:bg-rellia-mint/15 hover:text-rellia-teal"
            >
              <a
                href={SANITY_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Manage website content in Sanity Studio"
              >
                Manage website content
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
              </a>
            </Button>

            {user?.email ? (
              <span className="hidden font-urbanist text-xs text-black/50 sm:inline">
                {displayUsername(user.email)}
              </span>
            ) : null}

            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleSignOut()}
              className="rounded-full border-rellia-teal/20 text-rellia-teal hover:bg-rellia-mint/20"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-6 py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
