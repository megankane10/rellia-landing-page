import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom"
import {
  clampMetaDescription,
  clampMetaTitle,
  getDefaultOgImageUrl,
  getDefaultOgImageAlt,
  getSeoForPathname,
  getSiteUrl,
  normalizePathname,
  shouldUseDefaultOgImage,
} from "@/config/seo"
import { useOptionalPageSeo } from "@/context/PageSeoContext"
import { useSiteSettings } from "@/hooks/useCmsDocuments"

interface RouteSeoProps {
  title?: string
  description?: string
  ogImage?: string
  noIndex?: boolean
}

const RouteSeo = ({
  title: titleOverride,
  description: descriptionOverride,
  ogImage: ogImageOverride,
  noIndex: noIndexOverride,
}: RouteSeoProps = {}) => {
  const { pathname } = useLocation()
  const { data: siteSettingsData } = useSiteSettings()
  const normalizedPathname = normalizePathname(pathname)
  const base = getSiteUrl()
  const {
    title: defaultTitle,
    description: defaultDescription,
    indexable,
  } = getSeoForPathname(normalizedPathname)

  const { overrides } = useOptionalPageSeo()

  const title = clampMetaTitle(titleOverride || overrides.title || defaultTitle)
  const description = clampMetaDescription(
    descriptionOverride || overrides.description || defaultDescription,
  )
  const ogImage = ogImageOverride || overrides.ogImage
  const noIndex = noIndexOverride ?? overrides.noIndex ?? !indexable

  const canonicalUrl = noIndex
    ? undefined
    : `${base}${normalizedPathname === "/" ? "" : normalizedPathname}`
  const ogUrl = `${base}${normalizedPathname === "/" ? "" : normalizedPathname}`
  const cmsDefaultOg = siteSettingsData?.defaultSeo?.ogImageUrl?.trim()
  const explicitOgImage = ogImage?.trim()
  const useHomeDefaultOg = shouldUseDefaultOgImage(normalizedPathname)
  const imageUrl =
    explicitOgImage ||
    (useHomeDefaultOg ? cmsDefaultOg || getDefaultOgImageUrl() : undefined)
  const imageAlt = getDefaultOgImageAlt()
  const includeOgImage = Boolean(imageUrl)

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Rellia Health" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {includeOgImage ? (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={imageAlt} />
        </>
      ) : null}

      <meta
        name="twitter:card"
        content={includeOgImage ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {includeOgImage ? <meta name="twitter:image" content={imageUrl} /> : null}
    </Helmet>
  )
}

export default RouteSeo
