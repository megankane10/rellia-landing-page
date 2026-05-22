import { ExternalLink } from "lucide-react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

const AdminLayout = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const handleOpenStudio = () => {
    window.open("/api/studio", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-rellia-cream">
      <header className="bg-rellia-teal px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <img
            src="/images/logo-rellia-footer.webp"
            alt="Rellia"
            className="h-7 w-auto"
          />
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenStudio}
              className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white gap-1.5"
              aria-label="Open Sanity Studio to edit website content in a new tab"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Edit website</span>
              <span className="sm:hidden">Studio</span>
            </Button>
            {user && (
              <span className="hidden font-urbanist text-sm text-white/70 md:block max-w-[200px] truncate">
                {user.email}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
