import type { SanityPortableText } from "./types"

/** Single-line / short heading portable text: use **Mint** or **Teal** decorators for colored spans. */
export const inlineHeroBlock = (
  parts: Array<{ text: string; marks?: string[] }>,
  key: string,
): SanityPortableText[number] => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: parts.map((p, i) => ({
    _type: "span",
    _key: `${key}-s${i}`,
    text: p.text,
    marks: p.marks ?? [],
  })),
})

export const twoPartHeroHeadline = (
  lead: string,
  accent: string,
  accentMark: "mint" | "teal" = "mint",
): SanityPortableText => {
  const accentTrim = accent.trim()
  const parts: Array<{ text: string; marks?: string[] }> = [{ text: lead }]
  if (accentTrim) {
    parts.push({ text: accentTrim.startsWith(" ") ? accentTrim : ` ${accentTrim}`, marks: [accentMark] })
  }
  return [inlineHeroBlock(parts, "two-part")]
}

export const fullMintLineHeroHeadline = (line: string): SanityPortableText => [
  inlineHeroBlock([{ text: line, marks: ["mint"] }], "mint-line"),
]

export const threePartHeroHeadline = (
  prefix: string,
  accent: string,
  suffix: string,
): SanityPortableText => {
  const a = accent.trim()
  const parts: Array<{ text: string; marks?: string[] }> = [{ text: prefix }]
  if (a) parts.push({ text: ` ${a}`, marks: ["mint"] })
  parts.push({ text: suffix })
  return [inlineHeroBlock(parts, "three-part")]
}

export const twoPartImageCardHeadline = (prefix: string, accent: string): SanityPortableText => {
  const a = accent.trim()
  const parts: Array<{ text: string; marks?: string[] }> = [{ text: prefix }]
  if (a) parts.push({ text: ` ${a}`, marks: ["mint"] })
  return [inlineHeroBlock(parts, "image-card")]
}

export const DEFAULT_STORIES_PAGE_HEADLINE_PORTABLE: SanityPortableText = twoPartHeroHeadline(
  "Rellia",
  "Stories",
  "mint",
)

export const DEFAULT_EVENTS_LANDING_HERO_PORTABLE: SanityPortableText = twoPartHeroHeadline(
  "Connect &",
  "Learn",
  "mint",
)

export const DEFAULT_PROGRAMS_LANDING_HERO_PORTABLE: SanityPortableText = twoPartHeroHeadline(
  "Less theory.",
  "More progress.",
  "mint",
)

export const DEFAULT_HOME_TESTIMONIALS_TITLE_PORTABLE: SanityPortableText = twoPartHeroHeadline(
  "Trusted by the next generation of",
  "healthcare leaders",
  "teal",
)

export const DEFAULT_HOME_METRICS_HEADLINE_PORTABLE: SanityPortableText = threePartHeroHeadline(
  "The right people make",
  "all the difference",
  ".",
)

export const DEFAULT_ABOUT_HERO_LINE2_PORTABLE: SanityPortableText = fullMintLineHeroHeadline("next generation")

