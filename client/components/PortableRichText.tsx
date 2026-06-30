import { useState } from "react"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { SanityPortableText } from "@shared/cms/types"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"
import { BodyCtaBox } from "@/components/BodyCtaBox"
import { mapPortableBodyCtaBox } from "@/lib/bodyCtaBoxPortable"
import { cmsCleanText, cmsDisplayText, cmsHasDisplayText } from "@/lib/cmsStega"
import { RichTextTable } from "@/components/RichTextTable"
import { RichTextImageCarousel, type RichTextCarouselSlide } from "@/components/RichTextImageCarousel"
import { parseBlockquoteAttribution, RichTextQuoteFigure } from "@/components/RichTextQuoteFigure"
import { resolvePortableQuoteBoxImage } from "@/lib/portableQuoteBox"
import ImageExpandModal from "@/components/ImageExpandModal"
import {
  normalizeRichTextImageDisplayMode,
  richTextCroppedFrameClassName,
  richTextInlineImageClassName,
  type RichTextImageDisplayMode,
} from "@/lib/richTextImageDisplay"

const InlineImageFigure = ({
  src,
  alt,
  caption,
  displayMode: displayModeProp,
}: {
  src: string
  alt: string
  caption?: string
  displayMode?: RichTextImageDisplayMode
}) => {
  const [open, setOpen] = useState(false)
  const displayMode = normalizeRichTextImageDisplayMode(displayModeProp)
  const isFull = displayMode === "full"

  return (
    <>
      <figure className="my-10 md:my-12 [&:first-child]:mt-0">
        <div
          className={cn(
            isFull ? undefined : richTextCroppedFrameClassName,
            !isFull && "rounded-2xl border border-black/10 shadow-sm",
          )}
        >
          <img
            src={src}
            alt={alt}
            onClick={() => setOpen(true)}
            className={richTextInlineImageClassName(displayMode)}
            loading="lazy"
            decoding="async"
          />
        </div>
        {cmsHasDisplayText(caption) ? (
          <figcaption className="mt-3 font-urbanist text-sm text-black/55">{cmsDisplayText(caption)}</figcaption>
        ) : null}
      </figure>
      <ImageExpandModal open={open} onOpenChange={setOpen} src={src} alt={alt} />
    </>
  )
}

const resolveYoutubeEmbed = (url: string) => {
  const trimmed = cmsCleanText(url)
  const short = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]+)/)
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`
  const watch = trimmed.match(/[?&]v=([A-Za-z0-9_-]+)/)
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`
  return null
}

const resolveVimeoEmbed = (url: string) => {
  const match = cmsCleanText(url).match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (match?.[1]) return `https://player.vimeo.com/video/${match[1]}`
  return null
}

