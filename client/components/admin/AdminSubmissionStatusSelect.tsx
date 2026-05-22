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
      className="h-9 w-[160px] rounded-full border border-black/10 bg-white font-urbanist text-sm"
      aria-label={ariaLabel}
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {SUBMISSION_STATUS_OPTIONS.map((opt) => (
        <SelectItem key={opt} value={opt}>
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

export default AdminSubmissionStatusSelect
