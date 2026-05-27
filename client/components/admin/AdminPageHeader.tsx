import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

const AdminPageHeader = ({ title, description, actions, className }: AdminPageHeaderProps) => (
  <header
    className={cn(
      "mb-6 flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between",
      className,
    )}
  >
    <div className="min-w-0">
      <h1 className="font-host-grotesk text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 max-w-2xl font-urbanist text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
    {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
  </header>
)

export default AdminPageHeader
