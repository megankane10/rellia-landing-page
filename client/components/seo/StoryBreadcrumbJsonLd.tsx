import { Helmet } from "react-helmet-async"
import { buildPageUrl, getSiteUrl } from "@/config/seo"

type StoryBreadcrumbJsonLdProps = {
  storyTitle: string
  storyUrl: string
}

const StoryBreadcrumbJsonLd = ({ storyTitle, storyUrl }: StoryBreadcrumbJsonLdProps) => {
  const homeUrl = getSiteUrl()
  const storiesUrl = buildPageUrl("/stories")

  const payload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Stories",
        item: storiesUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: storyTitle,
        item: storyUrl,
      },
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(payload)}</script>
    </Helmet>
  )
}

export default StoryBreadcrumbJsonLd
