import type { CmsPageContent } from "./types"

export const mergeCmsPageContent = (
  raw: CmsPageContent | Record<string, unknown> | null | undefined,
): CmsPageContent | null => {
  if (!raw || typeof raw !== "object") return null
  const page = raw as CmsPageContent
  const mergedSections = [
    ...(Array.isArray(page.sections) ? page.sections : []),
    ...(Array.isArray(page.pageBuilder) ? page.pageBuilder : []),
  ]
  return {
    ...page,
    sections: mergedSections.length > 0 ? mergedSections : page.sections,
  }
}