const PortableVideoBlock = ({
  videoUrl,
  posterUrl,
  caption,
}: {
  videoUrl: string
  posterUrl?: string
  caption?: string
}) => {
  const youtube = resolveYoutubeEmbed(videoUrl)
  const vimeo = resolveVimeoEmbed(videoUrl)

  return (
    <figure className="my-10 md:my-12 [&:first-child]:mt-0">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/5 aspect-video">
        {youtube || vimeo ? (
          <iframe
            src={youtube ?? vimeo ?? ""}
            title={cmsDisplayText(caption) || "Embedded video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={videoUrl}
            poster={cmsCleanText(posterUrl) || undefined}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {cmsHasDisplayText(caption) ? (
        <figcaption className="mt-3 font-urbanist text-sm text-black/55">{cmsDisplayText(caption)}</figcaption>
      ) : null}
    </figure>
  )
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const v = value as {
        url?: string
        alt?: string
        caption?: string
        displayMode?: string
        asset?: { url?: string }
      } | null
      const src = cmsCleanText(typeof v?.url === "string" ? v.url : v?.asset?.url)
      const altRaw = typeof v?.alt === "string" ? v.alt : ""
      const captionRaw = typeof v?.caption === "string" ? v.caption : ""
      if (!src || !cmsHasDisplayText(altRaw)) return null
      return (
        <InlineImageFigure
          src={src}
          alt={cmsDisplayText(altRaw)}
          caption={cmsHasDisplayText(captionRaw) ? captionRaw : undefined}
          displayMode={normalizeRichTextImageDisplayMode(v?.displayMode)}
        />
      )
    },
    eventDetailInlineImage: ({ value }) => {
      const v = value as { imageSrc?: string; alt?: string; caption?: string; displayMode?: string } | null
      const src = cmsCleanText(v?.imageSrc)
      const altRaw = typeof v?.alt === "string" ? v.alt : ""
      const captionRaw = typeof v?.caption === "string" ? v.caption : ""
      if (!src || !cmsHasDisplayText(altRaw)) return null
      return (
        <InlineImageFigure
          src={src}
          alt={cmsDisplayText(altRaw)}
          caption={cmsHasDisplayText(captionRaw) ? captionRaw : undefined}
          displayMode={normalizeRichTextImageDisplayMode(v?.displayMode)}
        />
      )
    },
    portableVideo: ({ value }) => {
      const v = value as { videoUrl?: string; posterUrl?: string; caption?: string } | null
      const videoUrl = cmsCleanText(v?.videoUrl)
      if (!videoUrl) return null
      const captionRaw = typeof v?.caption === "string" ? v.caption : ""
      return (
        <PortableVideoBlock
          videoUrl={videoUrl}
          posterUrl={typeof v?.posterUrl === "string" ? v.posterUrl : undefined}
          caption={cmsHasDisplayText(captionRaw) ? captionRaw : undefined}
        />
      )
    },
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
          displayMode: normalizeRichTextImageDisplayMode(
            (s as { displayMode?: string }).displayMode,
          ),
        }))
        .filter((s) => s.imageSrc.length > 0 && s.alt.length > 0)
      if (slides.length === 0) return null
      return (
        <RichTextImageCarousel
          title={typeof v?.title === "string" ? v.title : undefined}
          slides={slides}
          className="my-10 md:my-12"
        />
      )
    },
    bodyCtaBox: ({ value }) => {
      const mapped = mapPortableBodyCtaBox(
        value as Parameters<typeof mapPortableBodyCtaBox>[0],
      )
      if (!mapped) return null
      return <BodyCtaBox {...mapped} />
    },
    portableQuoteBox: ({ value }) => {
      const v = value as Parameters<typeof resolvePortableQuoteBoxImage>[0] & { quote?: string; attribution?: string } | null
      if (!cmsHasDisplayText(v?.quote)) return null
      const attribution = cmsHasDisplayText(v?.attribution)
        ? cmsDisplayText(v?.attribution)
        : undefined
      const image = resolvePortableQuoteBoxImage(v)
      return (
        <RichTextQuoteFigure
          quote={cmsDisplayText(v!.quote)}
          attribution={attribution || null}
          imageSrc={image?.imageSrc}
          imageAlt={image?.imageAlt}
        />
      )
    },
    portableTable: ({ value }) => {
      const v = value as {
        caption?: string
        hasHeaderRow?: boolean
        highlightedColumn?: number
        highlightedRow?: number
        rows?: Array<{ cells?: string[] }>
      } | null
      return (
        <RichTextTable
          caption={typeof v?.caption === "string" ? v.caption : undefined}
          hasHeaderRow={v?.hasHeaderRow !== false}
          highlightedColumn={
            typeof v?.highlightedColumn === "number" ? v.highlightedColumn : undefined
          }
          highlightedRow={
            typeof v?.highlightedRow === "number" ? v.highlightedRow : undefined
          }
          rows={v?.rows}
        />
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-host-grotesk text-2xl font-bold leading-snug text-black first:mt-0 md:mt-12 md:text-[32px] lg:text-[36px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-host-grotesk text-xl font-semibold leading-snug text-rellia-teal first:mt-0 md:mt-10 md:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-7 font-host-grotesk text-lg font-semibold text-black first:mt-0 md:mt-8">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => {
      const { quote, attribution } = parseBlockquoteAttribution(children)
      return <RichTextQuoteFigure quote={quote} attribution={attribution} />
    },
    normal: ({ children }) => (
      <p className="font-urbanist text-base leading-relaxed text-black/75 md:text-lg md:leading-relaxed [&:not(:first-child)]:mt-5 [&:not(:first-child)]:md:mt-6">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-inherit">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
    mint: ({ children }) => <span className="text-rellia-mint">{children}</span>,
    teal: ({ children }) => <span className="text-rellia-teal">{children}</span>,
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
    bullet: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2.5 pl-6 font-urbanist text-base leading-relaxed text-black/75 md:mt-6 md:text-lg [&:not(:first-child)]:mt-5 [&:not(:first-child)]:md:mt-6">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2.5 pl-6 font-urbanist text-base leading-relaxed text-black/75 md:mt-6 md:text-lg [&:not(:first-child)]:mt-5 [&:not(:first-child)]:md:mt-6">
        {children}
      </ol>
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
    <div
      className={cn(
        "prose prose-neutral max-w-none",
        "[&_h2+_*]:mt-0 [&_h3+_*]:mt-0 [&_h4+_*]:mt-0",
        className,
      )}
    >
      <PortableText value={normalized} components={components} />
    </div>
  )
}
