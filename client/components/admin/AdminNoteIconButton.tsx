import { StickyNote } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import AdminSubmissionNoteEditor from "@/components/admin/AdminSubmissionNoteEditor"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import {
  adminNoteIconButtonActiveClass,
  adminNoteIconButtonClass,
} from "@/components/admin/adminThemeClasses"
import { adminPopoverContentForTheme } from "@/components/admin/adminSidebarRail"
import { useAdminTheme } from "@/context/AdminThemeContext"
import { cn } from "@/lib/utils"

type SubmissionTable = "contact_responses" | "company_profiles"

type AdminNoteIconButtonProps = {
  table: SubmissionTable
  submissionId: string
  note?: string | null
  onSaved?: () => void
}

const AdminNoteIconButton = ({ table, submissionId, note, onSaved }: AdminNoteIconButtonProps) => {
  const { resolvedTheme } = useAdminTheme()
  const hasNote = Boolean(note?.trim())
  const tooltip = hasNote ? "Edit note" : "Add note"

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                hasNote ? adminNoteIconButtonActiveClass : adminNoteIconButtonClass,
              )}
              aria-label={tooltip}
            >
              <StickyNote className={cn("h-4 w-4", hasNote && "fill-rellia-teal/25 dark:fill-rellia-mint/30")} aria-hidden />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <AdminTooltipContent side="top">{tooltip}</AdminTooltipContent>
      </Tooltip>
      <PopoverContent align="end" className={cn("w-80", adminPopoverContentForTheme(resolvedTheme))}>
        <AdminSubmissionNoteEditor
          table={table}
          submissionId={submissionId}
          initialNote={note}
          onSaved={onSaved}
          compact
        />
      </PopoverContent>
    </Popover>
  )
}

export default AdminNoteIconButton
