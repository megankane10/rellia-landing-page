import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { SanityPortableText } from "@shared/cms/types"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"
import { BodyCtaBox } from "@/components/BodyCtaBox"
import { RichTextImageCarousel, type RichTextCarouselSlide } from "@/components/RichTextImageCarousel"

const components: PortableTextComponents = {
  types: {
    portableImageCarousel: ({ value }) => {
      const v = value as {
        title?: string
        slides?: Array<{ imageSrc?: string; alt?: string; caption?: string }>
      } | null
      const slides: RichTextCarouselSlide[] = (v?.slides ?? [])
        .map((s) => ({
          imageSrc: typeof s?.imageSrc === "string" ? s.imageSrc.trim() : "",
          alt: typeof s?.alt === "string" ? s.alt.trim() : "",
          caption: typeof s?.caption === "string" ? s.caption.trim() : undefined,
        }))
        .filter((s) => s.imageSrc.length > 0 && s.alt.length > 0)
      if (slides.length === 0) return null
      return (
        <RichTextImageCarousel
          title={typeof v?.title === "string" ? v.title : undefined}
          slides={slides}
          className="my-8 md:my-10"
        />
      )
    },
    bodyCtaBox: ({ value }) => {
      const v = value as {
        title?: string
        body?: string
        buttonLabel?: string
        buttonHref?: string
      } | null
      if (!v?.title?.trim()) return null
      return (
        <BodyCtaBox
          title={v.title.trim()}
          body={v.body}
          buttonLabel={(v.buttonLabel ?? "").trim() || "Learn more"}
          buttonHref={(v.buttonHref ?? "").trim() || "/"}
        />
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-host-grotesk text-2xl md:text-3xl font-bold text-black mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-host-grotesk text-xl font-semibold text-rellia-teal mt-6 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <figure className="my-8 rounded-2xl bg-rellia-teal/5 px-6 py-6 md:my-10">
        <blockquote className="font-urbanist text-base italic leading-relaxed text-black/80 md:text-lg">
          {children}
        </blockquote>
      </figure>
    ),
    normal: ({ children }) => (
      <p className="font-urbanist text-black/70 text-base md:text-lg leading-relaxed mb-4">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-inherit">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    mint: ({ children }) => <span className="text-rellia-mint">{children}</span>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#"
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="text-rellia-teal font-semibold underline-offset-2 hover:underline"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4 font-urbanist text-black/70">{children}</ul>,
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 mb-4 font-urbanist text-black/70">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
}

type PortableRichTextProps = {
  value: SanityPortableText | string | null | undefined
  className?: string
}

export const PortableRichText = ({ value, className }: PortableRichTextProps) => {
  const normalized = normalizeToPortableText(value)
  if (!normalized) return null
  return (
    <div className={cn("prose prose-neutral max-w-none", className)}>
      <PortableText value={normalized} components={components} />
    </div>
  )
}
