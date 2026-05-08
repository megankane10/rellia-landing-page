import type { SanityPortableText } from "@shared/cms/types"

/** Converts legacy string headlines or valid portable text arrays into portable text blocks for `<PortableText />`. */
export const normalizeToPortableText = (value: unknown): SanityPortableText | null => {
  if (value == null) return null
  if (Array.isArray(value) && value.length > 0) return value as SanityPortableText
  if (typeof value === "string") {
    const t = value.trim()
    if (!t) return null
    return [
      {
        _type: "block",
        _key: "legacy-string",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: "legacy-span", text: t, marks: [] }],
      },
    ]
  }
  return null
}
