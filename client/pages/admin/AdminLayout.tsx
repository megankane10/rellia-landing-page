import { Outlet, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { OPERATIONS_DOC_EDIT_URL } from "@shared/cms/operationsDocUrl"

const FAVICON_SRC = "/favicon.ico"

const AdminLayout = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,hsl(var(--rellia-cream))_0%,#f4f8f9_45%,#eef6f4_100%)] font-host-grotesk">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
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
              <p className="font-host-grotesk text-lg font-semibold leading-tight text-black">
                Admin Dashboard
              </p>
              <p className="font-urbanist text-sm text-black/55">Rellia Health</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.email ? (
              <span className="max-w-[min(100%,280px)] truncate font-urbanist text-sm text-black/70">
                {user.email}
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
        <footer className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/[0.06] pt-6">
          <a
            href="/"
            className="font-urbanist text-sm text-black/50 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
          >
            Website
          </a>
          <a
            href={OPERATIONS_DOC_EDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-urbanist text-sm text-black/50 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
          >
            Admin Instructions Doc
          </a>
        </footer>
      </main>
    </div>
  )
}

export default AdminLayout
