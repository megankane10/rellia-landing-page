import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom"
import {
  getDefaultOgImageUrl,
  getDefaultOgImageAlt,
  getSeoForPathname,
  getStoriesOgImageUrl,
  getSiteUrl,
} from "@/config/seo"

const RouteSeo = () => {
  const { pathname } = useLocation()
  const base = getSiteUrl()
  const { title, description, indexable } = getSeoForPathname(pathname)
  const canonicalUrl = indexable ? `${base}${pathname === "/" ? "" : pathname}` : undefined
  const ogUrl = `${base}${pathname === "/" ? "" : pathname}`
  const imageUrl = pathname === "/stories" ? getStoriesOgImageUrl() : getDefaultOgImageUrl()
  const imageAlt = getDefaultOgImageAlt()

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {indexable ? (
        <meta name="robots" content="index, follow" />
      ) : (
        <meta name="robots" content="noindex, nofollow" />
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
