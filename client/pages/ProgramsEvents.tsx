import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { EventCard, eventKey, ProgramCard } from "@/components/cards";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import RelliaAction from "@/components/RelliaAction";
import { ArrowRight } from "lucide-react";
import { useProgramsLandingPage } from "@/hooks/useCmsDocuments";
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults";

const carouselArrowClass = cn(
  "static translate-x-0 translate-y-0 relative",
  "h-12 w-12 rounded-full border-2 border-rellia-teal bg-white text-rellia-teal shadow-md",
  "hover:bg-rellia-teal hover:text-white",
  "disabled:opacity-40 disabled:pointer-events-none",
);

export default function ProgramsEvents() {
  const { data } = useProgramsLandingPage();
  const pl = data ?? DEFAULT_PROGRAMS_LANDING;

  const handleScrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main>
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-24 bg-rellia-teal overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rellia-mint via-transparent to-transparent blur-3xl" />
          </div>
          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-6">
                {pl.heroTitleLine1}{" "}
                <span className="text-rellia-mint">{pl.heroTitleMint}</span>
              </h1>
              <p className="text-white/80 text-lg md:text-2xl max-w-3xl font-urbanist leading-relaxed">
                {pl.heroSubtitle}
              </p>
            </ScrollReveal>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <ScrollReveal delay={0.1}>
                <RelliaAction asChild variant="heroSolidOnTeal">
                  <a
                    href="#view-programs"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToId("view-programs");
                    }}
                  >
                    {pl.heroPrimaryCtaLabel}
                  </a>
                </RelliaAction>
              </ScrollReveal>
              <ScrollReveal delay={0.18}>
                <RelliaAction asChild variant="heroGhostOnTeal">
                  <a
                    href="#view-events"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToId("view-events");
                    }}
                  >
                    {pl.heroSecondaryCtaLabel}
                  </a>
                </RelliaAction>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id="view-programs" className="py-16 md:py-24 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="mb-12 text-center">
              <h2 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight">
                {pl.programsSectionTitle}
              </h2>
              <p className="font-urbanist text-black/60 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
                {pl.programsSectionSubtitle}
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pl.programs.map((p) => (
                  <ProgramCard
                    key={p.href}
                    title={p.title}
                    description={p.description}
                    imageSrc={p.imageSrc}
                    href={p.href}
                    buttonText={p.buttonText}
                  />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="view-events" className="py-20 md:py-32 bg-rellia-cream/50">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="mb-12 flex flex-col items-center text-center">
              <h2 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight">
                Upcoming Events
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pl.upcomingEvents.map((event) => (
                  <EventCard key={eventKey(event)} event={event} variant="upcoming" />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white overflow-x-hidden">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="mb-12 text-center">
              <h3 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight">
                Past Events
              </h3>
            </ScrollReveal>

            <ScrollReveal>
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                  dragFree: false,
                  containScroll: "trimSnaps",
                }}
                className="w-full"
              >
                <div className="flex flex-col gap-8">
                  <CarouselContent className="-ml-4 md:-ml-6">
                    {pl.pastEvents.map((event) => (
                      <CarouselItem
                        key={eventKey(event)}
                        className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                      >
                        <EventCard event={event} variant="past" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <div className="flex items-center justify-center gap-4">
                    <CarouselPrevious className={carouselArrowClass} />
                    <CarouselNext className={carouselArrowClass} />
                  </div>
                </div>
              </Carousel>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6">
          <div className="max-w-[1300px] mx-auto">
            <ScrollReveal>
              <div className="bg-rellia-teal rounded-3xl px-8 py-14 md:px-16 md:py-20 text-center">
                <h3 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {pl.ctaTitle}
                </h3>
                <p className="font-urbanist text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-8">
                  {pl.ctaBody}
                </p>
                <RelliaAction asChild variant="mintOnTealStrip" size="comfortable">
                  <a href={pl.ctaButtonHref}>
                    {pl.ctaButtonLabel}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </RelliaAction>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
