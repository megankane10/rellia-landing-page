/** CMS row shape for sitemap eligibility (seo.noIndex from GROQ seoFragment). */
export type CmsSeoRow = {
  seo?: { noIndex?: boolean | null } | null
}

/** True when SEO indexing is allowed (noIndex is unset or explicitly false). */
export const isCmsSeoIndexable = (row: CmsSeoRow | null | undefined): boolean => {
  if (!row) return true
  return row.seo?.noIndex !== true
}

/** Custom CMS pages: live (or unset) visibility and indexable SEO. */
export const isCmsPageSitemapEligible = (row: Record<string, unknown>): boolean => {
  const visibility = row.pageVisibility
  if (visibility === "hidden") return false
  return isCmsSeoIndexable(row as CmsSeoRow)
}

export const rowSlug = (row: Record<string, unknown>): string => {
  const slug = row.slug
  return typeof slug === "string" ? slug.trim() : ""
}

export const rowId = (row: Record<string, unknown>): string => {
  const id = row.id
  return typeof id === "string" ? id.trim() : ""
}
