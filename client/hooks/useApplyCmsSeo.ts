import { useEffect } from "react"
import { useOptionalPageSeo, type PageSeoOverrides } from "@/context/PageSeoContext"
import type { SeoContent } from "@shared/cms/types"

/**
 * Pulls a Sanity `seo` block (metaTitle/metaDescription/ogImageUrl/noIndex) into the
 * top-level RouteSeo via PageSeoContext. Pages call this after their CMS hook resolves.
 */
export const useApplyCmsSeo = (seo: SeoContent | null | undefined): void => {
  const { setPageSeo } = useOptionalPageSeo()

  useEffect(() => {
    if (!seo) {
      setPageSeo(null)
      return
    }
    const next: PageSeoOverrides = {}
    const metaTitle = seo.metaTitle?.trim()
    const ogTitle = seo.ogTitle?.trim()
    if (metaTitle || ogTitle) next.title = metaTitle || ogTitle
    const metaDescription = seo.metaDescription?.trim()
    const ogDescription = seo.ogDescription?.trim()
    if (metaDescription || ogDescription) next.description = metaDescription || ogDescription
    if (seo.ogImageUrl?.trim()) next.ogImage = seo.ogImageUrl.trim()
    if (typeof seo.noIndex === "boolean") next.noIndex = seo.noIndex
    setPageSeo(Object.keys(next).length > 0 ? next : null)
  }, [seo?.metaTitle, seo?.metaDescription, seo?.ogTitle, seo?.ogDescription, seo?.ogImageUrl, seo?.noIndex, setPageSeo])
}
