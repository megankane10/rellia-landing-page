import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom"
import {
  getDefaultOgImageUrl,
  getDefaultOgImageAlt,
  getSeoForPathname,
  getStoriesOgImageUrl,
  getSiteUrl,
  normalizePathname,
} from "@/config/seo"
import { useOptionalPageSeo } from "@/context/PageSeoContext"

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
  const normalizedPathname = normalizePathname(pathname)
  const base = getSiteUrl()
  const {
    title: defaultTitle,
    description: defaultDescription,
    indexable,
  } = getSeoForPathname(normalizedPathname)

  const { overrides } = useOptionalPageSeo()

  const title = titleOverride || overrides.title || defaultTitle
  const description = descriptionOverride || overrides.description || defaultDescription
  const ogImage = ogImageOverride || overrides.ogImage
  const noIndex = noIndexOverride ?? overrides.noIndex ?? !indexable

  const canonicalUrl = noIndex
    ? undefined
    : `${base}${normalizedPathname === "/" ? "" : normalizedPathname}`
  const ogUrl = `${base}${normalizedPathname === "/" ? "" : normalizedPathname}`
  const imageUrl =
    ogImage ||
    (normalizedPathname === "/stories" ? getStoriesOgImageUrl() : getDefaultOgImageUrl())
  const imageAlt = getDefaultOgImageAlt()

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
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}

export default RouteSeo
