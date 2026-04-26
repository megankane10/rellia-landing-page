import { useState } from "react"
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
  "https://images.pexels.com/photos/8424459/pexels-photo-8424459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

function ChartPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/5 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{label}</p>
      <div className="mt-4 h-24 w-full rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10" />
    </div>
  )
}

export default function Investors() {
  const [openBioName, setOpenBioName] = useState<string | null>(null)

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
                  The Portfolio
                  <br />
                  you’ll be proud to back
                </h1>
                <p className="mt-6 font-urbanist text-white/80 text-lg md:text-2xl leading-snug">
                  Lorem ipsum: Insert Value Prop Here—meet de-risked teams with clearer traction paths inside healthcare.
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
              Lorem ipsum: investors waste time on low-signal decks and late clarity. Insert Value Prop Here.
            </p>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <ProblemBlock
                items={[
                  { title: "Noisy inbound", body: "Lorem ipsum: too many decks, too little proof." },
                  { title: "Hidden risk", body: "Lorem ipsum: regulatory, clinical, and GTM risks surface too late." },
                  { title: "Team ambiguity", body: "Lorem ipsum: hard to gauge execution quality early." },
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
                    title: "Vetted teams",
                    body: "Lorem ipsum: founders coached by operators/clinicians.",
                    imageUrl:
                      "https://images.pexels.com/photos/8424459/pexels-photo-8424459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                    span: "wide",
                  },
                  {
                    title: "De-risked story",
                    body: "Lorem ipsum: evidence-minded validation narrative.",
                    imageUrl:
                      "https://images.pexels.com/photos/7414207/pexels-photo-7414207.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                  },
                  {
                    title: "Thesis alignment",
                    body: "Lorem ipsum: introductions matched to your focus.",
                    imageUrl:
                      "https://images.pexels.com/photos/9034760/pexels-photo-9034760.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                  },
                  {
                    title: "Operator support",
                    body: "Lorem ipsum: execution quality improves before you meet.",
                    imageUrl:
                      "https://images.pexels.com/photos/8555674/pexels-photo-8555674.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
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
                  { title: "Signal", body: "Lorem ipsum: curated teams aligned to your thesis." },
                  { title: "Assess", body: "Lorem ipsum: clearer proof and de-risking signals." },
                  { title: "Meet", body: "Lorem ipsum: high-quality conversations that move forward." },
                  { title: "Support", body: "Lorem ipsum: founders keep compounding after the meeting." },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>

        {/* Unique: Investment thesis */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Investment Thesis</h2>
            <p className="mt-4 font-urbanist text-white/75 text-lg leading-relaxed max-w-2xl">
              Lorem ipsum: placeholders for Market Size, Growth Rate, and Exit Potential. Insert Value Prop Here.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Reveal delay={0.05}>
              <ChartPlaceholder label="Market size" />
            </Reveal>
            <Reveal delay={0.08}>
              <ChartPlaceholder label="Growth rate" />
            </Reveal>
            <Reveal delay={0.11}>
              <ChartPlaceholder label="Exit potential" />
            </Reveal>
          </div>
        </SectionShell>

        {/* TeamMemberCard reuse: Founding team trust section */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-[1300px] mx-auto">
            <Reveal>
              <h2 className="text-black text-3xl md:text-4xl font-bold tracking-tight">The founding team</h2>
              <p className="mt-4 font-urbanist text-black/70 text-lg leading-relaxed max-w-2xl">
                Lorem ipsum: Insert Value Prop Here—trust is earned, and teams matter most.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Megan Kane",
                  role: "Executive Director, Co-Founder",
                  bio: "Insert Value Prop Here. Lorem ipsum operator credibility.",
                  imageSrc: "/images/team-megankane.jpg",
                },
                {
                  name: "Deena Al-Sammak",
                  role: "Program Manager, Co-Founder",
                  bio: "Insert Value Prop Here. Lorem ipsum technical rigor.",
                  imageSrc: "/images/team-deenasammak.png",
                },
                {
                  name: "Khali Abdi",
                  role: "User Experience, Community Strategy Manager",
                  bio: "Insert Value Prop Here. Lorem ipsum clinical validation.",
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
        <SectionShell className="py-16 md:py-24">
          <div id="signup" className="scroll-mt-28">
            <Reveal>
              <MultiStepSignupForm
                ctaLabel="Access the Data Room"
                roleLabel="Investor"
                step2Fields={[
                  { name: "firm", label: "Firm", placeholder: "Insert Value Prop Here Capital" },
                  { name: "thesis", label: "Investment thesis", placeholder: "Digital health, med device, etc." },
                  { name: "check", label: "Typical check size", placeholder: "$250k – $2M" },
                  { name: "geography", label: "Geography", placeholder: "North America / Global" },
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

