import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  RichTextTealPanel,
  richTextTealPanelImageClassName,
  richTextTealPanelPaddingClassName,
  richTextTealPanelQuoteClassName,
} from "@/components/RichTextTealPanel"

export const parseBlockquoteAttribution = (
  children: ReactNode,
): { quote: ReactNode; attribution: string | null } => {
  let quoteText: ReactNode = children
  let attributionText: string | null = null

  const getRawText = (node: ReactNode): string => {
    if (!node) return ""
    if (typeof node === "string") return node
    if (typeof node === "number") return String(node)
    if (Array.isArray(node)) return node.map(getRawText).join("")
    if (typeof node === "object" && node && "props" in node && (node as { props?: { children?: ReactNode } }).props?.children) {
      return getRawText((node as { props: { children: ReactNode } }).props.children)
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

  return { quote: quoteText, attribution: attributionText }
}

export type RichTextQuoteFigureProps = {
  quote: ReactNode
  attribution?: string | null
  imageSrc?: string | null
  imageAlt?: string | null
  className?: string
}

export const RichTextQuoteFigure = ({
  quote,
  attribution,
  imageSrc,
  imageAlt,
  className,
}: RichTextQuoteFigureProps) => {
  const attributionTrimmed = attribution?.trim() || null
  const imageUrl = typeof imageSrc === "string" ? imageSrc.trim() : ""
  const hasImage = Boolean(imageUrl)

  return (
    <RichTextTealPanel
      as="figure"
      decoration={hasImage ? "withSideImage" : "default"}
      className={cn("my-10", richTextTealPanelPaddingClassName, className)}
    >
      <div
        className={cn(
          "relative z-10 flex flex-col gap-6",
          hasImage && "lg:flex-row lg:items-start lg:gap-8",
        )}
      >
        {hasImage ? (
          <div className="shrink-0 lg:w-[min(42%,240px)] xl:w-[min(38%,280px)]">
            <div className="aspect-[4/3] overflow-hidden lg:min-h-[180px]">
              <img
                src={imageUrl}
                alt={imageAlt?.trim() || ""}
                loading="lazy"
                decoding="async"
                className={richTextTealPanelImageClassName}
              />
            </div>
          </div>
        ) : null}

        <div className="relative min-w-0 flex-1">
          <blockquote className={richTextTealPanelQuoteClassName}>{quote}</blockquote>
          {attributionTrimmed ? (
            <figcaption className="relative mt-5 font-host-grotesk text-xs font-semibold uppercase tracking-[0.15em] text-rellia-mint md:text-sm">
              {attributionTrimmed.toLowerCase().includes("torontotechweek") ? (
                <a
                  href="https://torontotechweek.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {attributionTrimmed}
                </a>
              ) : (
                attributionTrimmed
              )}
            </figcaption>
          ) : null}
        </div>
      </div>
    </RichTextTealPanel>
  )
}
