import type { SanityPortableText } from "@shared/cms/types"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"
import { renderPtSpans, type PtBlock } from "@/lib/renderCmsPortableText"
import { HEADING_SECTION_SUBTITLE } from "@/lib/typography"

type SectionPortableTextProps = {
  value: SanityPortableText | string | null | undefined
  variant: "heading" | "subheading"
  tone: "light" | "dark"
  className?: string
}

const hasBlockText = (block: PtBlock) =>
  (block.children ?? []).some((child) => (child.text ?? "").length > 0)

export const SectionPortableText = ({ value, variant, tone, className }: SectionPortableTextProps) => {
  const normalized = normalizeToPortableText(value)
  if (!normalized?.length) return null

  const headingClass =
    tone === "light"
      ? "font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-white md:text-[32px] lg:text-[36px]"
      : "font-host-grotesk text-2xl font-bold leading-tight tracking-tight text-black md:text-[32px] lg:text-[36px]"

  const subheadingClass =
    tone === "light"
      ? cn("font-urbanist font-medium leading-relaxed text-white/80", HEADING_SECTION_SUBTITLE)
      : cn("font-urbanist leading-relaxed text-black/65", HEADING_SECTION_SUBTITLE)

  return (
    <div className={className}>
      {normalized.map((block, index) => {
        if (block._type !== "block") return null
        const typedBlock = block as PtBlock
        if (!hasBlockText(typedBlock)) return null

        if (variant === "subheading") {
          return (
            <p key={typedBlock._key ?? index} className={cn(subheadingClass, index > 0 && "mt-3")}>
              {renderPtSpans(typedBlock.children, typedBlock.markDefs)}
            </p>
          )
        }

        const Tag = typedBlock.style === "h3" ? "h3" : "h2"
        return (
          <Tag key={typedBlock._key ?? index} className={headingClass}>
            {renderPtSpans(typedBlock.children, typedBlock.markDefs)}
          </Tag>
        )
      })}
    </div>
  )
}
