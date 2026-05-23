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
      "group flex min-h-[120px] flex-col rounded-3xl border border-black/[0.06] bg-white p-4 transition-all",
      "hover:-translate-y-0.5 hover:border-rellia-teal/20 hover:shadow-[0_8px_30px_-20px_rgba(13,53,64,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
    )}
    aria-label={`${title}, ${recentHint}`}
  >
    <div className="flex items-start justify-between gap-3">
      <Icon className="h-5 w-5 shrink-0 text-rellia-teal/80" aria-hidden strokeWidth={1.35} />
      <ArrowUpRight
        className="mt-0.5 h-4 w-4 shrink-0 text-black/25 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rellia-teal"
        aria-hidden
      />
    </div>
    <div className="mt-auto flex items-end justify-between gap-4 pt-6">
      <p className="font-host-grotesk text-base leading-tight text-black/90">{title}</p>
      <p className="shrink-0 pb-0.5 text-right font-urbanist text-xs text-black/50">{recentHint}</p>
    </div>
  </Link>
)

export default AdminSubmissionHubCard
