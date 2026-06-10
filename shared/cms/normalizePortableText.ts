import type { SanityPortableText } from "@shared/cms/types"

const makeTextBlock = (
  key: string,
  text: string,
  options?: { listItem?: "bullet" | "number"; style?: string },
): SanityPortableText[number] => ({
  _type: "block",
  _key: key,
  style: options?.style ?? "normal",
  ...(options?.listItem ? { listItem: options.listItem, level: 1 } : {}),
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
})

/** Splits legacy plain-text job descriptions into paragraph and bullet blocks. */
export const plainStringToPortableTextBlocks = (value: string): SanityPortableText => {
  const trimmed = value.trim()
  if (!trimmed) return []

  const paragraphs = trimmed.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
  const blocks: SanityPortableText = []

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean)
    if (lines.length === 0) return

    const bulletLines = lines.filter((line) => /^[-•*]\s+/.test(line))
    const isBulletList = bulletLines.length === lines.length

    if (isBulletList) {
      bulletLines.forEach((line, lineIndex) => {
        blocks.push(
          makeTextBlock(`legacy-b-${paragraphIndex}-${lineIndex}`, line.replace(/^[-•*]\s+/, ""), {
            listItem: "bullet",
          }),
        )
      })
      return
    }

    blocks.push(makeTextBlock(`legacy-p-${paragraphIndex}`, lines.join(" ")))
  })

  return blocks
}

/** Converts legacy string headlines or valid portable text arrays into portable text blocks for `<PortableText />`. */
export const normalizeToPortableText = (value: unknown): SanityPortableText | null => {
  if (value == null) return null
  if (Array.isArray(value) && value.length > 0) return value as SanityPortableText
  if (typeof value === "string") {
    const t = value.trim()
    if (!t) return null
    if (t.includes("\n")) return plainStringToPortableTextBlocks(t)
    return [makeTextBlock("legacy-string", t)]
  }
  return null
}
