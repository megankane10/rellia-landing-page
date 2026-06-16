import { cn } from "@/lib/utils"

type AdminFilterPillProps = {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  size?: "sm" | "md"
  className?: string
}

const AdminFilterPill = ({
  label,
  count,
  isActive,
  onClick,
  size = "sm",
  className,
}: AdminFilterPillProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-2 rounded-full font-urbanist font-semibold transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
      isActive
        ? "border border-rellia-teal/20 bg-rellia-mint/35 text-rellia-teal shadow-[inset_0_0_0_1px_rgba(13,53,64,0.06)] dark:border-rellia-mint/25 dark:bg-rellia-mint/15 dark:text-rellia-mint dark:shadow-[inset_0_0_0_1px_rgba(134,239,172,0.12)]"
        : "border border-transparent bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground dark:bg-slate-800/55 dark:text-slate-300 dark:hover:bg-slate-800/75 dark:hover:text-white",
      className,
    )}
    aria-pressed={isActive}
  >
    <span>{label}</span>
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
        isActive
          ? "bg-rellia-teal/15 text-rellia-teal dark:bg-rellia-mint/20 dark:text-rellia-mint"
          : "bg-foreground/5 text-muted-foreground dark:bg-white/8 dark:text-slate-400",
      )}
    >
      {count}
    </span>
  </button>
)

export default AdminFilterPill
