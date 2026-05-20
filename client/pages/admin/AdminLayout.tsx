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

  return (
    <div className="min-h-screen bg-rellia-cream">
      <header className="bg-rellia-teal px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <img
            src="/images/logo-rellia-footer.webp"
            alt="Rellia"
            className="h-7 w-auto"
          />
          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden font-urbanist text-sm text-white/70 sm:block">
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
