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
import RelliaCta from "@/components/RelliaCta";
import Footer from "@/components/Footer";
import { useHomePage } from "@/hooks/useCmsDocuments";
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults";
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo";
import { clampMetaDescription, clampMetaTitle, getSeoForPathname } from "@/config/seo";
import { resolveLucideIcon } from "@/lib/resolveLucideIcon"

export default function Index() {
  const { data } = useHomePage();
  const home = data ?? DEFAULT_HOME_PAGE;
  const howItWorksSteps = useMemo(
    () =>
      (home.howItWorksSteps ?? DEFAULT_HOME_PAGE.howItWorksSteps ?? []).map((step) => ({
        icon: resolveLucideIcon(step.iconKey, BriefcaseBusiness),
        title: step.title,
        description: step.description,
      })),
    [home.howItWorksSteps],
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
          sectionTitle={home.whySectionTitle ?? "Why Rellia?"}
          sectionDescription={home.whySectionDescription}
          features={home.whyFeatures}
        />

        <HowItWorks
          heading={home.howItWorksSectionTitle ?? "Where we focus"}
          subheading={home.howItWorksSectionDescription}
          steps={howItWorksSteps}
          columns={3}
        />
        <TestimonialsSection
          titlePortable={home.testimonialsTitlePortable}
          testimonials={home.testimonials}
          showHeaderIcon={false}
        />
        <FeaturedStories />
        <RelliaCta
          aboveSectionTone="white"
          title={home.ctaTitle}
          primary={{ label: home.ctaButtonLabel, to: home.ctaButtonPath }}
          secondary={
            home.ctaSecondaryButtonLabel?.trim() && home.ctaSecondaryButtonPath?.trim()
              ? {
                  label: home.ctaSecondaryButtonLabel,
                  to: home.ctaSecondaryButtonPath,
                }
              : undefined
          }
        />
      </main>
      <Footer />
    </div>
  );
}
