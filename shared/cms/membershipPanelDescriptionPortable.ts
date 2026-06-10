import type { PaymentPageContent, SanityPortableText } from "./types"

const textShadowStyle = "0 2px 18px rgba(0, 0, 0, 0.65)"

export const membershipPanelDescriptionTextShadow = textShadowStyle

const makeSpan = (text: string, key: string) => ({
  _type: "span" as const,
  _key: `${key}s`,
  text,
  marks: [] as string[],
})

const makeParagraphBlock = (text: string, key: string) => ({
  _type: "block" as const,
  _key: key,
  style: "normal" as const,
  markDefs: [] as unknown[],
  children: [makeSpan(text, key)],
})

const makeBulletBlock = (text: string, key: string) => ({
  _type: "block" as const,
  _key: key,
  style: "normal" as const,
  listItem: "bullet" as const,
  level: 1,
  markDefs: [] as unknown[],
  children: [makeSpan(text, key)],
})

/** Converts legacy newline / "- " bullet text into portable text blocks. */
export const membershipPanelDescriptionStringToPortable = (
  raw: string | undefined | null,
): SanityPortableText => {
  const trimmed = raw?.trim() ?? ""
  if (!trimmed) return []

  const lines = trimmed.split("\n").map((line) => line.trim())
  const blocks: SanityPortableText = []
  let paragraphBuffer: string[] = []
  let blockIndex = 0

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return
    const key = `mp-p-${blockIndex++}`
    blocks.push(makeParagraphBlock(paragraphBuffer.join(" "), key))
    paragraphBuffer = []
  }

  for (const line of lines) {
    if (!line) {
      flushParagraph()
      continue
    }

    const bulletMatch = line.match(/^[-•*]\s+(.+)$/)
    if (bulletMatch) {
      flushParagraph()
      const key = `mp-li-${blockIndex++}`
      blocks.push(makeBulletBlock(bulletMatch[1].trim(), key))
      continue
    }

    paragraphBuffer.push(line)
  }

  flushParagraph()
  return blocks
}

const hasPortableContent = (value: SanityPortableText | undefined | null) =>
  Array.isArray(value) && value.length > 0

export const getPaymentPagePanelDescriptionText = (
  page: Pick<
    PaymentPageContent,
    | "benefitsPanelDescription"
    | "benefitsPanelBullet1"
    | "benefitsPanelBullet2"
    | "benefitsPanelBullet3"
    | "benefitsPanelBullet4"
    | "benefits"
  >,
): string => {
  const description = page.benefitsPanelDescription?.trim()
  if (description) return description

  const legacyBullets = [
    page.benefitsPanelBullet1,
    page.benefitsPanelBullet2,
    page.benefitsPanelBullet3,
    page.benefitsPanelBullet4,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))

  if (legacyBullets.length > 0) {
    return legacyBullets.map((bullet) => `- ${bullet}`).join("\n")
  }

  const fromBenefits = page.benefits
    .filter((benefit) => !benefit.toLowerCase().includes("cancel"))
    .slice(0, 4)

  if (fromBenefits.length > 0) {
    return fromBenefits.map((benefit) => `- ${benefit}`).join("\n")
  }

  return ""
}

export const resolveBenefitsPanelDescriptionPortable = (
  page: Pick<
    PaymentPageContent,
    | "benefitsPanelDescriptionPortable"
    | "benefitsPanelDescription"
    | "benefitsPanelBullet1"
    | "benefitsPanelBullet2"
    | "benefitsPanelBullet3"
    | "benefitsPanelBullet4"
    | "benefits"
  >,
  fallbackPortable: SanityPortableText,
): SanityPortableText => {
  if (hasPortableContent(page.benefitsPanelDescriptionPortable)) {
    return page.benefitsPanelDescriptionPortable ?? []
  }

  const legacyText = getPaymentPagePanelDescriptionText(page)
  if (legacyText) {
    return membershipPanelDescriptionStringToPortable(legacyText)
  }

  return fallbackPortable
}
