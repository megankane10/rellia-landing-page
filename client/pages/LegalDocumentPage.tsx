import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import PageHeader from "@/components/PageHeader"
import { PortableRichText } from "@/components/PortableRichText"
import { CmsLegalBodySkeleton } from "@/components/cms/CmsTextSkeleton"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { isCmsQueryLoading } from "@/lib/cmsQueryState"
import { isSanityConfigured } from "@/lib/sanity"
import type { LegalPageContent, SanityPortableText } from "@shared/cms/types"
import type { UseQueryResult } from "@tanstack/react-query"

type LegalDocumentPageProps = {
  headerTitle: string
  defaultIntro: string
  defaultEffectiveDate: string
  defaultLegalNotice?: string
  defaultBody: SanityPortableText
  query: UseQueryResult<LegalPageContent | null>
}

export const LegalDocumentPage = ({
  headerTitle,
  defaultIntro,
  defaultEffectiveDate,
  defaultLegalNotice,
  defaultBody,
  query,
}: LegalDocumentPageProps) => {
  const cmsConfigured = isSanityConfigured()
  const cmsLoading = cmsConfigured && isCmsQueryLoading(query)
  const page = query.data

  useApplyCmsSeo(page?.seo, {
    title: `${headerTitle} — Rellia Health`,
    description: defaultIntro,
  })

  const title = page?.title?.trim() || headerTitle
  const intro = page?.intro?.trim() || defaultIntro
  const effectiveDate = page?.effectiveDate?.trim() || defaultEffectiveDate
  const legalNotice = page?.legalNotice?.trim() || defaultLegalNotice
  const body =
    Array.isArray(page?.body) && page.body.length > 0 ? page.body : defaultBody

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <PageHeader variant="dark" title={title} subtitle={intro} />

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-[860px] px-6 md:px-10">
            <ScrollReveal>
              {cmsLoading ? (
                <CmsLegalBodySkeleton />
              ) : (
                <>
                  <p className="mb-10 font-urbanist text-lg font-medium leading-relaxed text-rellia-teal">
                    Effective {effectiveDate}
                  </p>
                  {legalNotice ? (
                    <p className="mb-10 font-urbanist text-lg italic leading-relaxed text-black/65 md:mb-12 md:text-xl">
                      {legalNotice}
                    </p>
                  ) : null}
                  <PortableRichText value={body} />
                </>
              )}
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
