import { Link } from "react-router-dom"
import { resolveSanityStudioOrigin } from "@shared/admin/notifyLinks"

const SUPABASE_STATUS_URL = "https://status.supabase.com/"
const VERCEL_STATUS_URL = "https://www.vercel-status.com/"

const AdminPageFooter = () => {
  const studioUrl = resolveSanityStudioOrigin()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-12 border-t border-slate-100 pt-6 pb-8">
      <div className="grid gap-6 text-sm font-urbanist sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-slate-600">Rellia Admin Panel</p>
          <p className="mt-1 text-xs text-slate-400">© {year} Rellia Health. Internal use only.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to="/admin/help#docs"
            className="w-fit text-slate-700 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Documentation
          </Link>
          <a
            href={SUPABASE_STATUS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-slate-700 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Supabase system status
          </a>
          <a
            href={VERCEL_STATUS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-slate-700 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Vercel system status
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={studioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-slate-700 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Sanity Studio portal
          </a>
          <a
            href="/"
            className="w-fit text-slate-700 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Main production website
          </a>
        </div>
      </div>
    </footer>
  )
}

export default AdminPageFooter
