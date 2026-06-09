export type ParsedMembershipPanelDescription = {
  paragraphs: string[]
  bullets: string[]
}

export const parseMembershipPanelDescription = (
  raw: string | undefined | null,
): ParsedMembershipPanelDescription => {
  const trimmed = raw?.trim() ?? ""
  if (!trimmed) return { paragraphs: [], bullets: [] }

  const lines = trimmed.split("\n").map((line) => line.trim())
  const paragraphs: string[] = []
  const bullets: string[] = []
  let paragraphBuffer: string[] = []

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return
    paragraphs.push(paragraphBuffer.join(" "))
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
      bullets.push(bulletMatch[1].trim())
      continue
    }

    paragraphBuffer.push(line)
  }

  flushParagraph()
  return { paragraphs, bullets }
}
