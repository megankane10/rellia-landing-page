import { ChevronDown, X } from "lucide-react"
import { adminFilterSelectTriggerClass, adminToolbarFieldBorderClass } from "@/components/admin/adminThemeClasses"
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
  /** Resets to this value when clear is clicked. Defaults to an `"all"` option when present. */
  clearValue?: T
  clearLabel?: string
  /** Set false to hide clear even when a clear value exists. */
  showClearControl?: boolean
}

const formatOptionLabel = (label: string, count?: number) =>
  count !== undefined ? `${label} (${count})` : label

const AdminSelectFilter = <T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  minWidthClass = "min-w-0 sm:min-w-[9rem]",
  className,
  clearValue,
  clearLabel = "Clear filter",
  showClearControl = true,
}: AdminSelectFilterProps<T>) => {
  const resolvedClearValue =
    clearValue ?? (options.find((option) => option.value === "all")?.value as T | undefined)
  const showClear =
    showClearControl && resolvedClearValue !== undefined && value !== resolvedClearValue

  const handleClear = () => {
    if (resolvedClearValue === undefined) return
    onChange(resolvedClearValue)
  }

  return (
    <div className={cn("flex w-auto max-w-full min-w-0 shrink-0 items-center gap-1.5 sm:gap-2", className)}>
      <div className="relative min-w-0 shrink-0">
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
          className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:right-3.5 sm:h-4 sm:w-4"
          aria-hidden
        />
      </div>
      {showClear ? (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border px-2 sm:h-10 sm:gap-1.5 sm:px-3",
            adminToolbarFieldBorderClass,
            "font-urbanist text-sm font-semibold text-muted-foreground transition-colors",
            "hover:border-rellia-teal/25 hover:bg-rellia-mint/10 hover:text-rellia-teal",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/30",
            "dark:hover:border-rellia-mint/35 dark:hover:bg-rellia-mint/10 dark:hover:text-rellia-mint",
            "dark:focus-visible:ring-rellia-mint/35",
          )}
          aria-label={clearLabel}
        >
          <X className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="hidden sm:inline">{clearLabel}</span>
        </button>
      ) : null}
    </div>
  )
}

export default AdminSelectFilter
