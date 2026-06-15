import { cn } from "@/lib/utils"
import {
  relliaProfilePrimaryTagCardClass,
} from "@/lib/relliaMetaBadge"

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
      {/* Primary tag — premium redesigned badge */}
      <span
        key={primary}
        className={cn(
          variant === "onPhoto"
            ? cn(relliaProfilePrimaryTagCardClass, "backdrop-blur-md")
            : relliaProfilePrimaryTagCardClass,
        )}
      >
        {primary}
      </span>

      {/* Secondary tags — brand color chips with light background */}
      {secondary.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex rounded-full border px-2.5 py-0.5 font-urbanist text-[10.5px] font-extrabold shadow-sm",
            "border-[#adcac6]/80 bg-white/70 text-rellia-teal backdrop-blur-sm",
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
