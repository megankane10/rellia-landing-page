import { useCallback, useEffect, useRef, useState } from "react"
import { Bold, List } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  applyTeamNoteBold,
  applyTeamNoteBullet,
  isTeamNoteBoldActive,
  isTeamNoteBulletActive,
} from "@/lib/teamNoteRichText"
import { cn } from "@/lib/utils"

type TeamNoteMessageFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const formatButtonClass = (active: boolean) =>
  cn(
    "inline-flex h-9 items-center justify-center rounded-xl border bg-white px-3 font-urbanist text-xs transition-colors",
    "hover:border-rellia-teal/30 hover:bg-rellia-mint/15",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
    active
      ? "border-rellia-teal bg-rellia-mint/25 text-rellia-teal ring-2 ring-rellia-teal/30"
      : "border-border text-foreground",
  )

const TeamNoteMessageField = ({
  id,
  value,
  onChange,
  placeholder,
  className,
}: TeamNoteMessageFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [boldActive, setBoldActive] = useState(false)
  const [bulletActive, setBulletActive] = useState(false)

  const syncFormatState = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd } = textarea
    setBoldActive(isTeamNoteBoldActive(value, selectionStart, selectionEnd))
    setBulletActive(isTeamNoteBulletActive(value, selectionStart, selectionEnd))
  }, [value])

  useEffect(() => {
    syncFormatState()
  }, [syncFormatState])

  const applyFormat = (
    formatter: (value: string, start: number, end: number) => {
      value: string
      selectionStart: number
      selectionEnd: number
    },
  ) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd } = textarea
    const result = formatter(value, selectionStart, selectionEnd)
    onChange(result.value)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd)
      syncFormatState()
    })
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={formatButtonClass(boldActive)}
          onClick={() => applyFormat(applyTeamNoteBold)}
          aria-label="Bold"
          aria-pressed={boldActive}
        >
          <Bold className="mr-1 h-3.5 w-3.5" aria-hidden />
          Bold
        </button>
        <button
          type="button"
          className={formatButtonClass(bulletActive)}
          onClick={() => applyFormat(applyTeamNoteBullet)}
          aria-label="Bullet list"
          aria-pressed={bulletActive}
        >
          <List className="mr-1 h-3.5 w-3.5" aria-hidden />
          Bullets
        </button>
      </div>
      <Textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={syncFormatState}
        onKeyUp={syncFormatState}
        onClick={syncFormatState}
        placeholder={placeholder}
        className="min-h-[148px] resize-y font-urbanist text-sm"
      />
      <p className="font-urbanist text-[11px] text-muted-foreground">
        Select text, then use Bold or Bullets to apply — click again to remove. Markdown:{" "}
        <strong className="font-semibold">**bold**</strong> and lines starting with{" "}
        <code className="rounded bg-muted px-1">- </code>.
      </p>
    </div>
  )
}

export default TeamNoteMessageField
