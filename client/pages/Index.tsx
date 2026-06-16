import { useMemo } from "react"
import { BriefcaseBusiness } from "lucide-react"
import HomeOrganizationJsonLd from "@/components/HomeOrganizationJsonLd";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PathsSection from "@/components/PathsSection";
import WhyRellia from "@/components/WhyRellia";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import FeaturedStories from "@/components/FeaturedStories";
import RelliaCta, { optionalCtaAction } from "@/components/RelliaCta";
import { SectionsRenderer } from "@/components/cms/PageRenderer";
import Footer from "@/components/Footer";
import { useHomePage } from "@/hooks/useCmsDocuments";
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults";
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo";
import { clampMetaDescription, clampMetaTitle, getSeoForPathname } from "@/config/seo";
import { resolveLucideIcon } from "@/lib/resolveLucideIcon"
import { resolveLogoMarqueeMarks } from "@/lib/resolveLogoMarqueeMarks"
import { PORTFOLIO_LOGO_MARKS } from "@/data/portfolioLogos"
import { cmsDisplayText } from "@/lib/cmsStega"

export default function Index() {
  const homeQuery = useHomePage();
  const home = homeQuery.data?.merged ?? DEFAULT_HOME_PAGE;
  const howItWorksSteps = useMemo(
    () =>
      (home.howItWorksSteps ?? DEFAULT_HOME_PAGE.howItWorksSteps ?? []).map((step) => ({
        _key: step._key,
        icon: resolveLucideIcon(step.iconKey, BriefcaseBusiness),
        title: step.title,
        description: step.description,
      })),
    [home.howItWorksSteps],
  )
  const logoMarqueeMarks = useMemo(
    () => resolveLogoMarqueeMarks(home.logoMarquee, PORTFOLIO_LOGO_MARKS),
    [home.logoMarquee],
  )
  const homeRouteSeo = getSeoForPathname("/");
  useApplyCmsSeo(home.seo, {
    title: clampMetaTitle(homeRouteSeo.title),
    description: clampMetaDescription(homeRouteSeo.description),
  });

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <HomeOrganizationJsonLd />
      <Navbar />
      <main id="main-content">
        <HeroSection content={home} />
        <PathsSection />

        <WhyRellia
          sectionTitle={cmsDisplayText(home.whySectionTitle ?? "Why Rellia?")}
          sectionDescription={cmsDisplayText(home.whySectionDescription)}
          features={home.whyFeatures}
        />

        <HowItWorks
          heading={home.howItWorksSectionTitle}
          subheading={home.howItWorksSectionDescription}
          steps={howItWorksSteps}
          columns={3}
        />
        <TestimonialsSection
          titlePortable={home.testimonialsTitlePortable}
          testimonials={home.testimonials}
          showHeaderIcon={false}
          logoMarqueeMarks={logoMarqueeMarks}
        />
        <FeaturedStories />
        {home.sections?.length ? <SectionsRenderer sections={home.sections} /> : null}
        <RelliaCta
          aboveSectionTone="white"
          title={home.ctaTitle}
          primary={{ label: home.ctaButtonLabel, to: home.ctaButtonPath }}
          secondary={optionalCtaAction(home.ctaSecondaryButtonLabel, home.ctaSecondaryButtonPath)}
        />
      </main>
      <Footer />
    </div>
  );
}
