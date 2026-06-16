import { ShieldCheck, Zap, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RouteSeo from '@/components/RouteSeo'
import DiagnosticReportPreview from '@/components/DiagnosticReportPreview'
import { CmsModularSingletonPage } from '@/components/cms/CmsModularSingletonPage'
import { useDiagnosticLandingPage } from '@/hooks/useCmsDocuments'
import { useApplyCmsSeo } from '@/hooks/useApplyCmsSeo'
import { deriveHeroPageSeo } from '@/lib/cmsPageSeoDefaults'
import { RoleHero } from "./network/_shared"
import PillTag, { PILL_ON_IMAGE_BLUR_CLASS } from "@/components/PillTag"
import type { DiagnosticLandingPageContent, HomeWhyFeature } from "@shared/cms/types"
import WhyRellia from '@/components/WhyRellia'
import MembershipPathTimeline from '@/components/MembershipPathTimeline'
import RelliaCta from '@/components/RelliaCta'
import { SectionsRenderer } from '@/components/cms/PageRenderer'
import { DEFAULT_DIAGNOSTIC_LANDING_PAGE } from '@shared/cms/defaults'
import { NetworkHeroTitle } from "@/components/NetworkHeroTitle"
import { cmsDisplayText } from "@/lib/cmsStega"

const HERO_TRUST_BADGES = [
  { label: "100% Private", icon: ShieldCheck },
  { label: "~15 Minutes", icon: Zap },
  { label: "Advisor Matching", icon: Users },
] as const

const DiagnosticHeroBadges = ({ label }: { label: string }) => (
  <div className="flex flex-wrap items-center gap-3">
    <PillTag label={cmsDisplayText(label)} className={PILL_ON_IMAGE_BLUR_CLASS} />
  </div>
)

const toWhyFeatures = (content: DiagnosticLandingPageContent): HomeWhyFeature[] =>
  (content.readinessFeatures ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.readinessFeatures ?? []).map((f) => ({
    iconKey: "",
    title: f.title,
    description: f.description,
    imageSrc: f.imageSrc,
    buttonLabel: f.buttonLabel,
    buttonPath: f.buttonPath,
  }))

function DiagnosticFallback({ content }: { content: DiagnosticLandingPageContent }) {
  const whyFeatures = toWhyFeatures(content)

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk text-black selection:bg-rellia-mint/30">
      <Navbar />
      <RouteSeo
        title="Startup Diagnostic — Rellia Health"
        description="Benchmark your health tech startup across 12 critical domains. Get an instant readiness score, personalized gap analysis, and advisory board matching."
      />

      <div className="lg:flex lg:h-[82vh] lg:flex-col">
        <RoleHero
          heroBadges={
            <DiagnosticHeroBadges
              label={cmsDisplayText(content.heroBadgeLabel ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.heroBadgeLabel!)}
            />
          }
          imageSrc={content.heroImageSrc ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.heroImageSrc}
          className="lg:flex-1"
          title={
            <NetworkHeroTitle
              content={content}
              fallback={DEFAULT_DIAGNOSTIC_LANDING_PAGE.heroTitlePortable!}
            />
          }
          subtitle={cmsDisplayText(content.heroSubtitle ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.heroSubtitle)}
          primaryCta={{
            label: cmsDisplayText(content.heroPrimaryCtaLabel ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.heroPrimaryCtaLabel!),
            to: content.heroPrimaryCtaHref ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.heroPrimaryCtaHref!,
          }}
        />
      </div>

      <WhyRellia
        sectionTitle={cmsDisplayText(content.readinessTitle ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.readinessTitle!)}
        sectionDescription={cmsDisplayText(
          content.readinessDescription ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.readinessDescription,
        )}
        features={whyFeatures}
      />

      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-[2rem] border border-black/5 bg-[#fbfcf8] px-6 py-14 md:rounded-[2.5rem] md:px-10 md:py-20 lg:px-14">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row lg:items-start">
            <div className="flex-1">
              <h2 className="mb-6 font-host-grotesk text-2xl font-semibold leading-tight text-black md:text-[32px] lg:text-[36px]">
                {cmsDisplayText(content.infographicTitle ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicTitle)}
              </h2>
              <p className="max-w-xl font-urbanist text-lg leading-relaxed text-black/60">
                {cmsDisplayText(content.infographicBody ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicBody)}
              </p>
            </div>
            <div className="flex-1 w-full min-w-0 px-1 sm:px-0 lg:pl-12">
              <DiagnosticReportPreview
                topWeaknessLabel={
                  content.infographicTopWeaknessLabel ??
                  DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicTopWeaknessLabel
                }
                topWeaknessScore={
                  content.infographicTopWeaknessScore ??
                  DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicTopWeaknessScore
                }
                topWeaknessGapLabel={
                  content.infographicGapLabel ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicGapLabel
                }
                advisorMatchLabel={
                  content.infographicAdvisorMatchLabel ??
                  DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicAdvisorMatchLabel
                }
                advisorRole={
                  content.infographicAdvisorRole ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicAdvisorRole
                }
                advisorSubtitle={
                  content.infographicAdvisorSubtitle ??
                  DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicAdvisorSubtitle
                }
                blobRoadmap={
                  content.infographicBlobRoadmap ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicBlobRoadmap
                }
                blobAdvisors={
                  content.infographicBlobAdvisors ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicBlobAdvisors
                }
                blobBlindSpot={
                  content.infographicBlobBlindSpot ??
                  DEFAULT_DIAGNOSTIC_LANDING_PAGE.infographicBlobBlindSpot
                }
              />
            </div>
          </div>
        </div>
      </section>

      <MembershipPathTimeline
        headingTitle={cmsDisplayText(content.timelineTitle ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.timelineTitle!)}
        subheading={cmsDisplayText(content.timelineSubheading ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.timelineSubheading)}
        steps={content.timelineSteps ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.timelineSteps}
        showRoleLinks={false}
        className="border-t-0 bg-white py-10 pb-28 md:py-12 md:pb-36 lg:py-14"
      />

      {content.sections?.length ? <SectionsRenderer sections={content.sections} /> : null}

      <div className="bg-white">
        <RelliaCta
          aboveSectionTone="white"
          title={cmsDisplayText(content.ctaTitle ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.ctaTitle!)}
          body={cmsDisplayText(content.ctaBody ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.ctaBody)}
          primary={{
            label: cmsDisplayText(content.ctaPrimaryLabel ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.ctaPrimaryLabel!),
            to: content.ctaPrimaryHref ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.ctaPrimaryHref!,
          }}
          secondary={{
            label: cmsDisplayText(content.ctaSecondaryLabel ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.ctaSecondaryLabel!),
            to: content.ctaSecondaryHref ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE.ctaSecondaryHref!,
          }}
        />
      </div>

      <Footer />
    </div>
  )
}

export default function DiagnosticLanding() {
  const { data: cmsPage } = useDiagnosticLandingPage()
  const content = cmsPage ?? DEFAULT_DIAGNOSTIC_LANDING_PAGE

  useApplyCmsSeo(
    content.seo,
    deriveHeroPageSeo({
      pageTitle: "Startup Diagnostic",
      heroSubtitle: content.heroSubtitle,
      pathname: "/startup-diagnostic",
    }),
  )

  return (
    <CmsModularSingletonPage
      fallback={<DiagnosticFallback content={content} />}
    />
  )
}
