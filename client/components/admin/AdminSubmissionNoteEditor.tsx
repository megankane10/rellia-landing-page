import { useEffect, useState } from "react"
import { Loader2, StickyNote } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { adminAccentClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

type SubmissionTable = "contact_responses" | "company_profiles"

type AdminSubmissionNoteEditorProps = {
  table: SubmissionTable
  submissionId: string
  initialNote?: string | null
  onSaved?: () => void
  className?: string
  compact?: boolean
}

const AdminSubmissionNoteEditor = ({
  table,
  submissionId,
  initialNote = "",
  onSaved,
  className,
  compact = false,
}: AdminSubmissionNoteEditorProps) => {
  const [note, setNote] = useState(initialNote ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    queueMicrotask(() => setNote(initialNote ?? ""))
  }, [initialNote, submissionId])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    const trimmed = note.trim()
    const { error: updateError } = await supabase
      .from(table)
      .update({ admin_note: trimmed || null })
      .eq("id", submissionId)
    setSaving(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setSaved(true)
    onSaved?.()
  }

  return (
    <div className={cn("space-y-3", className)}>
      {!compact ? (
        <div className="flex items-center gap-2">
          <StickyNote className={cn("h-4 w-4", adminAccentClass)} aria-hidden />
          <p className="font-urbanist text-sm font-medium text-muted-foreground">Internal note</p>
        </div>
      ) : null}
      <Textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value)
          setSaved(false)
        }}
        placeholder="Add a note for your team…"
        rows={compact ? 4 : 5}
        className="resize-y rounded-xl border-rellia-teal/15 bg-card/80 font-urbanist text-sm dark:border-rellia-mint/25 dark:bg-slate-900/40 dark:text-foreground"
        aria-label="Submission note"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="rounded-full bg-rellia-teal font-urbanist hover:bg-rellia-teal/90"
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save note"
          )}
        </Button>
        {saved ? (
          <span className="font-urbanist text-xs text-emerald-700 dark:text-emerald-400">Note saved</span>
        ) : null}
        {error ? (
          <span className="font-urbanist text-xs text-red-600 dark:text-red-400">{error}</span>
        ) : null}
      </div>
    </div>
  )
}

export default AdminSubmissionNoteEditor
