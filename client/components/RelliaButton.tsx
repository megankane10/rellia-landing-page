import { cn } from "@/lib/utils"
import RelliaAction from "@/components/RelliaAction"

export default function RelliaButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
  size?: "md" | "lg"
}) {
  const actionVariant = variant === "primary" ? "brandSolid" : "brandOutline"
  return (
    <RelliaAction
      variant={actionVariant}
      size={size}
      className={className}
      {...props}
    />
  )
}
