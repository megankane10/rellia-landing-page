import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type AdminCompactEmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  className?: string
}

const AdminCompactEmptyState = ({
  icon: Icon,
  title,
  description,
  className,
}: AdminCompactEmptyStateProps) => (
  <div
    className={cn("rounded-2xl border border-dashed border-black/10 bg-white/70 px-4 py-8 text-center", className)}
    role="status"
    aria-live="polite"
  >
    <div className="mb-3 flex justify-center" aria-hidden>
      <Icon className="h-10 w-10 text-rellia-teal" strokeWidth={1.4} />
    </div>
    <p className="font-host-grotesk text-lg font-semibold text-black">{title}</p>
    {description ? (
      <p className="mx-auto mt-2 max-w-md font-urbanist text-sm text-black/55">{description}</p>
    ) : null}
  </div>
)

export default AdminCompactEmptyState
