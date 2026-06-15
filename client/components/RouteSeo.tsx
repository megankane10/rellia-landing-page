import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom"
import {
  clampMetaDescription,
  clampMetaTitle,
  getAdminOgImageUrl,
  getDefaultOgImageUrl,
  getDefaultOgImageAlt,
  RELLIA_SOCIAL_THEME_COLOR,
  getStaticOgImageForPathname,
  getSeoForPathname,
  getSiteUrl,
  isAdminAreaPath,
  isItemDetailPath,
  allowsRouteSeoOgImage,
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

  const { overrides } = useOptionalPageSeo()

  // Item detail pages set Helmet in-page; RouteSeo after children would overwrite them.
  if (isItemDetailPath(normalizedPathname)) return null
  const {
    title: defaultTitle,
    description: defaultDescription,
    indexable,
  } = getSeoForPathname(normalizedPathname)

  const title = clampMetaTitle(titleOverride || overrides.title || defaultTitle)
  const description = clampMetaDescription(
    descriptionOverride || overrides.description || defaultDescription,
  )
  const noIndex = noIndexOverride ?? overrides.noIndex ?? !indexable

  const canonicalUrl = noIndex
    ? undefined
    : `${base}${normalizedPathname === "/" ? "" : normalizedPathname}`
  const ogUrl = `${base}${normalizedPathname === "/" ? "" : normalizedPathname}`
  const cmsDefaultOg = siteSettingsData?.defaultSeo?.ogImageUrl?.trim()
  const allowOgImage = allowsRouteSeoOgImage(normalizedPathname)
  const explicitOgImage = allowOgImage
    ? (ogImageOverride || overrides.ogImage)?.trim()
    : undefined
  const staticOg = getStaticOgImageForPathname(normalizedPathname)
  const adminOg = isAdminAreaPath(normalizedPathname) ? getAdminOgImageUrl() : undefined
  const useHomeDefaultOg = shouldUseDefaultOgImage(normalizedPathname)
  const imageUrl =
    explicitOgImage ||
    staticOg ||
    adminOg ||
    (useHomeDefaultOg ? cmsDefaultOg || getDefaultOgImageUrl() : undefined)
  const imageAlt = getDefaultOgImageAlt()
  const includeOgImage = Boolean(imageUrl)

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="theme-color" content={RELLIA_SOCIAL_THEME_COLOR} />
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
