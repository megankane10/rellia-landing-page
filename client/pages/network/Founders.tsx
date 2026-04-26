import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { TeamMemberCard } from "@/components/cards/TeamMemberCard"
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
  "https://images.pexels.com/photos/17737193/pexels-photo-17737193.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

export default function Founders() {
  const [openBioName, setOpenBioName] = useState<string | null>(null)

  const friction = useMemo(
    () => [
      {
        title: "Regulatory ambiguity",
        body: "Lorem ipsum: founders get stuck translating risk into compliant execution. Insert Value Prop Here for clarity and cadence.",
      },
      {
        title: "Slow validation loops",
        body: "Lorem ipsum: feedback arrives late and biased. Insert Value Prop Here for clinician/operator signal earlier.",
      },
      {
        title: "Go-to-market complexity",
        body: "Lorem ipsum: procurement, reimbursement, and trust require sequencing. Insert Value Prop Here for a real path to market.",
      },
    ],
    [],
  )

  const solution = useMemo(
    () => [
      {
        title: "Milestone-led execution",
        body: "Lorem ipsum: define what ‘good’ looks like in healthcare and execute in the right order. Insert Value Prop Here.",
        imageUrl:
          "https://images.pexels.com/photos/16323454/pexels-photo-16323454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        span: "wide" as const,
      },
      {
        title: "Clinician + operator reviews",
        body: "Lorem ipsum: tighten the loop with people who’ve shipped inside the system. Insert Value Prop Here.",
        imageUrl:
          "https://images.pexels.com/photos/7414217/pexels-photo-7414217.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        title: "Reg-ready foundations",
        body: "Lorem ipsum: map obligations early and avoid rework. Insert Value Prop Here.",
        imageUrl:
          "https://images.pexels.com/photos/7495604/pexels-photo-7495604.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
        title: "Introductions that convert",
        body: "Lorem ipsum: meet the right experts and partners at the right time. Insert Value Prop Here.",
        imageUrl:
          "https://images.pexels.com/photos/7414108/pexels-photo-7414108.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        span: "wide" as const,
      },
    ],
    [],
  )

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
                <h1 className="mt-8 text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-[#f7efe5]">
                  The Launchpad
                  <br />
                  for health tech founders
                </h1>
                <p className="mt-6 font-urbanist text-white/80 text-lg md:text-2xl leading-snug">
                  Lorem ipsum for venture building: Insert Value Prop Here—move faster through regulatory complexity,
                  validation, and commercialization.
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
              Lorem ipsum: health-tech startups get punished for moving either too slowly or too recklessly. Insert Value
              Prop Here.
            </p>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <ProblemBlock items={friction} />
            </Reveal>
          </div>
        </SectionShell>

        {/* Solution */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The Rellia solution</h2>
            <p className="mt-4 font-urbanist text-white/75 text-lg leading-relaxed max-w-2xl">
              Lorem ipsum: Insert Value Prop Here—turn uncertainty into a sequence of credible milestones.
            </p>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <BentoGrid items={solution} />
            </Reveal>
          </div>
        </SectionShell>

        {/* Process */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Path to success</h2>
            <p className="mt-4 font-urbanist text-white/75 text-lg leading-relaxed max-w-2xl">
              Lorem ipsum: Insert Value Prop Here—tight loops, clear decisions, measurable progress.
            </p>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <PathToSuccess
                steps={[
                  { title: "Clarify", body: "Lorem ipsum: align on the next milestone and define what proof looks like." },
                  { title: "Validate", body: "Lorem ipsum: get fast, high-signal feedback from the right experts." },
                  { title: "De-risk", body: "Lorem ipsum: build reg-ready foundations without slowing execution." },
                  { title: "Launch", body: "Lorem ipsum: reach market with confidence and momentum." },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>

        {/* Unique: Milestones roadmap */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The Milestones We Hit Together</h2>
            <p className="mt-4 font-urbanist text-white/75 text-lg leading-relaxed max-w-2xl">
              Lorem ipsum: a roadmap that keeps everyone aligned—MVP → Clinical Trial → Commercialization.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "MVP", body: "Lorem ipsum: scope, prototype, interoperability decisions. Insert Value Prop Here." },
              { title: "Clinical Trial", body: "Lorem ipsum: pilots, evidence, usability, compliance. Insert Value Prop Here." },
              { title: "Commercialization", body: "Lorem ipsum: pricing, procurement, go-to-market. Insert Value Prop Here." },
            ].map((c) => (
              <Reveal key={c.title} delay={0.05}>
                <GlassCard className="p-7">
                  <p className="font-host-grotesk text-xl font-semibold tracking-tight text-white">{c.title}</p>
                  <p className="mt-3 font-urbanist text-white/75 leading-relaxed">{c.body}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </SectionShell>

        {/* TeamMemberCard reuse (light section so card stays readable) */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-[1300px] mx-auto">
            <Reveal>
              <h2 className="text-black text-3xl md:text-4xl font-bold tracking-tight">Meet the team</h2>
              <p className="mt-4 font-urbanist text-black/70 text-lg leading-relaxed max-w-2xl">
                Lorem ipsum: Insert Value Prop Here—operators and clinicians who’ve shipped inside healthcare.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Megan Kane",
                  role: "Executive Director, Co-Founder",
                  bio: "Insert Value Prop Here. Lorem ipsum advisor-level credibility.",
                  imageSrc: "/images/team-megankane.jpg",
                },
                {
                  name: "Deena Al-Sammak",
                  role: "Program Manager, Co-Founder",
                  bio: "Insert Value Prop Here. Lorem ipsum execution and systems.",
                  imageSrc: "/images/team-deenasammak.png",
                },
                {
                  name: "Khali Abdi",
                  role: "User Experience, Community Strategy Manager",
                  bio: "Insert Value Prop Here. Lorem ipsum clinical rigor.",
                  imageSrc: "/images/team-abdi.JPG",
                },
              ].map((t) => (
                <div key={t.name}>
                  <TeamMemberCard
                    name={t.name}
                    role={t.role}
                    bio={t.bio}
                    imageSrc={t.imageSrc}
                    bioOpen={openBioName === t.name}
                    onBioOpenChange={(next) => setOpenBioName(next ? t.name : null)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Signup */}
        <SectionShell className="py-16 md:py-24" >
          <div id="signup" className="scroll-mt-28">
            <Reveal>
              <MultiStepSignupForm
                ctaLabel="Apply for the Next Cohort"
                roleLabel="Founder"
                step2Fields={[
                  { name: "company", label: "Company / Project", placeholder: "Insert Value Prop Here Labs" },
                  { name: "stage", label: "Stage", placeholder: "Idea / MVP / Pilot / Revenue" },
                  { name: "focus", label: "Focus area", placeholder: "Digital health, med device, diagnostics…" },
                  { name: "timeline", label: "Target launch timeline", placeholder: "e.g. 6–12 months" },
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

