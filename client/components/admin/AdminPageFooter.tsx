import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { resolveSanityStudioOrigin } from "@shared/admin/notifyLinks"

const AdminPageFooter = () => {
  const studioUrl = resolveSanityStudioOrigin()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-12 border-t border-slate-100 pt-6 pb-8">
      <div className="flex flex-col gap-3 text-sm font-urbanist sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-slate-600">Admin Dashboard</p>
          <p className="mt-1 text-xs text-slate-400">© {year} Rellia Health. Internal use only.</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-700">
          <Link
            to="/admin/help#docs"
            className="inline-flex items-center gap-1 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Documentation
          </Link>
          <a
            href={studioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Sanity Studio
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Website
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default AdminPageFooter
