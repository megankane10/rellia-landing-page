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
import { adminLightDialogShellClass } from "@/components/admin/adminSidebarRail"
import { adminDestructiveOutlineButtonClass } from "@/components/admin/adminThemeClasses"

type AdminDeleteSubmissionButtonProps = {
  label: string
  description: string
  onConfirm: () => Promise<void>
}

const AdminDeleteSubmissionButton = ({
  label,
  description,
  onConfirm,
}: AdminDeleteSubmissionButtonProps) => {
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
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={adminDestructiveOutlineButtonClass}
          disabled={isDeleting}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Delete
        </Button>
      </AlertDialogTrigger>
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

export default AdminDeleteSubmissionButton
