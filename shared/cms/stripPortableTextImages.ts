/** Remove inline image blocks from portable text (open role descriptions are text-only on site). */
export const stripPortableTextImages = <T>(blocks: T): T => {
  if (!Array.isArray(blocks)) return blocks

  return blocks.filter((block) => {
    if (!block || typeof block !== "object") return false
    const type = (block as { _type?: string })._type
    return type !== "image" && type !== "eventDetailInlineImage"
  }) as T
}
