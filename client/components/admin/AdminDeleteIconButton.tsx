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
import {
  adminDialogCancelForTheme,
  adminDialogDescriptionForTheme,
  adminDialogShellForTheme,
  adminDialogTitleForTheme,
} from "@/components/admin/adminSidebarRail"
import { adminDestructiveIconButtonClass } from "@/components/admin/adminThemeClasses"
import { useAdminTheme } from "@/context/AdminThemeContext"
import { cn } from "@/lib/utils"

type AdminDeleteIconButtonProps = {
  label: string
  description: string
  tooltip?: string
  confirmLabel?: string
  triggerVariant?: "ghost" | "outline"
  triggerClassName?: string
  onConfirm: () => Promise<void>
}

const AdminDeleteIconButton = ({
  label,
  description,
  tooltip = "Delete submission",
  confirmLabel = "Delete submission",
  triggerVariant = "ghost",
  triggerClassName,
  onConfirm,
}: AdminDeleteIconButtonProps) => {
  const { resolvedTheme } = useAdminTheme()
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
              variant={triggerVariant}
              size="icon"
              className={cn(
                triggerVariant === "ghost" && adminDestructiveIconButtonClass,
                triggerVariant === "outline" &&
                  "h-8 w-8 shrink-0 rounded-full border-rellia-teal/25 text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-rellia-mint/25 dark:text-slate-400 dark:hover:border-red-500/40 dark:hover:bg-red-500/15 dark:hover:text-red-300",
                triggerClassName,
              )}
              disabled={isDeleting}
              aria-label={tooltip}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <AdminTooltipContent side="top">{tooltip}</AdminTooltipContent>
      </Tooltip>
      <AlertDialogContent className={adminDialogShellForTheme(resolvedTheme)}>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn("font-host-grotesk", adminDialogTitleForTheme(resolvedTheme))}>
            {label}
          </AlertDialogTitle>
          <AlertDialogDescription className={cn("font-urbanist", adminDialogDescriptionForTheme(resolvedTheme))}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={adminDialogCancelForTheme(resolvedTheme)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-red-600 hover:bg-red-700"
            onClick={() => void handleConfirm()}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AdminDeleteIconButton
