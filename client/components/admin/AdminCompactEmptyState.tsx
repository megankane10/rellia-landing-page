import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AdminCompactEmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const AdminCompactEmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: AdminCompactEmptyStateProps) => (
  <div
    className={cn(
      "rounded-2xl border border-dashed border-black/10 bg-white/70 px-6 py-10 text-center",
      className,
    )}
    role="status"
    aria-live="polite"
  >
    <div className="mb-4 flex justify-center" aria-hidden>
      <Icon className="h-12 w-12 text-rellia-teal" strokeWidth={1.35} />
    </div>
    <p className="font-host-grotesk text-xl font-semibold text-black">{title}</p>
    {description ? (
      <p className="mx-auto mt-2 max-w-md font-urbanist text-sm text-black/55">{description}</p>
    ) : null}
    {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
  </div>
)

export default AdminCompactEmptyState
