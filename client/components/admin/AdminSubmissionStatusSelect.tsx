import { useState } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import AdminSubmissionStatusBadge from "@/components/admin/AdminSubmissionStatusBadge"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import { adminNoteIconButtonClass } from "@/components/admin/adminThemeClasses"
import { adminPopoverContentForTheme } from "@/components/admin/adminSidebarRail"
import { useAdminTheme } from "@/context/AdminThemeContext"
import {
  statusBadgeClassForTheme,
  SUBMISSION_STATUS_OPTIONS,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import { cn } from "@/lib/utils"

type AdminSubmissionStatusSelectProps = {
  value: SubmissionStatus
  disabled?: boolean
  ariaLabel: string
  onValueChange: (value: SubmissionStatus) => void
}

const AdminSubmissionStatusSelect = ({
  value,
  disabled,
  ariaLabel,
  onValueChange,
}: AdminSubmissionStatusSelectProps) => {
  const { resolvedTheme } = useAdminTheme()
  const [open, setOpen] = useState(false)

  const handleSelect = (next: SubmissionStatus) => {
    if (next === value) {
      setOpen(false)
      return
    }
    onValueChange(next)
    setOpen(false)
  }

  return (
    <div className="inline-flex max-w-full items-center gap-0.5">
      <AdminSubmissionStatusBadge status={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                className={cn(adminNoteIconButtonClass, "h-8 w-8 shrink-0")}
                aria-label="Change status"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <AdminTooltipContent side="top">Change status</AdminTooltipContent>
        </Tooltip>
        <PopoverContent
          align="start"
          className={cn("w-auto p-3", adminPopoverContentForTheme(resolvedTheme))}
        >
          <div
            className="flex flex-col items-start gap-2"
            role="listbox"
            aria-label={`Status options for ${ariaLabel}`}
          >
            {SUBMISSION_STATUS_OPTIONS.map((option) => {
              const isSelected = option === value
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    statusBadgeClassForTheme(option, resolvedTheme),
                    "cursor-pointer transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/30 focus-visible:ring-offset-2 dark:focus-visible:ring-rellia-mint/35",
                    isSelected && "ring-2 ring-rellia-teal/20 ring-offset-1 dark:ring-rellia-mint/25",
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default AdminSubmissionStatusSelect
