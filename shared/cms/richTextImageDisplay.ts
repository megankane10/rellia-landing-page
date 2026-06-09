export type RichTextImageDisplayMode = "full" | "cropped"

export const normalizeRichTextImageDisplayMode = (
  value: unknown,
): RichTextImageDisplayMode => (value === "full" ? "full" : "cropped")
