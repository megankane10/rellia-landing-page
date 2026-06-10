import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelliaCta from "@/components/RelliaCta";
import { Heart, Stethoscope, Globe, Zap, type LucideIcon } from "lucide-react";
import { IconFeatureCard } from "@/components/cards/IconFeatureCard";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import PageHeader, { PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import PillTag, { PILL_ON_IMAGE_BLUR_CLASS } from "@/components/PillTag"
import { useAboutPage } from "@/hooks/useCmsDocuments";
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo";
import { DEFAULT_ABOUT_PAGE } from "@shared/cms/defaults";
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { relliaTealGlassCardClass } from "@/lib/relliaTealGlassCard";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const VALUE_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  stethoscope: Stethoscope,
  globe: Globe,
  zap: Zap,
};

const resolveValueIcon = (key: string): LucideIcon => VALUE_ICONS[key] ?? Heart;

const accentLastWords = (text: string, wordCount = 3) => {
  const raw = (text ?? "").trim()
  if (!raw) return null
  const words = raw.split(/\s+/).filter(Boolean)
  if (words.length <= wordCount + 1) return raw

  const head = words.slice(0, -wordCount).join(" ")
  const tail = words.slice(-wordCount).join(" ")

  return (
    <>
      {head} <span className="text-rellia-mint">{tail}</span>
    </>
  )
}

export default function About() {
  const { data } = useAboutPage();
  const about = data ?? DEFAULT_ABOUT_PAGE;
  useApplyCmsSeo(about.seo);
  const [openTeamBioName, setOpenTeamBioName] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const valuesSectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: valuesScrollYProgress } = useScroll({
    target: valuesSectionRef,
    offset: ["start 95%", "end 5%"],
  });
  const valuesBgY = useTransform(valuesScrollYProgress, [0, 1], ["-18%", "18%"]);

  // Pexels image (hotlinked) for values section parallax background
  const valuesBgImage =
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600";

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <PageHeader
          variant="dark"
          titleClassName={cn(PAGE_HEADER_TITLE_SIZE_CLASS, "max-w-3xl")}
          title={<HeroHeadlinePortable value={about.heroTitlePortable} />}
          subtitle={about.heroIntro}
        />

        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2 lg:items-stretch lg:gap-10 xl:gap-12">
                <div className="relative min-h-0 w-full min-w-0 lg:pr-2 xl:pr-4">
                  <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-rellia-mint/20 blur-2xl pointer-events-none" />
                  <h2 className="relative text-black text-2xl md:text-[32px] font-semibold tracking-tight mb-6">
                    {about.missionTitle}
                  </h2>
                  <div className="relative space-y-5 text-black/70 text-base md:text-lg font-urbanist leading-relaxed">
                    {about.missionParagraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-0 w-full min-w-0">
                  <div className="relative mx-auto aspect-[5/4] w-full max-w-full overflow-hidden rounded-[2.5rem] shadow-lg sm:aspect-[5/4] md:rounded-[3.5rem] lg:mx-0 lg:aspect-auto lg:h-full lg:min-h-[400px]">
                    <img
                      src={about.missionImageSrc}
                      alt={about.missionImageAlt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section
          ref={(node) => {
            valuesSectionRef.current = node;
          }}
          className="relative w-full overflow-hidden bg-white py-4 md:py-6"
        >
          <div className="relative w-full overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-lg">
            <div className="relative flex min-h-[880px] w-full flex-col overflow-hidden sm:min-h-[900px] md:min-h-[880px] lg:min-h-[960px]">
            <div className="absolute inset-0 overflow-hidden" aria-hidden>
              <motion.img
                src={valuesBgImage}
                alt=""
                className="h-full w-full object-cover scale-[1.12] object-[55%_50%]"
                style={reduceMotion ? undefined : { y: valuesBgY }}
              />
              <div className="absolute inset-0 bg-rellia-teal/35" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-[1300px] flex-1 flex-col px-6 pt-14 pb-8 md:px-10 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12">
              <ScrollReveal>
                <div className="space-y-5 md:space-y-6">
                  <PillTag label="OUR VALUES" className={PILL_ON_IMAGE_BLUR_CLASS} />
                  <h2
                    className={`font-host-grotesk font-bold leading-tight tracking-tight text-white max-w-4xl ${PAGE_HEADER_TITLE_SIZE_CLASS}`}
                  >
                    {accentLastWords(about.valuesSubtitle, 4)}
                  </h2>
                </div>
              </ScrollReveal>

              <div className="flex flex-1 flex-col justify-center py-8 md:py-10 lg:py-12">
                <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {about.values.map((v, i) => {
                  const Icon = resolveValueIcon(v.iconKey);

                  return (
                    <ScrollReveal key={v.title} delay={i * 0.08} className="flex h-full min-h-0">
                      <div
                        className={cn(
                          relliaTealGlassCardClass,
                          "flex h-full min-h-0 w-full flex-col px-4 py-4 sm:px-6 sm:py-7 md:px-7 md:py-8",
                        )}
                      >
                        <Icon
                          className="h-5 w-5 shrink-0 text-rellia-mint sm:h-7 sm:w-7"
                          aria-hidden
                        />
                        <p className="mt-2.5 font-host-grotesk text-sm font-semibold leading-snug tracking-tight text-white sm:mt-4 sm:text-lg md:text-xl">
                          {v.title}
                        </p>
                        <p className="mt-1.5 flex-1 font-urbanist text-xs leading-normal text-white/80 sm:mt-3 sm:text-base md:text-lg">
                          {v.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  );
                })}
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="text-center mb-12 md:mb-14">
              <h2 className="text-black text-2xl md:text-[32px] font-semibold tracking-tight mb-4">{about.teamTitle}</h2>
              <p className="text-black/60 text-base md:text-lg font-urbanist max-w-2xl mx-auto leading-relaxed">
                {about.teamSubtitle}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(about.team ?? []).map((t) => (
                <div key={t.name}>
                  <TeamMemberCard
                    name={t.name}
                    role={t.role}
                    bio={t.bio}
                    imageSrc={t.imageSrc}
                    socialLinks={t.socialLinks}
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
          primary={{ label: about.ctaFounderLabel, to: "/apply" }}
          secondary={{ label: about.ctaTeamLabel, to: "/careers" }}
        />
      </main>

      <Footer />
    </div>
  );
}
