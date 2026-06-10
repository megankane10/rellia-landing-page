export type PortableTextAnimatedWord = {
  text: string
  marks: string[]
}

/** Word tokens with decorator marks — for staggered headline animations. */
export const portableTextToAnimatedWords = (blocks: unknown): PortableTextAnimatedWord[] => {
  if (!blocks) return []
  if (typeof blocks === "string") {
    const trimmed = blocks.trim()
    if (!trimmed) return []
    return trimmed.split(/\s+/).filter(Boolean).map((text) => ({ text, marks: [] }))
  }
  if (!Array.isArray(blocks)) return []

  const words: PortableTextAnimatedWord[] = []
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue
    const children = (block as { children?: unknown }).children
    if (!Array.isArray(children)) continue
    for (const child of children) {
      if (!child || typeof child !== "object") continue
      const text = (child as { text?: unknown }).text
      const marks = (child as { marks?: unknown }).marks
      const markList = Array.isArray(marks)
        ? marks.filter((mark): mark is string => typeof mark === "string")
        : []
      if (typeof text !== "string" || !text.trim()) continue
      for (const word of text.trim().split(/\s+/).filter(Boolean)) {
        words.push({ text: word, marks: markList })
      }
    }
  }
  return words
}

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
