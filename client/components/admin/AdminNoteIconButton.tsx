import { StickyNote } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import AdminSubmissionNoteEditor from "@/components/admin/AdminSubmissionNoteEditor"
import { cn } from "@/lib/utils"

type SubmissionTable = "contact_responses" | "company_profiles"

type AdminNoteIconButtonProps = {
  table: SubmissionTable
  submissionId: string
  note?: string | null
  onSaved?: () => void
}

const AdminNoteIconButton = ({ table, submissionId, note, onSaved }: AdminNoteIconButtonProps) => {
  const hasNote = Boolean(note?.trim())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0 rounded-full",
            hasNote
              ? "text-rellia-teal hover:bg-rellia-mint/30 hover:text-rellia-teal"
              : "text-black/40 hover:bg-rellia-mint/20 hover:text-rellia-teal",
          )}
          aria-label={hasNote ? "Edit submission note" : "Add submission note"}
        >
          <StickyNote className={cn("h-4 w-4", hasNote && "fill-rellia-teal/25")} aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl p-4">
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
