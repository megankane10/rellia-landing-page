import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
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
            "h-10 w-10 shrink-0 rounded-xl text-rellia-teal",
            "hover:bg-rellia-mint/15 hover:text-rellia-teal",
          )}
          onClick={toggleSidebar}
          aria-label={label}
        >
          <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="start">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export default AdminSidebarTrigger
