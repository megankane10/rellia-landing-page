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
      {/* Primary tag — teal pill with softer opacity */}
      <span
        key={primary}
        className={cn(
          "inline-flex rounded-full border px-2.5 py-0.5 font-urbanist text-[10px] font-semibold backdrop-blur-sm shadow-sm",
          variant === "onPhoto"
            ? "border-rellia-mint/70 bg-rellia-mint/35 text-white"
            : "border-rellia-teal/30 bg-rellia-mint/22 text-rellia-teal",
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
              ? "border-white/22 bg-black/45 text-white/92"
              : "border-black/10 bg-white/85 text-black/78",
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
