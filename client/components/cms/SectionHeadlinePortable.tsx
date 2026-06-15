import type { SanityPortableText } from "@shared/cms/types"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"
import { renderPtSpans, type PtBlock } from "@/lib/renderCmsPortableText"

type SectionHeadlinePortableProps = {
  value: SanityPortableText | string | null | undefined
  as?: "h2" | "h3"
  className?: string
}

export const SectionHeadlinePortable = ({
  value,
  as: Tag = "h2",
  className,
}: SectionHeadlinePortableProps) => {
  const normalized = normalizeToPortableText(value)
  if (!normalized?.length) return null

  return (
    <Tag className={className}>
      {normalized.map((block) => {
        if (block._type !== "block") return null
        const typedBlock = block as PtBlock
        return (
          <span key={typedBlock._key} className="inline">
            {renderPtSpans(typedBlock.children, typedBlock.markDefs)}
          </span>
        )
      })}
    </Tag>
  )
}
