import { cn } from "@/lib/utils"

export type SectionPillBadgeProps = {
  children: React.ReactNode
  className?: string
}

export default function SectionPillBadge({ children, className }: SectionPillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-rellia-teal/25 bg-rellia-teal px-4 py-1.5",
        "font-urbanist text-xs md:text-sm font-semibold text-white shadow-sm",
        className,
      )}
    >
      {children}
    </span>
  )
}

