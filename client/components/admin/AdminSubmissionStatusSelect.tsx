import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SUBMISSION_STATUS_OPTIONS,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import { adminSubmissionStatusSelectTriggerClass } from "@/components/admin/adminThemeClasses"
import { adminSelectContentClass } from "@/components/admin/adminSidebarRail"

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
}: AdminSubmissionStatusSelectProps) => (
  <Select value={value} disabled={disabled} onValueChange={(v) => onValueChange(v as SubmissionStatus)}>
    <SelectTrigger
      className={adminSubmissionStatusSelectTriggerClass}
      aria-label={ariaLabel}
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent className={adminSelectContentClass}>
      {SUBMISSION_STATUS_OPTIONS.map((opt) => (
        <SelectItem key={opt} value={opt}>
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

export default AdminSubmissionStatusSelect
