import type { SanityPortableText } from "@shared/cms/types"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"
import { renderPtSpans, type PtBlock } from "@/lib/renderCmsPortableText"

type HeroHeadlinePortableProps = {
  value: SanityPortableText | string | null | undefined
  className?: string
}

export const HeroHeadlinePortable = ({ value, className }: HeroHeadlinePortableProps) => {
  const normalized = normalizeToPortableText(value)
  if (!normalized?.length) return null

  return (
    <span className={cn("inline", className)}>
      {normalized.map((block) => {
        if (block._type !== "block") return null
        const typedBlock = block as PtBlock
        return (
          <span key={typedBlock._key} className="inline">
            {renderPtSpans(typedBlock.children, typedBlock.markDefs)}
          </span>
        )
      })}
    </span>
  )
}
