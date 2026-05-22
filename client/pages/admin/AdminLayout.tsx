import { ExternalLink } from "lucide-react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

const SANITY_STUDIO_URL = "https://relliahealth.sanity.studio"

const AdminLayout = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-rellia-cream font-host-grotesk">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint">
            <img
              src="/images/logo-rellia-footer.webp"
              alt="Rellia Health home"
              className="h-8 w-auto md:h-9"
            />
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="rounded-full border-rellia-teal/25 text-rellia-teal hover:bg-rellia-mint/20 gap-1.5"
            >
              <a
                href={SANITY_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Manage website in Sanity Studio (opens in new tab)"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="hidden sm:inline">Manage website</span>
                <span className="sm:hidden">CMS</span>
              </a>
            </Button>
            {user ? (
              <span className="hidden font-urbanist text-sm text-black/60 md:block max-w-[220px] truncate">
                {user.email}
              </span>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="rounded-full border-rellia-teal/25 text-rellia-teal hover:bg-rellia-mint/20"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
