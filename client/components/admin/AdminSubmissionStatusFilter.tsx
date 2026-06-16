import { cn } from "@/lib/utils"
import {
  statusFilterButtonClass,
  statusFilterCountBadgeClass,
  SUBMISSION_STATUS_OPTIONS,
  type StatusFilterValue,
} from "@/lib/adminSubmissionStatus"

type AdminSubmissionStatusFilterProps = {
  value: StatusFilterValue
  onChange: (value: StatusFilterValue) => void
  counts: Record<StatusFilterValue, number>
  className?: string
}

const FILTER_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  ...SUBMISSION_STATUS_OPTIONS.map((status) => ({ value: status, label: status })),
]

const AdminSubmissionStatusFilter = ({
  value,
  onChange,
  counts,
  className,
}: AdminSubmissionStatusFilterProps) => (
  <div
    className={cn("flex flex-wrap gap-2", className)}
    role="group"
    aria-label="Filter submissions by status"
  >
    {FILTER_OPTIONS.map((option) => {
      const isActive = value === option.value
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={statusFilterButtonClass(option.value, isActive)}
          aria-pressed={isActive}
        >
          <span>{option.label}</span>
          <span className={statusFilterCountBadgeClass(option.value, isActive)}>
            {counts[option.value] ?? 0}
          </span>
        </button>
      )
    })}
  </div>
)

export default AdminSubmissionStatusFilter
