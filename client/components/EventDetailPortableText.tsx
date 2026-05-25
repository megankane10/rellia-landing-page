import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { SanityPortableText } from "@shared/cms/types"
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
          className="mt-8 md:mt-10 [&:first-child]:mt-0"
        />
      )
    },
    eventDetailInlineImage: ({ value }) => {
      const v = value as { imageSrc?: string; alt?: string; caption?: string } | null
      const src = typeof v?.imageSrc === "string" ? v.imageSrc.trim() : ""
      const alt = typeof v?.alt === "string" ? v.alt.trim() : ""
      const caption = typeof v?.caption === "string" ? v.caption.trim() : ""
      if (!src || !alt) return null
      return (
        <figure className="mt-8 md:mt-10 [&:first-child]:mt-0">
          <img
            src={src}
            alt={alt}
            className="h-auto w-full max-w-full rounded-2xl border border-black/10 object-cover shadow-sm"
            loading="lazy"
            decoding="async"
          />
          {caption ? (
            <figcaption className="mt-3 font-urbanist text-sm leading-snug text-black/55 md:text-[15px]">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
    eventDetailDivider: () => (
      <hr className="mt-8 border-0 border-t border-black/15 md:mt-10" />
    ),
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
      <h2 className="mt-8 font-host-grotesk text-2xl font-bold leading-snug text-black first:mt-0 md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-host-grotesk text-xl font-semibold leading-snug text-rellia-teal first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => {
      let quoteText: React.ReactNode = children
      let attributionText: string | null = null

      const getRawText = (node: React.ReactNode): string => {
        if (!node) return ""
        if (typeof node === "string") return node
        if (typeof node === "number") return String(node)
        if (Array.isArray(node)) return node.map(getRawText).join("")
        if (typeof node === "object" && node && "props" in node && (node as any).props?.children) {
          return getRawText((node as any).props.children)
        }
        return ""
      }

      const fullText = getRawText(children)
      
      let separator = ""
      if (fullText.includes("\n")) {
        separator = "\n"
      } else if (fullText.includes(" — ")) {
        separator = " — "
      } else if (fullText.includes(" —")) {
        separator = " —"
      } else if (fullText.includes("— ")) {
        separator = "— "
      } else if (fullText.includes("—")) {
        separator = "—"
      } else if (fullText.toLowerCase().includes("torontotechweek.com")) {
        const idx = fullText.toLowerCase().indexOf("torontotechweek.com")
        quoteText = fullText.slice(0, idx).trim()
        attributionText = fullText.slice(idx).trim()
      }

      if (separator) {
        const parts = fullText.split(separator)
        quoteText = parts[0].trim()
        attributionText = parts.slice(1).join(separator).trim()
      }

      return (
        <figure className="relative my-10 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-rellia-teal to-[#144853] px-6 py-8 md:px-8 md:py-10">
          <div
            className="pointer-events-none absolute top-[-20%] right-[-10%] h-40 w-40 rounded-full bg-rellia-mint/20 blur-[80px]"
            aria-hidden
          />
          <blockquote className="relative font-urbanist text-2xl md:text-3xl font-semibold leading-snug text-rellia-mint">
            {quoteText}
          </blockquote>
          {attributionText ? (
            <figcaption className="relative mt-4 font-host-grotesk text-sm font-medium tracking-wide text-white/80">
              {attributionText.toLowerCase().includes("torontotechweek") ? (
                <a href="https://torontotechweek.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-white">
                  {attributionText}
                </a>
              ) : (
                <>— {attributionText}</>
              )}
            </figcaption>
          ) : null}
        </figure>
      )
    },
    normal: ({ children }) => (
      <p className="font-urbanist text-base leading-relaxed text-black/85 md:text-[17px] md:leading-relaxed [&:not(:first-child)]:mt-5 [&:not(:first-child)]:md:mt-6">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#"
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="font-semibold text-rellia-teal underline-offset-2 hover:underline"
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
      <ul className="mt-4 list-disc space-y-2 pl-6 font-urbanist text-base leading-relaxed text-black/85 md:text-[17px] [&:not(:first-child)]:mt-5">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6 font-urbanist text-base leading-relaxed text-black/85 md:text-[17px] [&:not(:first-child)]:mt-5">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
}

type EventDetailPortableTextProps = {
  value: SanityPortableText | null | undefined
  className?: string
}

export const EventDetailPortableText = ({ value, className }: EventDetailPortableTextProps) => {
  if (!value || value.length === 0) return null
  return (
    <div className={cn("w-full [&_:first-child]:mt-0", className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
