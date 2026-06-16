import { Helmet } from "react-helmet-async"
import {
  OG_IMAGE_LANDSCAPE,
  RELLIA_SOCIAL_THEME_COLOR,
  SOCIAL_EMBED_ICON_FALLBACK_SRC,
} from "@/config/seo"

export type PageSocialHelmetProps = {
  title: string
  description: string
  canonical: string
  ogImage?: string
  ogType?: "website" | "article"
  ogImageWidth?: number
  ogImageHeight?: number
}

/** Per-item Open Graph / Twitter tags. Use on detail pages; RouteSeo skips these paths. */
const PageSocialHelmet = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  ogImageWidth,
  ogImageHeight,
}: PageSocialHelmetProps) => {
  const includeImage = Boolean(ogImage?.trim())
  const resolvedDimensions = (() => {
    if (typeof ogImageWidth === "number" && typeof ogImageHeight === "number") {
      return { width: ogImageWidth, height: ogImageHeight }
    }
    if (!includeImage) return { width: undefined, height: undefined }
    if (ogImage?.includes(SOCIAL_EMBED_ICON_FALLBACK_SRC)) {
      return { width: 512, height: 512 }
    }
    return OG_IMAGE_LANDSCAPE
  })()
  const width = resolvedDimensions.width
  const height = resolvedDimensions.height
  const includeDimensions = typeof width === "number" && typeof height === "number"

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="theme-color" content={RELLIA_SOCIAL_THEME_COLOR} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="index, follow" />

      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Rellia Health" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {includeImage ? (
        <>
          <meta property="og:image" content={ogImage} />
          {includeDimensions ? (
            <>
              <meta property="og:image:width" content={String(width)} />
              <meta property="og:image:height" content={String(height)} />
            </>
          ) : null}
        </>
      ) : null}

      <meta
        name="twitter:card"
        content={includeImage ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {includeImage ? <meta name="twitter:image" content={ogImage} /> : null}
    </Helmet>
  )
}

export default PageSocialHelmet
