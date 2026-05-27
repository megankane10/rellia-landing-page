import { cn } from "@/lib/utils"
import {
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
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-urbanist text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
            isActive
              ? "border-rellia-teal/30 bg-rellia-teal text-white"
              : "border-black/10 bg-white text-black/70 hover:border-rellia-teal/20 hover:text-rellia-teal",
          )}
          aria-pressed={isActive}
        >
          <span>{option.label}</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-xs font-medium",
              isActive ? "bg-white/20 text-white" : "bg-black/5 text-black/55",
            )}
          >
            {counts[option.value] ?? 0}
          </span>
        </button>
      )
    })}
  </div>
)

export default AdminSubmissionStatusFilter
