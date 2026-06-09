import { useState } from "react"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { SanityPortableText } from "@shared/cms/types"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { cn } from "@/lib/utils"
import { BodyCtaBox } from "@/components/BodyCtaBox"
import { RichTextImageCarousel, type RichTextCarouselSlide } from "@/components/RichTextImageCarousel"
import { parseBlockquoteAttribution, RichTextQuoteFigure } from "@/components/RichTextQuoteFigure"
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
      <figure className="my-8 md:my-10 [&:first-child]:mt-0">
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
        {caption ? (
          <figcaption className="mt-3 font-urbanist text-sm text-black/55">{caption}</figcaption>
        ) : null}
      </figure>
      <ImageExpandModal open={open} onOpenChange={setOpen} src={src} alt={alt} />
    </>
  )
}

const resolveYoutubeEmbed = (url: string) => {
  const trimmed = url.trim()
  const short = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]+)/)
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`
  const watch = trimmed.match(/[?&]v=([A-Za-z0-9_-]+)/)
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`
  return null
}

const resolveVimeoEmbed = (url: string) => {
  const match = url.trim().match(/vimeo\.com\/(?:video\/)?(\d+)/)
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
    <figure className="my-8 md:my-10 [&:first-child]:mt-0">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/5 aspect-video">
        {youtube || vimeo ? (
          <iframe
            src={youtube ?? vimeo ?? ""}
            title={caption?.trim() || "Embedded video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={videoUrl}
            poster={posterUrl?.trim() || undefined}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {caption?.trim() ? (
        <figcaption className="mt-3 font-urbanist text-sm text-black/55">{caption.trim()}</figcaption>
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
      const src = (typeof v?.url === "string" ? v.url : v?.asset?.url)?.trim() ?? ""
      const alt = typeof v?.alt === "string" ? v.alt.trim() : ""
      const caption = typeof v?.caption === "string" ? v.caption.trim() : ""
      if (!src || !alt) return null
      return (
        <InlineImageFigure
          src={src}
          alt={alt}
          caption={caption || undefined}
          displayMode={normalizeRichTextImageDisplayMode(v?.displayMode)}
        />
      )
    },
    eventDetailInlineImage: ({ value }) => {
      const v = value as { imageSrc?: string; alt?: string; caption?: string; displayMode?: string } | null
      const src = typeof v?.imageSrc === "string" ? v.imageSrc.trim() : ""
      const alt = typeof v?.alt === "string" ? v.alt.trim() : ""
      const caption = typeof v?.caption === "string" ? v.caption.trim() : ""
      if (!src || !alt) return null
      return (
        <InlineImageFigure
          src={src}
          alt={alt}
          caption={caption || undefined}
          displayMode={normalizeRichTextImageDisplayMode(v?.displayMode)}
        />
      )
    },
    portableVideo: ({ value }) => {
      const v = value as { videoUrl?: string; posterUrl?: string; caption?: string } | null
      const videoUrl = typeof v?.videoUrl === "string" ? v.videoUrl.trim() : ""
      if (!videoUrl) return null
      return (
        <PortableVideoBlock
          videoUrl={videoUrl}
          posterUrl={typeof v?.posterUrl === "string" ? v.posterUrl : undefined}
          caption={typeof v?.caption === "string" ? v.caption : undefined}
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
        secondaryButtonLabel?: string
        secondaryButtonHref?: string
      } | null
      if (!v?.title?.trim()) return null
      return (
        <BodyCtaBox
          title={v.title.trim()}
          body={v.body}
          buttonLabel={(v.buttonLabel ?? "").trim() || "Learn more"}
          buttonHref={(v.buttonHref ?? "").trim() || "/"}
          secondaryButtonLabel={v.secondaryButtonLabel}
          secondaryButtonHref={v.secondaryButtonHref}
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
    blockquote: ({ children }) => {
      const { quote, attribution } = parseBlockquoteAttribution(children)
      return <RichTextQuoteFigure quote={quote} attribution={attribution} />
    },
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
