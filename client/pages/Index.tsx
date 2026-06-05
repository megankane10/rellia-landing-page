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

export default function Index() {
  const { data } = useHomePage();
  const home = data ?? DEFAULT_HOME_PAGE;
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
          sectionTitle="Why Rellia?"
          features={home.whyFeatures}
          cardImages={[
            "https://images.pexels.com/photos/1757363/pexels-photo-1757363.jpeg?auto=compress&cs=tinysrgb&w=1200", // outcomes
            "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=1200", // founders
            "https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?auto=compress&cs=tinysrgb&w=1200", // programs
            "https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=1200", // network
          ]}
        />

        <HowItWorks />
        <TestimonialsSection
          titlePortable={home.testimonialsTitlePortable}
          testimonials={home.testimonials}
          showHeaderIcon={false}
        />
        <FeaturedStories />
        <RelliaCta
          title={home.ctaTitle}
          primary={{ label: home.ctaButtonLabel, to: home.ctaButtonPath }}
        />
      </main>
      <Footer />
    </div>
  );
}
