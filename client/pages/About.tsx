import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelliaCta from "@/components/RelliaCta";
import { Heart, Stethoscope, Globe, Zap, type LucideIcon } from "lucide-react";
import { IconFeatureCard, TeamMemberCard } from "@/components/cards";
import { useAboutPage } from "@/hooks/useCmsDocuments";
import { DEFAULT_ABOUT_PAGE } from "@shared/cms/defaults";
import { useState } from "react";

const VALUE_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  stethoscope: Stethoscope,
  globe: Globe,
  zap: Zap,
};

const resolveValueIcon = (key: string): LucideIcon => VALUE_ICONS[key] ?? Heart;

const FOUNDER_APPLY_HREF = "/network";

export default function About() {
  const { data } = useAboutPage();
  const about = data ?? DEFAULT_ABOUT_PAGE;
  const [openTeamBioName, setOpenTeamBioName] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 bg-rellia-teal overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rellia-mint via-transparent to-transparent blur-3xl" />
          </div>

          <img
            src="/images/hologram-logo.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[70%] md:h-[90%] w-auto object-contain opacity-[0.07] select-none"
          />

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                {about.heroLine1} <br />
                <span className="text-rellia-mint">{about.heroLine2Mint}</span> <br />
                {about.heroLine3}
              </h1>
              <p className="text-white/80 text-lg md:text-xl max-w-3xl font-urbanist leading-relaxed">
                {about.heroIntro}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="flex flex-col lg:flex-row lg:items-start gap-16 md:gap-24">
                <div className="relative min-h-0 flex-1 w-full">
                  <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-rellia-mint/20 blur-2xl pointer-events-none" />
                  <h2 className="relative text-black text-4xl md:text-5xl font-bold tracking-tight mb-8">
                    {about.missionTitle}
                  </h2>
                  <div className="relative space-y-6 text-black/70 text-lg md:text-xl font-urbanist leading-relaxed">
                    {about.missionParagraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="relative aspect-[4/3] w-full flex-1 overflow-hidden rounded-3xl shadow-2xl lg:max-w-[min(100%,520px)] lg:shrink-0">
                  <img
                    src={about.missionImageSrc}
                    alt={about.missionImageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-rellia-cream/50">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-black text-4xl md:text-5xl font-bold tracking-tight mb-6">{about.valuesTitle}</h2>
              <p className="text-black/60 text-lg md:text-xl font-urbanist max-w-2xl mx-auto leading-relaxed">
                {about.valuesSubtitle}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {about.values.map((v, i) => {
                const Icon = resolveValueIcon(v.iconKey);
                return (
                  <ScrollReveal key={v.title} delay={i * 0.1}>
                    <IconFeatureCard variant="static" icon={Icon} title={v.title} description={v.description} />
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-black text-4xl md:text-5xl font-bold tracking-tight mb-6">{about.teamTitle}</h2>
              <p className="text-black/60 text-lg md:text-xl font-urbanist max-w-2xl mx-auto leading-relaxed">
                {about.teamSubtitle}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {about.team.map((t) => (
                <div key={t.name}>
                  <TeamMemberCard
                    name={t.name}
                    role={t.role}
                    bio={t.bio}
                    imageSrc={t.imageSrc}
                    bioOpen={openTeamBioName === t.name}
                    onBioOpenChange={(next) => setOpenTeamBioName(next ? t.name : null)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <RelliaCta
          title={about.ctaTitle}
          body={about.ctaBody}
          primary={{ label: about.ctaFounderLabel, to: FOUNDER_APPLY_HREF }}
          secondary={{ label: about.ctaTeamLabel, to: "/contact" }}
        />
      </main>

      <Footer />
    </div>
  );
}
