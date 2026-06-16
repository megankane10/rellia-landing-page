import type { ReactNode } from "react"
import { adminHeadingClass, adminPageHeaderDividerClass } from "@/components/admin/adminThemeClasses"

import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  titleClassName?: string
  showDivider?: boolean
}

const AdminPageHeader = ({
  title,
  description,
  actions,
  className,
  titleClassName,
  showDivider = true,
}: AdminPageHeaderProps) => (
  <header
    className={cn(
      "mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
      showDivider ? adminPageHeaderDividerClass : "pb-0",
      className,
    )}
  >
    <div className="min-w-0">
      <h1
        className={cn(
          "font-host-grotesk text-3xl font-semibold leading-tight tracking-tight md:text-4xl md:leading-tight",
          adminHeadingClass,
          titleClassName,
        )}
      >
        {title}
      </h1>
    </div>
    {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
  </header>
)

export default AdminPageHeader
