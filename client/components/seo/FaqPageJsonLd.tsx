import { Helmet } from "react-helmet-async"
import { getSiteUrl } from "@/config/seo"

type FaqItem = {
  question: string
  answer: string
}

type FaqPageJsonLdProps = {
  items: FaqItem[]
}

const FaqPageJsonLd = ({ items }: FaqPageJsonLdProps) => {
  if (items.length === 0) return null

  const base = getSiteUrl()
  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url: `${base}/faq`,
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(payload)}</script>
    </Helmet>
  )
}

export default FaqPageJsonLd
