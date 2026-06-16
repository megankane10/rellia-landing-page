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
        ? "bg-rellia-mint/35 text-rellia-teal"
        : "bg-muted text-muted-foreground hover:bg-muted/80",
      className,
    )}
    aria-pressed={isActive}
  >
    <span>{label}</span>
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
        isActive ? "bg-rellia-teal/15 text-rellia-teal" : "bg-black/5 text-black/55",
      )}
    >
      {count}
    </span>
  </button>
)

export default AdminFilterPill
