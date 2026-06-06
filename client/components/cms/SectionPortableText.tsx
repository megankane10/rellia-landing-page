import type { SanityPortableText } from "@shared/cms/types"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"

type SectionPortableTextProps = {
  value: SanityPortableText | string | null | undefined
  variant: "heading" | "subheading"
  tone: "light" | "dark"
  className?: string
}

const blockText = (block: { children?: Array<{ text?: string }> }) =>
  (block.children ?? []).map((child) => child.text ?? "").join("").trim()

export const SectionPortableText = ({ value, variant, tone, className }: SectionPortableTextProps) => {
  const normalized = normalizeToPortableText(value)
  if (!normalized?.length) return null

  const headingClass =
    tone === "light"
      ? "font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]"
      : "font-host-grotesk text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl"

  const subheadingClass =
    tone === "light"
      ? "font-urbanist text-base font-medium leading-relaxed text-white/80 md:text-lg"
      : "font-urbanist text-base leading-relaxed text-black/65 md:text-lg"

  return (
    <div className={className}>
      {normalized.map((block, index) => {
        if (block._type !== "block") return null
        const text = blockText(block as { children?: Array<{ text?: string }> })
        if (!text) return null

        if (variant === "subheading") {
          return (
            <p key={block._key ?? index} className={cn(subheadingClass, index > 0 && "mt-3")}>
              {text}
            </p>
          )
        }

        const Tag = block.style === "h3" ? "h3" : "h2"
        return (
          <Tag key={block._key ?? index} className={headingClass}>
            {text}
          </Tag>
        )
      })}
    </div>
  )
}
