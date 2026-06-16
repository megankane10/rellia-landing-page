import type { CareersOpenRole } from "./types"
import { portableTextToPlainText } from "./portableTextPlain"

const CARD_EXCERPT_MAX = 180

export const resolveOpenRoleCardExcerpt = (
  role: Pick<CareersOpenRole, "excerpt" | "description">,
): string => {
  const excerpt = role.excerpt?.trim()
  if (excerpt) return excerpt

  const plain = portableTextToPlainText(role.description).replace(/\s+/g, " ").trim()
  if (!plain) return ""
  if (plain.length <= CARD_EXCERPT_MAX) return plain
  return `${plain.slice(0, CARD_EXCERPT_MAX - 1).trimEnd()}…`
}
