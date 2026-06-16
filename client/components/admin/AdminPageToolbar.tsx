import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AdminPageToolbarProps = {
  children: ReactNode
  className?: string
}

/** Top-of-page action row (replaces page headers that moved to the shell navbar). */
const AdminPageToolbar = ({ children, className }: AdminPageToolbarProps) => (
  <div className={cn("mb-6 flex flex-wrap items-center justify-end gap-2", className)}>{children}</div>
)

export default AdminPageToolbar
