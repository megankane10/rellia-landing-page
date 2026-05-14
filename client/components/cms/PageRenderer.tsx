import type { CmsPageSection } from "@shared/cms/types"

/**
 * Minimal stub — only `SectionsRenderer` is used by ProgramPageLayout.
 * Full implementation lives on the Additions branch.
 */
export const SectionsRenderer = ({ sections }: { sections: CmsPageSection[] }) => {
  if (!sections || sections.length === 0) return null
  // For main branch, we don't render extra CMS sections on programs yet to keep dependencies minimal
  return null
}

export const PageRenderer = ({ page }: { page: { sections?: CmsPageSection[] } }) => {
  return <SectionsRenderer sections={page.sections ?? []} />
}
