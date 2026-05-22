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
      "group flex min-h-[168px] flex-col rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm transition-all",
      "hover:-translate-y-0.5 hover:border-rellia-teal/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
    )}
    aria-label={`${title}, ${recentHint}`}
  >
    <div className="flex items-start justify-between gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rellia-mint/20 text-rellia-teal">
        <Icon className="h-7 w-7" aria-hidden strokeWidth={1.35} />
      </span>
      <ArrowUpRight
        className="mt-0.5 h-4 w-4 shrink-0 text-black/25 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rellia-teal"
        aria-hidden
      />
    </div>
    <div className="mt-auto flex items-end justify-between gap-4 pt-8">
      <p className="font-host-grotesk text-lg font-semibold leading-tight text-black">{title}</p>
      <p className="shrink-0 pb-0.5 text-right font-urbanist text-sm text-black/60">{recentHint}</p>
    </div>
  </Link>
)

export default AdminSubmissionHubCard
