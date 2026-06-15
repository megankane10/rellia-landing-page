/** First inline image URL from portable text blocks (Sanity image or eventDetailInlineImage). */
export const extractFirstPortableTextImageUrl = (description: unknown): string | undefined => {
  if (!Array.isArray(description)) return undefined

  for (const block of description) {
    if (!block || typeof block !== "object") continue
    const typed = block as {
      _type?: string
      url?: string
      asset?: { url?: string }
      imageSrc?: string
    }

    if (typed._type === "image") {
      const url = (typeof typed.url === "string" ? typed.url : typed.asset?.url)?.trim()
      if (url) return url
    }

    if (typed._type === "eventDetailInlineImage") {
      const src = typed.imageSrc?.trim()
      if (src) return src
    }
  }

  return undefined
}
