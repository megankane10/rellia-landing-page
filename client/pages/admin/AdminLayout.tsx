import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import { ADMIN_NAVBAR_OFFSET_CLASS, ADMIN_NAVBAR_PROPS } from "@/lib/adminNav"

const AdminLayout = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-rellia-cream font-host-grotesk">
      <Navbar {...ADMIN_NAVBAR_PROPS} />
      <div className={ADMIN_NAVBAR_OFFSET_CLASS}>
        <div className="border-b border-black/10 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
            <p className="font-urbanist text-sm text-black/60">Admin portal</p>
            <div className="flex items-center gap-3">
              {user ? (
                <span className="hidden font-urbanist text-sm text-black/70 md:block max-w-[220px] truncate">
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
        </div>
        <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
