import HomeOrganizationJsonLd from "@/components/HomeOrganizationJsonLd";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

import NetworkMetricsSection from "@/components/NetworkMetricsSection";
import WhyRellia from "@/components/WhyRellia";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";

import RelliaCta from "@/components/RelliaCta";
import Footer from "@/components/Footer";
import { useHomePage } from "@/hooks/useCmsDocuments";
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults";
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo";

export default function Index() {
  const { data } = useHomePage();
  const home = data ?? DEFAULT_HOME_PAGE;
  useApplyCmsSeo(home.seo);

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <HomeOrganizationJsonLd />
      <Navbar />
      <main id="main-content">
        <HeroSection content={home} />

        <NetworkMetricsSection
          heading={home.metricsHeading}
          subheading={home.metricsSubheading}
          metrics={home.metrics}
        />

        <WhyRellia
          sectionTitle="Why Rellia?"
          features={home.whyFeatures}
          cardImages={[
            "/images/whyrellia-outcomes-2.jpg",
            "/images/whyrellia-founders-2.jpg",
            "/images/whyrellia-programs-2.jpg",
            "/images/whyrellia-network-2.jpg",
          ]}
        />

        <HowItWorks />
        <TestimonialsSection
          titlePortable={home.testimonialsTitlePortable}
          testimonials={home.testimonials}
          showHeaderIcon={false}
        />

        <RelliaCta
          title={home.ctaTitle}
          primary={{ label: home.ctaButtonLabel, to: home.ctaButtonPath }}
        />
      </main>
      <Footer />
    </div>
  );
}
