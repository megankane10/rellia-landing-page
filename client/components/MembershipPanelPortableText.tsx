import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { SanityPortableText } from "@shared/cms/types"
import { membershipPanelDescriptionTextShadow } from "@shared/cms/membershipPanelDescriptionPortable"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"

const bodyClass =
  "font-urbanist text-[15px] font-normal leading-relaxed text-white md:text-base"

const bodyStyle = { textShadow: membershipPanelDescriptionTextShadow }

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className={cn(bodyClass, "mb-0 [&:not(:first-child)]:mt-5")} style={bodyStyle}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className={cn(bodyClass, "font-semibold [&:not(:first-child)]:mt-5")}
        style={bodyStyle}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={cn(bodyClass, "font-semibold [&:not(:first-child)]:mt-5")}
        style={bodyStyle}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className={cn(bodyClass, "font-semibold [&:not(:first-child)]:mt-5")}
        style={bodyStyle}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={cn(bodyClass, "border-l-2 border-rellia-mint/80 pl-4 [&:not(:first-child)]:mt-5")}
        style={bodyStyle}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-white">{children}</em>,
    underline: ({ children }) => <span className="underline text-white">{children}</span>,
    mint: ({ children }) => <span className="text-rellia-mint">{children}</span>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#"
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="font-semibold text-white underline underline-offset-2 hover:text-rellia-mint"
          style={bodyStyle}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul
        className={cn(
          bodyClass,
          "list-disc space-y-3 pl-5 text-white [&:not(:first-child)]:mt-5",
        )}
        style={bodyStyle}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        className={cn(
          bodyClass,
          "list-decimal space-y-3 pl-5 text-white [&:not(:first-child)]:mt-5",
        )}
        style={bodyStyle}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-white">{children}</li>,
    number: ({ children }) => <li className="text-white">{children}</li>,
  },
}

type MembershipPanelPortableTextProps = {
  value: SanityPortableText | null | undefined
  className?: string
}

export const MembershipPanelPortableText = ({
  value,
  className,
}: MembershipPanelPortableTextProps) => {
  const normalized = normalizeToPortableText(value)
  if (!normalized?.length) return null

  return (
    <div className={cn("mt-6 md:mt-8", className)}>
      <PortableText value={normalized} components={components} />
    </div>
  )
}
