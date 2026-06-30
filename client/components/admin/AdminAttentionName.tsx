import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export const AdminAttentionDot = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inline-block h-2 w-2 shrink-0 rounded-full bg-orange-500 ring-2 ring-orange-500/25",
      "dark:bg-orange-400 dark:ring-orange-400/30",
      className,
    )}
    aria-hidden
  />
)

type AdminAttentionNameProps = {
  children: ReactNode
  needsAttention?: boolean
  className?: string
}

export const AdminAttentionName = ({
  children,
  needsAttention = false,
  className,
}: AdminAttentionNameProps) => (
  <span
    className={cn(
      "inline-flex min-w-0 max-w-full items-center gap-2",
      needsAttention && "font-bold text-foreground",
      className,
    )}
  >
    {needsAttention ? <AdminAttentionDot /> : null}
    <span className="truncate">{children}</span>
  </span>
)

type AdminAttentionNameLinkProps = AdminAttentionNameProps & {
  to: string
  linkClassName?: string
}

export const AdminAttentionNameLink = ({
  to,
  children,
  needsAttention = false,
  className,
  linkClassName,
}: AdminAttentionNameLinkProps) => (
  <Link
    to={to}
    className={cn(
      "min-w-0 text-rellia-teal underline-offset-4 hover:underline dark:text-rellia-mint",
      linkClassName,
    )}
  >
    <AdminAttentionName needsAttention={needsAttention} className={className}>
      {children}
    </AdminAttentionName>
  </Link>
)
