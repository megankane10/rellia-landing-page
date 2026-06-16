import { CalendarDays } from "lucide-react"
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

const LegalEffectiveDate = ({ date }: { date: string }) => (
  <div className="mb-6 border-b border-black/10 pb-6 md:mb-8 md:pb-8">
    <div
      className="flex w-fit items-center gap-4 md:gap-4"
      role="note"
      aria-label={`Effective date ${date}`}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rellia-teal/15 bg-rellia-mint/20 text-rellia-teal md:h-12 md:w-12"
        aria-hidden
      >
        <CalendarDays className="h-5 w-5 md:h-[22px] md:w-[22px]" aria-hidden strokeWidth={2.25} />
      </span>
      <p className="font-urbanist text-lg leading-snug text-black md:text-xl">
        <span>Effective date</span>{" "}
        <span className="font-bold text-rellia-teal">{date}</span>
      </p>
    </div>
  </div>
)

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

        <section className="bg-white px-6 pt-8 pb-16 md:px-10 md:pt-10 md:pb-24">
          <div className="mx-auto max-w-[900px]">
            {effectiveDate ? (
              <ScrollReveal>
                <LegalEffectiveDate date={effectiveDate} />
              </ScrollReveal>
            ) : null}
            <ScrollReveal>
              {cmsLoading && !page ? (
                <CmsLegalBodySkeleton />
              ) : (
                <>
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
