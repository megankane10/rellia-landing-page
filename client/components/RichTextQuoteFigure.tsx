import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

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
  className?: string
}

export const RichTextQuoteFigure = ({ quote, attribution, className }: RichTextQuoteFigureProps) => {
  const attributionTrimmed = attribution?.trim() || null

  return (
    <figure
      className={cn(
        "relative my-10 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0d3540] via-[#104856] to-[#196b7f] border border-white/10 px-6 py-8 md:px-8 md:py-10",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[45%] bg-gradient-to-l from-rellia-teal via-rellia-teal/90 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 top-[-15%] h-44 w-44 rounded-full bg-rellia-mint/20 blur-[72px]"
        aria-hidden
      />
      <blockquote className="relative font-urbanist text-xl font-normal leading-snug text-white md:text-2xl">
        {quote}
      </blockquote>
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
            <>— {attributionTrimmed}</>
          )}
        </figcaption>
      ) : null}
    </figure>
  )
}
