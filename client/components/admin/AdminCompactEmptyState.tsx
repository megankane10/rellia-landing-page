import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { adminEmptyStateClass, adminHeadingClass, adminMutedTextClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

type AdminCompactEmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
  descriptionClassName?: string
}

const AdminCompactEmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  descriptionClassName,
}: AdminCompactEmptyStateProps) => (
  <div
    className={cn(adminEmptyStateClass, "px-6 py-10 text-center", className)}
    role="status"
    aria-live="polite"
  >
    <div className="mb-4 flex justify-center" aria-hidden>
      <Icon className="h-12 w-12 text-rellia-teal dark:text-rellia-mint" strokeWidth={1.35} />
    </div>
    <p className={cn("font-host-grotesk text-xl font-semibold", adminHeadingClass)}>{title}</p>
    {description ? (
      <p className={cn("mx-auto mt-2 max-w-md font-urbanist text-sm", adminMutedTextClass, descriptionClassName)}>
        {description}
      </p>
    ) : null}
    {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
  </div>
)

export default AdminCompactEmptyState
