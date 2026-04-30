import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelliaCta from "@/components/RelliaCta";
import { Heart, Stethoscope, Globe, Zap, type LucideIcon } from "lucide-react";
import { IconFeatureCard } from "@/components/cards/IconFeatureCard";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import PageHeader from "@/components/PageHeader";
import PillTag from "@/components/PillTag"
import { useAboutPage } from "@/hooks/useCmsDocuments";
import { DEFAULT_ABOUT_PAGE } from "@shared/cms/defaults";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const VALUE_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  stethoscope: Stethoscope,
  globe: Globe,
  zap: Zap,
};

const resolveValueIcon = (key: string): LucideIcon => VALUE_ICONS[key] ?? Heart;

const FOUNDER_APPLY_HREF = "/network";

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

const accentBetween = (text: string, startWord: string, endWord: string) => {
  const raw = (text ?? "").trim()
  if (!raw) return null

  const lower = raw.toLowerCase()
  const startIdx = lower.indexOf(startWord.toLowerCase())
  const endIdx = lower.lastIndexOf(endWord.toLowerCase())
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return raw

  const before = raw.slice(0, startIdx)
  const mid = raw.slice(startIdx, endIdx + endWord.length)
  const after = raw.slice(endIdx + endWord.length)

  return (
    <>
      {before}
      <span className="text-rellia-mint">{mid}</span>
      {after}
    </>
  )
}

export default function About() {
  const { data } = useAboutPage();
  const about = data ?? DEFAULT_ABOUT_PAGE;
  const [openTeamBioName, setOpenTeamBioName] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const valuesSectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: valuesScrollYProgress } = useScroll({
    target: valuesSectionRef,
    offset: ["start 95%", "end 5%"],
  });
  const valuesBgY = useTransform(valuesScrollYProgress, [0, 1], ["-18%", "18%"]);

  // Pexels image (hotlinked) for values section parallax background
  const valuesBgImage =
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600";

  // Pexels image (hotlinked) for mission section
  const missionImageSrc =
    "https://images.pexels.com/photos/3912958/pexels-photo-3912958.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600"

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <PageHeader
          variant="dark"
          title={
            <>
              {about.heroLine1} <br />
              <span className="text-rellia-mint">{about.heroLine2Mint}</span> <br />
              {about.heroLine3}
            </>
          }
          subtitle={about.heroIntro}
        />

        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="flex flex-col lg:flex-row lg:items-stretch gap-12 md:gap-16">
                <div className="relative min-h-0 w-full lg:w-1/2 lg:flex lg:flex-col lg:justify-center lg:h-[460px]">
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

                <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl lg:w-1/2 h-[360px] sm:h-[420px] lg:h-[460px]">
                  <img
                    src={missionImageSrc}
                    alt={about.missionImageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section
          ref={(node) => {
            valuesSectionRef.current = node;
          }}
          className="relative w-full overflow-hidden bg-white"
        >
          <div className="relative w-full overflow-hidden">
            <div className="relative w-full overflow-hidden h-[1160px] sm:h-[1020px] md:h-[980px] lg:h-[1040px]">
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

            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1300px] flex-col px-6 md:px-10 pt-12 md:pt-14 pb-14 md:pb-18">
              <div className="flex flex-col items-start text-left mt-8 md:mt-10 lg:mt-24">
                <ScrollReveal>
                  <div className="mb-7 md:mb-8">
                    <PillTag label="Values" />
                  </div>
                  <h2 className="font-host-grotesk font-medium text-white text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-4xl">
                    {accentBetween(about.valuesSubtitle, "every", "decision")}
                  </h2>
                </ScrollReveal>
              </div>

              <div className="mt-10 sm:mt-12 lg:flex-1 lg:flex lg:items-center">
                <div className="w-full">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
                {about.values.map((v, i) => {
                  const Icon = resolveValueIcon(v.iconKey);

                  return (
                    <ScrollReveal key={v.title} delay={i * 0.08}>
                      <div className="flex h-[240px] sm:h-[240px] md:h-[260px] lg:h-[260px] flex-col rounded-2xl border border-white/18 bg-white/10 px-6 py-8 md:px-7 md:py-9 backdrop-blur-lg shadow-[0_18px_60px_-36px_rgba(0,0,0,0.65)]">
                        <Icon className="h-6 w-6 text-rellia-mint" aria-hidden />
                        <p className="mt-5 text-white text-lg md:text-xl font-semibold tracking-tight leading-snug">
                          {v.title}
                        </p>
                        <p className="mt-3 text-white/80 text-sm md:text-[15px] leading-relaxed font-urbanist overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]">
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
                    linkedinUrl={t.linkedinUrl}
                    websiteUrl={t.websiteUrl}
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
