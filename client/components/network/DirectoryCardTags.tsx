import { cn } from "@/lib/utils"

type DirectoryCardTagsProps = {
  tags: string[]
  variant?: "onPhoto" | "onLight"
  className?: string
}

/** Shared directory card tag chips (alumni + advisors). */
export const DirectoryCardTags = ({
  tags,
  variant = "onPhoto",
  className,
}: DirectoryCardTagsProps) => {
  const unique = [...new Set(tags.map((t) => t.trim()).filter(Boolean))]
  if (unique.length === 0) return null

  const [primary, ...secondary] = unique

  return (
    <div
      className={cn(
        "absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5",
        className,
      )}
    >
      {/* Primary tag — brand teal pill */}
      <span
        key={primary}
        className={cn(
          "inline-flex rounded-full border px-2.5 py-0.5 font-urbanist text-[10px] font-semibold backdrop-blur-sm shadow-sm",
          "border-rellia-teal bg-rellia-teal text-white",
        )}
      >
        {primary}
      </span>

      {/* Secondary tags — neutral chips */}
      {secondary.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex rounded-full border px-2.5 py-0.5 font-urbanist text-[10px] font-semibold backdrop-blur-sm shadow-sm",
            variant === "onPhoto"
              ? "border-white/20 bg-black/40 text-white/90"
              : "border-black/10 bg-black/5 text-black/60",
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
