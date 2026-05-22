import { Link } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type AdminSubmissionHubCardProps = {
  title: string
  to: string
  recentHint: string
  icon: LucideIcon
}

const AdminSubmissionHubCard = ({
  title,
  to,
  recentHint,
  icon: Icon,
}: AdminSubmissionHubCardProps) => (
  <Link
    to={to}
    className={cn(
      "group flex min-h-[168px] flex-col justify-between rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm transition-all",
      "hover:-translate-y-0.5 hover:border-rellia-teal/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
    )}
    aria-label={`${title}, ${recentHint}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Icon className="h-8 w-8 shrink-0 text-rellia-teal md:h-9 md:w-9" aria-hidden strokeWidth={1.5} />
        <p className="mt-3 font-host-grotesk text-xl font-semibold leading-tight text-black md:text-2xl">
          {title}
        </p>
      </div>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-black/25 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rellia-teal"
        aria-hidden
      />
    </div>
    <p className="mt-6 text-right font-urbanist text-sm text-black/60">{recentHint}</p>
  </Link>
)

export default AdminSubmissionHubCard
