import type { ReactNode } from "react"
import { adminCardClass, adminCardDividerClass, adminCardTitleClass, adminMutedTextClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

export const ADMIN_CARD = adminCardClass

type AdminSectionCardProps = {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  headerActions?: ReactNode
}

const AdminSectionCard = ({
  title,
  subtitle,
  children,
  className,
  headerActions,
}: AdminSectionCardProps) => (
  <section className={cn(ADMIN_CARD, "overflow-hidden", className)}>
    <div className={cn("border-b px-5 py-4 md:px-6", adminCardDividerClass)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={cn("text-lg tracking-tight", adminCardTitleClass)}>
            {title}
          </h2>
          {subtitle ? (
            <p className={cn("mt-1 font-urbanist text-sm", adminMutedTextClass)}>{subtitle}</p>
          ) : null}
        </div>
        {headerActions ? <div className="shrink-0">{headerActions}</div> : null}
      </div>
    </div>
    <div className="px-5 py-4 md:px-6 md:py-5">{children}</div>
  </section>
)

export default AdminSectionCard
