import { PAGE_HEADER_DARK_SUBTITLE_CLASS, PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { ArrowRight } from "lucide-react"
import {
  AiGeneratedNote,
  BentoGrid,
  GlassCard,
  MultiStepSignupForm,
  PathToSuccess,
  ProblemBlock,
  Reveal,
  SectionShell,
  NETWORK_BG,
} from "./_shared"

const HERO_IMAGE =
  "https://images.pexels.com/photos/30493646/pexels-photo-30493646.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

function CapabilityIcon({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
      <span className="h-9 w-9 rounded-2xl border border-white/15 bg-white/10" aria-hidden />
      <span className="font-urbanist text-white/80">{label}</span>
    </div>
  )
}

export default function Partners() {
  return (
    <div className="min-h-screen font-host-grotesk overflow-x-hidden" style={{ backgroundColor: NETWORK_BG }}>
      <Navbar />

      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 px-6 md:px-10 overflow-hidden">
          <img src={HERO_IMAGE} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-center" />
          <div aria-hidden className="absolute inset-0 bg-[#022c2e]/70" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#022c2e] via-[#022c2e]/60 to-[#022c2e]/25" />

          <div className="relative z-10 max-w-[1300px] mx-auto">
            <Reveal>
              <div className="max-w-3xl">
                <AiGeneratedNote />
                <h1
                  className={`mt-8 text-white font-bold leading-tight tracking-tight ${PAGE_HEADER_TITLE_SIZE_CLASS}`}
                >
                  The Ecosystem
                  <br />
                  that accelerates adoption
                </h1>
                <p className={cn(PAGE_HEADER_DARK_SUBTITLE_CLASS, "mt-6")}>
                  Lorem ipsum: Insert Value Prop Here—pilot programs, integration support, and credibility inside health
                  systems.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <RelliaAction
                    asChild
                    variant="mintOnTealStrip"
                    size="comfortable"
                    className="bg-[#ccfbf1] border-[#ccfbf1] text-[#022c2e] hover:bg-transparent hover:border-white"
                  >
                    <a href="#signup" aria-label="Get started">
                      Get Started
                      <ArrowRight aria-hidden />
                    </a>
                  </RelliaAction>
                  <RelliaAction
                    asChild
                    variant="heroGhostOnTeal"
                    size="comfortable"
                    className="border-[#ccfbf1] text-[#ccfbf1]"
                  >
                    <a href="/industry-partners/directory" aria-label="Open the industry partners directory">
                      View directory
                      <ArrowRight aria-hidden />
                    </a>
                  </RelliaAction>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Problem */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The problem</h2>
            <p className="mt-4 font-urbanist text-white/75 text-lg leading-relaxed max-w-2xl">
              Lorem ipsum: partnerships fail when pilots, integration, and handoffs aren’t designed up front. Insert
              Value Prop Here.
            </p>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <ProblemBlock
                items={[
                  { title: "Pilot friction", body: "Lorem ipsum: hard to scope pilots that actually prove value." },
                  { title: "Integration gaps", body: "Lorem ipsum: unclear APIs, workflows, and compliance needs." },
                  { title: "Enterprise handoff", body: "Lorem ipsum: founders need support scaling the relationship." },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>

        {/* Solution */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The Rellia solution</h2>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <BentoGrid
                items={[
                  {
                    title: "Pilot-ready founders",
                    body: "Lorem ipsum: better-scoped pilots with real outcomes.",
                    imageUrl:
                      "https://images.pexels.com/photos/6129679/pexels-photo-6129679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                    span: "wide",
                  },
                  {
                    title: "Integration guidance",
                    body: "Lorem ipsum: workflows, security, and compliance built in.",
                    imageUrl:
                      "https://images.pexels.com/photos/4416539/pexels-photo-4416539.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                  },
                  {
                    title: "Partner signal",
                    body: "Lorem ipsum: community trust + credibility.",
                    imageUrl:
                      "https://images.pexels.com/photos/5875565/pexels-photo-5875565.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                  },
                  {
                    title: "Enterprise handoff",
                    body: "Lorem ipsum: support the transition from pilot to scale.",
                    imageUrl:
                      "https://images.pexels.com/photos/15277956/pexels-photo-15277956.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                    span: "wide",
                  },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>

        {/* Process */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Path to success</h2>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <PathToSuccess
                steps={[
                  { title: "Align", body: "Lorem ipsum: define the right pilot and integration scope." },
                  { title: "Pilot", body: "Lorem ipsum: prove value with real users and workflows." },
                  { title: "Integrate", body: "Lorem ipsum: de-risk security, compliance, and deployment." },
                  { title: "Scale", body: "Lorem ipsum: enterprise handoff that doesn’t stall momentum." },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>

        {/* Unique: Integration capabilities */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Integration Capabilities</h2>
            <p className="mt-4 font-urbanist text-white/75 text-lg leading-relaxed max-w-2xl">
              Lorem ipsum: placeholder icons for API, Clinical Pilots, and Enterprise Handoff. Insert Value Prop Here.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Reveal delay={0.05}>
              <CapabilityIcon label="API" />
            </Reveal>
            <Reveal delay={0.08}>
              <CapabilityIcon label="Clinical Pilots" />
            </Reveal>
            <Reveal delay={0.11}>
              <CapabilityIcon label="Enterprise Handoff" />
            </Reveal>
          </div>
        </SectionShell>

        {/* Signup */}
        <SectionShell className="py-16 md:py-24">
          <div id="signup" className="scroll-mt-28">
            <Reveal>
              <MultiStepSignupForm
                ctaLabel="Download the Partnership Deck"
                roleLabel="Partner"
                step2Fields={[
                  { name: "company", label: "Company", placeholder: "Insert Value Prop Here Inc." },
                  { name: "offering", label: "Offering", placeholder: "Services, platform, infrastructure…" },
                  { name: "ideal", label: "Ideal founder profile", placeholder: "Stage + category" },
                  { name: "integration", label: "Integration needs", placeholder: "API, pilots, enterprise handoff…" },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>
      </main>

      <Footer />
    </div>
  )
}

