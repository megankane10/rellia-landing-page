import type { ReactNode } from "react"
import { adminHeadingClass, adminPageHeaderDividerClass } from "@/components/admin/adminThemeClasses"

import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  title: ReactNode
  description?: string
  actions?: ReactNode
  className?: string
  titleClassName?: string
  showDivider?: boolean
  headingLevel?: "h1" | "h2"
}

const AdminPageHeader = ({
  title,
  description,
  actions,
  className,
  titleClassName,
  showDivider = true,
  headingLevel = "h1",
}: AdminPageHeaderProps) => {
  const HeadingTag = headingLevel

  return (
  <header
    className={cn(
      "mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
      showDivider ? adminPageHeaderDividerClass : "pb-0",
      className,
    )}
  >
    <div className="min-w-0">
      <HeadingTag
        className={cn(
          "font-host-grotesk text-3xl font-semibold leading-tight tracking-tight md:text-4xl md:leading-tight",
          adminHeadingClass,
          titleClassName,
        )}
      >
        {title}
      </HeadingTag>
    </div>
    {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
  </header>
  )
}

export default AdminPageHeader
