import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const AdminSidebarTrigger = () => {
  const { open, toggleSidebar } = useSidebar()
  const label = open ? "Collapse sidebar" : "Expand sidebar"
  const Icon = open ? PanelLeftClose : PanelLeftOpen

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          data-sidebar="trigger"
          variant="ghost"
          size="icon"
          className={cn(
            "h-11 w-11 shrink-0 rounded-xl text-rellia-teal",
            "hover:bg-rellia-mint/15 hover:text-rellia-teal",
          )}
          onClick={toggleSidebar}
          aria-label={label}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </Button>
      </TooltipTrigger>
      <AdminTooltipContent side="bottom" align="start">
        {label}
      </AdminTooltipContent>
    </Tooltip>
  )
}

export default AdminSidebarTrigger
