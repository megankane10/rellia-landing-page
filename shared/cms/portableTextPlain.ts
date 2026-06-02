/** Plain text from Sanity portable text blocks (inline hero, rich text, etc.). */
export const portableTextToPlainText = (blocks: unknown): string => {
  if (!blocks) return ""
  if (typeof blocks === "string") return blocks.trim()
  if (!Array.isArray(blocks)) return ""

  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return ""
      const children = (block as { children?: unknown }).children
      if (!Array.isArray(children)) return ""
      return children
        .map((child) => {
          if (!child || typeof child !== "object") return ""
          const text = (child as { text?: unknown }).text
          return typeof text === "string" ? text : ""
        })
        .join("")
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}
