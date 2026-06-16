import { adminTableMessageCellClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

type AdminTableMultilineTextProps = {
  value: string | null | undefined
  className?: string
  lines?: 3 | 4
}

const AdminTableMultilineText = ({
  value,
  className,
  lines = 4,
}: AdminTableMultilineTextProps) => {
  const trimmed = value?.trim()
  if (!trimmed) return <span className="text-muted-foreground">—</span>

  return (
    <p
      className={cn(
        adminTableMessageCellClass,
        lines === 3 && "line-clamp-3",
        lines === 4 && "line-clamp-4",
        className,
      )}
      title={trimmed}
    >
      {trimmed}
    </p>
  )
}

export default AdminTableMultilineText
