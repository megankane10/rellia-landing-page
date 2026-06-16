import { ChevronDown } from "lucide-react"
import { adminFilterSelectTriggerClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

export type AdminSelectFilterOption<T extends string> = {
  value: T
  label: string
  count?: number
}

type AdminSelectFilterProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: AdminSelectFilterOption<T>[]
  ariaLabel: string
  minWidthClass?: string
  className?: string
}

const formatOptionLabel = (label: string, count?: number) =>
  count !== undefined ? `${label} (${count})` : label

const AdminSelectFilter = <T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  minWidthClass = "min-w-[9rem]",
  className,
}: AdminSelectFilterProps<T>) => (
  <div className={cn("relative shrink-0", className)}>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className={cn(adminFilterSelectTriggerClass, minWidthClass)}
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {formatOptionLabel(option.label, option.count)}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      aria-hidden
    />
  </div>
)

export default AdminSelectFilter
