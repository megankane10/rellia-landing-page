import { PEXELS_HEALTH_MEETING } from "@/config/pexelsFallbacks"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SectionHeading from "@/components/SectionHeading"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import ScrollReveal from "@/components/ScrollReveal"
import TestimonialsSection from "@/components/TestimonialsSection"
import { useHomePage } from "@/hooks/useCmsDocuments"
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults"
import { CheckCircle2, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { CreamSection, LightSection, Reveal, RoleHero } from "./network/_shared"

const WHEN_TO_USE = [
  "You need scoped deep dives—FDA strategy, clinical evidence design, enterprise sales narrative—in focused sessions",
  "Your team wants documentation or diligence artifacts reviewed before a board or investor cycle",
  "You are navigating a pivot that touches regulatory labeling, pilot contracts, or interoperability commitments",
] as const

const CONSULTING_SERVICES = [
  {
    title: "Regulatory Consulting",
    imageSrc: "/images/program-regulatoryRoadmap.png",
  },
  {
    title: "Clinical Trials",
    imageSrc: "/images/program-first50users.png",
  },
  {
    title: "Marketing Strategy",
    imageSrc: "/images/program-HealthcareCapital.png",
  },
  {
    title: "Branding",
    imageSrc: "/images/program-designYourBrand.png",
  },
] as const

function FitSectionSplit() {
  return (
    <LightSection className="bg-rellia-cream/20 pt-12 md:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            animated={false}
            title="When consulting makes sense"
            description="Membership gives ongoing access to community, programs, and broad intros. Consulting is for concentrated blocks of work where you need explicit outputs and senior judgment on the critical path."
            className="mt-5"
          />
          <ul className="mt-10 max-w-3xl space-y-4" role="list">
            {WHEN_TO_USE.map((line, idx) => (
              <Reveal key={line.slice(0, 32)} delay={0.04 * idx}>
                <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
                  {line}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={0.06}>
          <div className="overflow-hidden rounded-2xl border border-rellia-teal/15 shadow-[0_28px_80px_-48px_rgba(13,53,64,0.4)]">
            <img
              src={PEXELS_HEALTH_MEETING}
              alt="Clinical and commercial leaders in a focused working session"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </LightSection>
  )
}

function ServicesGridSection() {
  return (
    <LightSection className="bg-white border-t border-black/10">
      <div className="mx-auto max-w-[1300px]">
        <ScrollReveal>
          <SectionHeading
            animated={false}
            title="Common consulting sprints"
            description="Four areas founders most often need concentrated working time—scoped to outputs you can reuse in diligence and execution."
            className="mt-5"
          />
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CONSULTING_SERVICES.map((s, idx) => (
            <Reveal key={s.title} delay={0.05 * idx}>
              <article className="group relative overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-[1px] hover:shadow-md motion-reduce:transition-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={s.imageSrc}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    loading="lazy"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                  />
                </div>
                <div className="flex flex-col items-start gap-3 p-6">
                  <Sparkles className="h-7 w-7 text-rellia-mint" aria-hidden />
                  <h3 className="font-host-grotesk text-xl font-semibold tracking-tight text-black">{s.title}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </LightSection>
  )
}

export default function Consulting() {
  const { data: homePage } = useHomePage()
  const home = homePage ?? DEFAULT_HOME_PAGE

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <RoleHero
          eyebrowLabel="Consulting"
          imageSrc={PEXELS_HEALTH_MEETING}
          title={
            <>
              Founder consulting <span className="text-rellia-mint">built for healthcare reality</span>
            </>
          }
          subtitle="One-to-one and small-team working sessions when you need depth beyond community rhythm—regulatory, clinical, commercial, and narrative—with specialists who have shipped in health tech."
          primaryCta={{ label: "Start a conversation", to: "/contact" }}
          secondaryCta={{ label: "Apply for membership", to: "/apply" }}
        />

        <FitSectionSplit />

        <ServicesGridSection />

        <TestimonialsSection titlePortable={home.testimonialsTitlePortable} testimonials={home.testimonials} />

        <LightSection className="bg-rellia-cream/20">
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <SectionHeading
                animated={false}
                title="Membership makes consulting even more valuable"
                description="Rellia members get access to discounts and our full directory of vetted consultants—so you can move faster when a milestone becomes urgent."
                className="mt-5"
              />
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                  <Link to="/apply" className="inline-flex cursor-pointer items-center justify-center">
                    Apply for membership
                  </Link>
                </RelliaAction>
                <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
                  <Link to="/contact" className="inline-flex cursor-pointer items-center justify-center">
                    Ask about consulting
                  </Link>
                </RelliaAction>
              </div>
            </ScrollReveal>
          </div>
        </LightSection>

        <RelliaCta
          title="Not sure which **path** fits?"
          body="Tell us your milestone—we'll recommend membership, consulting, or a blended rhythm."
          primary={{ label: "Talk to us", to: "/contact" }}
          secondary={{ label: "Apply for membership", to: "/apply" }}
        />
      </main>

      <Footer />
    </div>
  )
}
