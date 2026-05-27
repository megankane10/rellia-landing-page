import type { SanityPortableText } from "../types"

let keyCounter = 0
const nextKey = () => `legal-${++keyCounter}`

const textBlock = (
  text: string,
  style: "normal" | "h2" | "h3" = "normal",
  listItem?: "bullet",
): SanityPortableText[number] => ({
  _type: "block",
  _key: nextKey(),
  style,
  ...(listItem ? { listItem, level: 1 } : {}),
  markDefs: [],
  children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
})

const paragraphBlocks = (text: string, style: "normal" | "h3" = "normal") =>
  text
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => textBlock(para, style))

export type LegalSectionSubsection = {
  subtitle: string
  body?: string
  bullets?: string[]
}

export type LegalSection = {
  title: string
  body?: string
  preamble?: string
  bullets?: string[]
  bulletGroups?: Array<{ label?: string; items: string[] }>
  closing?: string
  subsections?: LegalSectionSubsection[]
  contactInfo?: { intro: string; email: string }
}

export const legalSectionsToPortableText = (sections: LegalSection[]): SanityPortableText => {
  const blocks: SanityPortableText = []

  for (const section of sections) {
    blocks.push(textBlock(section.title, "h2"))

    if (section.preamble?.trim()) {
      blocks.push(...paragraphBlocks(section.preamble))
    }

    if (section.body?.trim()) {
      blocks.push(...paragraphBlocks(section.body))
    }

    if (section.bullets?.length) {
      for (const item of section.bullets) {
        blocks.push(textBlock(item, "normal", "bullet"))
      }
    }

    if (section.bulletGroups?.length) {
      for (const group of section.bulletGroups) {
        if (group.label?.trim()) {
          blocks.push(textBlock(group.label, "h3"))
        }
        for (const item of group.items) {
          blocks.push(textBlock(item, "normal", "bullet"))
        }
      }
    }

    if (section.subsections?.length) {
      for (const sub of section.subsections) {
        blocks.push(textBlock(sub.subtitle, "h3"))
        if (sub.body?.trim()) {
          blocks.push(...paragraphBlocks(sub.body))
        }
        if (sub.bullets?.length) {
          for (const item of sub.bullets) {
            blocks.push(textBlock(item, "normal", "bullet"))
          }
        }
      }
    }

    if (section.closing?.trim()) {
      blocks.push(...paragraphBlocks(section.closing))
    }

    if (section.contactInfo) {
      const { intro, email } = section.contactInfo
      blocks.push(
        textBlock(`${intro} ${email}`, "normal"),
      )
    }
  }

  return blocks
}
