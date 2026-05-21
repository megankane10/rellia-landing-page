import { useEffect } from "react"
import { useOptionalPageSeo, type PageSeoOverrides } from "@/context/PageSeoContext"
import type { SeoContent } from "@shared/cms/types"

/** Merge CMS SEO fields with page-level defaults (CMS wins per field when set). */
export const mergePageSeo = (
  cmsSeo: SeoContent | null | undefined,
  defaults: PageSeoOverrides = {},
): PageSeoOverrides => {
  const metaTitle = cmsSeo?.metaTitle?.trim()
  const ogTitle = cmsSeo?.ogTitle?.trim()
  const metaDescription = cmsSeo?.metaDescription?.trim()
  const ogDescription = cmsSeo?.ogDescription?.trim()
  const ogImageUrl = cmsSeo?.ogImageUrl?.trim()

  const next: PageSeoOverrides = {}
  const title = metaTitle || ogTitle || defaults.title
  const description = metaDescription || ogDescription || defaults.description
  const ogImage = ogImageUrl || defaults.ogImage
  const noIndex =
    typeof cmsSeo?.noIndex === "boolean" ? cmsSeo.noIndex : defaults.noIndex

  if (title) next.title = title
  if (description) next.description = description
  if (ogImage) next.ogImage = ogImage
  if (typeof noIndex === "boolean") next.noIndex = noIndex
  return next
}

/**
 * Pulls a Sanity `seo` block into RouteSeo via PageSeoContext.
 * Pass `defaults` on directory/item pages so event/program title and image
 * stay correct while CMS data loads (avoids clearing overrides on fetch).
 */
export const useApplyCmsSeo = (
  seo: SeoContent | null | undefined,
  defaults?: PageSeoOverrides,
): void => {
  const { setPageSeo } = useOptionalPageSeo()

  useEffect(() => {
    if (!defaults && !seo) return
    const merged = mergePageSeo(seo, defaults ?? {})
    if (Object.keys(merged).length > 0) {
      setPageSeo(merged)
    }
  }, [
    seo?.metaTitle,
    seo?.metaDescription,
    seo?.ogTitle,
    seo?.ogDescription,
    seo?.ogImageUrl,
    seo?.noIndex,
    defaults?.title,
    defaults?.description,
    defaults?.ogImage,
    defaults?.noIndex,
    setPageSeo,
  ])
}
