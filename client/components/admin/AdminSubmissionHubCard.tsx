import { Link } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type AdminSubmissionHubCardProps = {
  title: string
  description: string
  to: string
  total: number | string
  recentHint?: string
  icon: LucideIcon
  accent?: "teal" | "mint"
}

const AdminSubmissionHubCard = ({
  title,
  description,
  to,
  total,
  recentHint,
  icon: Icon,
  accent = "teal",
}: AdminSubmissionHubCardProps) => (
  <Link
    to={to}
    className={cn(
      "group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white/90 p-5 shadow-sm transition-all",
      "hover:-translate-y-0.5 hover:border-rellia-teal/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
    )}
    aria-label={`${title}, ${total} total${recentHint ? `, ${recentHint}` : ""}`}
  >
    <div
      className={cn(
        "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-60 blur-2xl",
        accent === "teal" ? "bg-rellia-mint/35" : "bg-rellia-teal/10",
      )}
      aria-hidden
    />
    <div className="relative flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
        <div className="min-w-0">
          <p className="font-host-grotesk text-base font-semibold text-rellia-teal">{title}</p>
          <p className="mt-0.5 font-urbanist text-xs text-black/50">{description}</p>
          {recentHint ? (
            <p className="mt-2 font-urbanist text-[11px] text-black/45">{recentHint}</p>
          ) : null}
        </div>
      </div>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-black/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rellia-teal"
        aria-hidden
      />
    </div>
    <p className="relative mt-4 font-host-grotesk text-3xl font-bold tracking-tight text-rellia-teal">
      {total}
    </p>
  </Link>
)

export default AdminSubmissionHubCard
