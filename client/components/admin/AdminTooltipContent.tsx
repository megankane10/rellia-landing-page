import type { ComponentPropsWithoutRef } from "react"
import { TooltipContent } from "@/components/ui/tooltip"
import { adminTooltipContentClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

type AdminTooltipContentProps = ComponentPropsWithoutRef<typeof TooltipContent>

const AdminTooltipContent = ({ className, ...props }: AdminTooltipContentProps) => (
  <TooltipContent className={cn(adminTooltipContentClass, className)} {...props} />
)

export default AdminTooltipContent
