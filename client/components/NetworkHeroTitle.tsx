import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { resolveHeroTitlePortable, type LegacyHeroHeadlineFields } from "@shared/cms/resolveHeroHeadline"
import type { SanityPortableText } from "@shared/cms/types"

type NetworkHeroTitleProps = {
  content: LegacyHeroHeadlineFields | null | undefined
  fallback: SanityPortableText
  className?: string
}

/** Renders a network/marketing hero headline with mint accent from portable text or legacy fields. */
export const NetworkHeroTitle = ({ content, fallback, className }: NetworkHeroTitleProps) => (
  <HeroHeadlinePortable
    className={className}
    value={resolveHeroTitlePortable(content, fallback)}
  />
)
