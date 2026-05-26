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
import { CheckCircle2, Palette, ShieldCheck, Stethoscope, Megaphone, ArrowRight } from "lucide-react"
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
    body: "Secure ISO 13485 QMS compliance and structure your FDA 510(k) or Health Canada classification label.",
    cta: "Explore regulatory",
    icon: ShieldCheck,
  },
  {
    title: "Clinical Trials",
    body: "Design pre-market feasibility studies, validate investigator protocols, and organize real-world evidence.",
    cta: "Explore clinical",
    icon: Stethoscope,
  },
  {
    title: "Marketing Strategy",
    body: "Refine B2B health system positioning, sharpen value proposition models, and build pilot trust.",
    cta: "Explore strategy",
    icon: Megaphone,
  },
  {
    title: "Branding",
    body: "Craft a premium clinical brand identity, consistent design systems, and highly-polished GTM materials.",
    cta: "Explore branding",
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
              src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200"
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
    <section className="relative w-full overflow-hidden bg-white px-6 py-16 md:px-10 md:py-24">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 top-6 w-[320px] max-w-[55vw] opacity-[0.15] md:right-0 md:top-4 md:w-[420px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-12 h-[450px] w-[450px] rounded-full bg-rellia-mint/10 blur-[120px]" />
        <div className="absolute -right-32 -bottom-16 h-[500px] w-[500px] rounded-full bg-rellia-mint/8 blur-[130px]" />
        <div className="absolute left-1/3 top-1/4 h-[350px] w-[350px] rounded-full bg-rellia-mint/5 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(circle_at_30%_15%,rgba(13,53,64,0.02),transparent_52%),radial-gradient(circle_at_75%_40%,rgba(157,214,208,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <h2 className="mt-5 font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-rellia-teal md:text-[32px]">
            Common consulting sprints
          </h2>
          <p className="mt-4 max-w-2xl font-urbanist text-base font-medium leading-relaxed text-black/80 md:text-lg">
            Four areas founders most often need concentrated working time—scoped to outputs you can reuse in diligence and execution.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {CONSULTING_SERVICES.map((card) => {
              const Icon = card.icon
              return (
                <Link 
                  key={card.title} 
                  to="/contact" 
                  className="group flex min-h-[240px] flex-col rounded-2xl border border-black/10 bg-gradient-to-br from-rellia-teal to-[#144853] p-8 transition duration-300 hover:from-[#113f4a] hover:to-[#0f3842] hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <Icon className="h-8 w-8 text-rellia-mint transition-transform duration-300 group-hover:scale-105" aria-hidden />
                  <h3 className="mt-5 font-host-grotesk text-xl font-semibold tracking-tight text-white">{card.title}</h3>
                  <p className="mt-4 flex-1 font-urbanist leading-relaxed text-white/80 text-sm">{card.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-mint">
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default function Consulting() {
  const { data: homePage } = useHomePage()
  const home = homePage ?? DEFAULT_HOME_PAGE

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <div className="lg:flex lg:h-[82vh] lg:flex-col">
          <RoleHero
            eyebrowLabel="Consulting"
            imageSrc="https://images.pexels.com/photos/7088483/pexels-photo-7088483.jpeg?auto=compress&cs=tinysrgb&w=1200"
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

        <FitSectionSplit />
        <ServicesGridSection />
        <ProgramTrustedMembersSection />

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
                    <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable">
                      <Link to="/apply" className="inline-flex cursor-pointer items-center justify-center">
                        Apply for membership
                      </Link>
                    </RelliaAction>
                    <RelliaAction asChild variant="outlineOnWhite" size="comfortable" className="hover:!bg-rellia-mint hover:!text-rellia-teal hover:!border-rellia-mint">
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

        <div className="bg-rellia-cream/20">
          <RelliaCta
            title="Not sure which **path** fits?"
            body="Tell us your milestone—we'll recommend membership, consulting, or a blended rhythm."
            primary={{ label: "Talk to us", to: "/contact" }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
