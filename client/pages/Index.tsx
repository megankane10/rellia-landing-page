import HomeOrganizationJsonLd from "@/components/HomeOrganizationJsonLd";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PathsSection from "@/components/PathsSection";
import NetworkMetricsSection from "@/components/NetworkMetricsSection";
import WhyRellia from "@/components/WhyRellia";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import FeaturedStories from "@/components/FeaturedStories";
import RelliaCta from "@/components/RelliaCta";
import Footer from "@/components/Footer";
import { useHomePage } from "@/hooks/useCmsDocuments";
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults";

export default function Index() {
  const { data } = useHomePage();
  const home = data ?? DEFAULT_HOME_PAGE;

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <HomeOrganizationJsonLd />
      <Navbar />
      <main id="main-content">
        <HeroSection content={home} />
        <PathsSection />
        <NetworkMetricsSection
          heading={home.metricsHeading}
          subheading={home.metricsSubheading}
          metrics={home.metrics}
        />
        <WhyRellia sectionTitle={home.howItWorksSectionTitle} features={home.whyFeatures} />
        <HowItWorks />
        <TestimonialsSection
          titleLead={home.testimonialsTitleLead}
          titleAccent={home.testimonialsTitleAccent}
          testimonials={home.testimonials}
        />
        <FeaturedStories sectionClassName="pb-16 pt-10 md:pb-24 md:pt-12" />
        <RelliaCta
          title={home.ctaTitle}
          primary={{ label: home.ctaButtonLabel, to: home.ctaButtonPath }}
        />
      </main>
      <Footer />
    </div>
  );
}
