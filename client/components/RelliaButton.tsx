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
      className={cn(
        size === "lg" ? "text-base md:text-lg px-10 py-5" : "text-base md:text-lg px-9 py-4",
        "hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
      {...props}
    />
  )
}
