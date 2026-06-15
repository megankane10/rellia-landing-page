import type { CmsPageContent } from "./types"

export const mergeCmsPageContent = (
  raw: CmsPageContent | Record<string, unknown> | null | undefined,
): CmsPageContent | null => {
  if (!raw || typeof raw !== "object") return null
  return raw as CmsPageContent
}
