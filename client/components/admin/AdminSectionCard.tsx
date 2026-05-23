import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export const ADMIN_CARD = "rounded-3xl border border-black/[0.06] bg-white"

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
    <div className="border-b border-black/[0.06] px-5 py-4 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-host-grotesk text-lg font-semibold tracking-tight text-black">{title}</h2>
          {subtitle ? <p className="mt-1 font-urbanist text-sm text-black/55">{subtitle}</p> : null}
        </div>
        {headerActions ? <div className="shrink-0">{headerActions}</div> : null}
      </div>
    </div>
    <div className="px-5 py-4 md:px-6 md:py-5">{children}</div>
  </section>
)

export default AdminSectionCard
