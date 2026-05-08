import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { SanityPortableText } from "@shared/cms/types"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span className="inline">{children}</span>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-inherit">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    mint: ({ children }) => <span className="text-rellia-mint">{children}</span>,
    teal: ({ children }) => <span className="text-rellia-teal">{children}</span>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#"
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="text-inherit font-semibold underline-offset-2 hover:underline"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      )
    },
  },
}

type HeroHeadlinePortableProps = {
  value: SanityPortableText | string | null | undefined
  className?: string
}

export const HeroHeadlinePortable = ({ value, className }: HeroHeadlinePortableProps) => {
  const normalized = normalizeToPortableText(value)
  if (!normalized?.length) return null
  return (
    <span className={cn("inline", className)}>
      <PortableText value={normalized} components={components} />
    </span>
  )
}
