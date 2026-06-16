import { adminCardDividerClass, adminMutedTextClass } from "@/components/admin/adminThemeClasses"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { resolvePublicWebsiteUrl } from "@shared/admin/notifyLinks"
import { cn } from "@/lib/utils"

const AdminPageFooter = () => {
  const publicWebsiteUrl = resolvePublicWebsiteUrl()
  const year = new Date().getFullYear()

  return (
    <footer className={cn("mt-12 border-t pt-6 pb-8", adminCardDividerClass)}>
      <div className="flex flex-col-reverse gap-3 text-sm font-urbanist sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={cn("text-sm", adminMutedTextClass)}>© {year} Rellia Health. Internal use only.</p>
        </div>

        <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", adminMutedTextClass)}>
          <Link
            to="/admin/help#docs"
            className="inline-flex items-center gap-1 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Need help?
          </Link>
          <a
            href={publicWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Website <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default AdminPageFooter
