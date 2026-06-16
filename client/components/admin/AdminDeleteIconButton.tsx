import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import { adminLightDialogShellClass } from "@/components/admin/adminSidebarRail"
import { adminDestructiveIconButtonClass } from "@/components/admin/adminThemeClasses"

type AdminDeleteIconButtonProps = {
  label: string
  description: string
  tooltip?: string
  onConfirm: () => Promise<void>
}

const AdminDeleteIconButton = ({
  label,
  description,
  tooltip = "Delete submission",
  onConfirm,
}: AdminDeleteIconButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={adminDestructiveIconButtonClass}
              disabled={isDeleting}
              aria-label={tooltip}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <AdminTooltipContent side="top">{tooltip}</AdminTooltipContent>
      </Tooltip>
      <AlertDialogContent className={adminLightDialogShellClass}>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-host-grotesk">{label}</AlertDialogTitle>
          <AlertDialogDescription className="font-urbanist">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-red-600 hover:bg-red-700"
            onClick={() => void handleConfirm()}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete submission"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AdminDeleteIconButton
