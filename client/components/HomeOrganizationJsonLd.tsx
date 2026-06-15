import { Helmet } from "react-helmet-async"
import { getSiteUrl, getRelliaPublisherLogoUrl } from "@/config/seo"

const HomeOrganizationJsonLd = () => {
  const base = getSiteUrl()
  const logoUrl = getRelliaPublisherLogoUrl()
  const socials = [
    "https://www.linkedin.com/company/relliahealth",
    "https://www.instagram.com/relliahealth/",
  ]

  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "Rellia Health",
        url: base,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        sameAs: socials,
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: "hello@relliahealth.com",
            contactType: "customer support",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: "Rellia Health",
        url: base,
        publisher: {
          "@id": `${base}/#organization`,
        },
      },
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(payload)}</script>
    </Helmet>
  )
}

export default HomeOrganizationJsonLd
