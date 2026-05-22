import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
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
      <Navbar
        forceSolid
        hideAnnouncement
        ctaLabel="Manage content"
        ctaTo={SANITY_STUDIO_URL}
        ctaOpenInNewTab
      />

      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <p className="font-urbanist text-sm text-black/55">
            {user?.email ? (
              <>
                Signed in as{" "}
                <span className="font-medium text-rellia-teal">{user.email}</span>
              </>
            ) : (
              "Admin workspace"
            )}
          </p>
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

      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default AdminLayout
