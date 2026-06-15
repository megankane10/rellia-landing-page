import { Helmet } from "react-helmet-async"
import { getSiteUrl, getRelliaPublisherLogoUrl } from "@/config/seo"

type StoryArticleJsonLdProps = {
  headline: string
  description: string
  url: string
  imageUrl?: string
  datePublished?: string
}

const StoryArticleJsonLd = ({
  headline,
  description,
  url,
  imageUrl,
  datePublished,
}: StoryArticleJsonLdProps) => {
  const base = getSiteUrl()
  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: "Rellia Health",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: getRelliaPublisherLogoUrl(),
      },
    },
  }
  if (imageUrl) payload.image = imageUrl
  if (datePublished) payload.datePublished = datePublished

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(payload)}</script>
    </Helmet>
  )
}

export default StoryArticleJsonLd
