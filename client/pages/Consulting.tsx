import { PEXELS_HEALTH_MEETING } from "@/config/pexelsFallbacks"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LogoMarquee from "@/components/LogoMarquee"
import SectionHeading from "@/components/SectionHeading"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import ScrollReveal from "@/components/ScrollReveal"
import TestimonialsSection from "@/components/TestimonialsSection"
import ProgramTrustedMembersSection from "@/components/program/ProgramTrustedMembersSection"
import { useHomePage } from "@/hooks/useCmsDocuments"
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults"
import { CheckCircle2, Palette, ShieldCheck, Stethoscope, Megaphone, ArrowRight, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { CreamSection, LightSection, Reveal, RoleHero } from "./network/_shared"
import { isProductionHostname } from "@/lib/sanity"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"

const WHEN_TO_USE = [
  "You need scoped deep dives—FDA strategy, clinical evidence design, enterprise sales narrative—in focused sessions",
  "Your team wants documentation or diligence artifacts reviewed before a board or investor cycle",
  "You are navigating a pivot that touches regulatory labeling, pilot contracts, or interoperability commitments",
] as const

const CONSULTING_SERVICES = [
  {
    title: "Regulatory Consulting",
    imageSrc: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: ShieldCheck,
  },
  {
    title: "Clinical Trials",
    imageSrc: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Stethoscope,
  },
  {
    title: "Marketing Strategy",
    imageSrc: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Megaphone,
  },
  {
    title: "Branding",
    imageSrc: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Palette,
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

        <div className="mt-12 md:mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CONSULTING_SERVICES.map((s, idx) => (
            <Reveal key={s.title} delay={0.05 * idx}>
              <article className="group relative overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-[1px] hover:shadow-md motion-reduce:transition-none">
                <div className="relative aspect-[5/6] w-full overflow-hidden">
                  <img
                    src={s.imageSrc}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    loading="lazy"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-4">
                    <h3 className="font-host-grotesk text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-sm">
                      {s.title}
                    </h3>
                    <Link to="/contact" className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-mint transition-colors hover:text-white">
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </div>
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

  const isProd = isProductionHostname()

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <div className="lg:flex lg:h-[82vh] lg:flex-col">
          <RoleHero
            eyebrowLabel="Consulting"
            imageSrc={PEXELS_HEALTH_MEETING}
            className="lg:flex-1"
            title={
              <>
                Founder consulting <span className="text-rellia-mint">built for healthcare reality</span>
              </>
            }
            subtitle="One-to-one and small-team working sessions when you need depth beyond community rhythm—regulatory, clinical, commercial, and narrative—with specialists who have shipped in health tech."
            primaryCta={{ label: "Start a conversation", to: "/contact" }}
            secondaryCta={{ label: "Apply for membership", to: "/apply" }}
          />
        </div>

        {isProd ? (
          <div className="py-24 md:py-40">
            <FilteredListEmptyState
              icon={Clock}
              title="Consulting coming soon"
              description="We're currently finalizing our consulting model to ensure high-impact delivery for every milestone. Check back shortly or contact us for immediate inquiries."
            />
          </div>
        ) : (
          <>
            <FitSectionSplit />
            <ServicesGridSection />
            <ProgramTrustedMembersSection />
          </>
        )}

        {!isProd && (
          <LightSection className="bg-rellia-cream/20">
            <div className="mx-auto max-w-[1300px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
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

                <Reveal delay={0.06}>
                  <div className="relative overflow-hidden rounded-3xl border border-rellia-teal/10 bg-white p-6 shadow-[0_28px_80px_-52px_rgba(13,53,64,0.35)] md:p-8">
                    <div aria-hidden className="pointer-events-none absolute inset-0">
                      <div className="absolute -left-24 -top-24 h-[340px] w-[340px] rounded-full bg-rellia-mint/22 blur-3xl" />
                      <div className="absolute -right-28 bottom-0 h-[380px] w-[380px] rounded-full bg-rellia-teal/10 blur-3xl" />
                      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(167,219,214,0.18),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.08),transparent_55%)]" />
                    </div>

                    <div className="relative z-10 grid gap-4">
                      {[
                        { label: "Member discount", value: "Up to 25% off" },
                        { label: "Vetted consultants", value: "Regulatory · Clinical · GTM" },
                        { label: "Fast matching", value: "Book within days" },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/80 px-5 py-4 backdrop-blur-sm"
                        >
                          <p className="font-urbanist text-sm font-medium text-black/60">{row.label}</p>
                          <p className="font-host-grotesk text-base font-semibold text-rellia-teal">{row.value}</p>
                        </div>
                      ))}

                      <div className="mt-2 rounded-2xl bg-rellia-teal px-5 py-4 text-white shadow-sm">
                        <p className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.14em] text-rellia-mint">
                          Example savings
                        </p>
                        <p className="mt-2 font-urbanist text-sm leading-relaxed text-white/85">
                          A 6-hour sprint can save hundreds while keeping the same senior operator support.
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </LightSection>
        )}

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
