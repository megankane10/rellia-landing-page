import { useState } from "react"
import { PAGE_HEADER_DARK_SUBTITLE_CLASS, PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
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
  "https://images.pexels.com/photos/6129443/pexels-photo-6129443.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

export default function Advisors() {
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
                <h1
                  className={`mt-8 text-white font-bold leading-tight tracking-tight ${PAGE_HEADER_TITLE_SIZE_CLASS}`}
                >
                  The Brain Trust
                  <br />
                  for health tech builders
                </h1>
                <p className={cn(PAGE_HEADER_DARK_SUBTITLE_CLASS, "mt-6")}>
                  Lorem ipsum: Insert Value Prop Here—structured mentorship, sharp questions, and high-signal community.
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
              Lorem ipsum: high-quality mentorship is fragmented, unstructured, and hard to route to the right founders.
              Insert Value Prop Here.
            </p>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <ProblemBlock
                items={[
                  { title: "Low signal requests", body: "Lorem ipsum: constant cold asks with unclear outcomes." },
                  { title: "No shared context", body: "Lorem ipsum: advice without domain context risks harm." },
                  { title: "Time-cost mismatch", body: "Lorem ipsum: helping should feel energizing, not draining." },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>

        {/* Solution */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">The Rellia solution</h2>
            <p className="mt-4 font-urbanist text-white/75 text-lg leading-relaxed max-w-2xl">
              Lorem ipsum: Insert Value Prop Here—structured matches, clear outcomes, and a network worth your time.
            </p>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.1}>
              <BentoGrid
                items={[
                  {
                    title: "Curated matches",
                    body: "Lorem ipsum: founders who need your exact expertise.",
                    imageUrl:
                      "https://images.pexels.com/photos/5327649/pexels-photo-5327649.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                    span: "wide",
                  },
                  {
                    title: "Structured engagements",
                    body: "Lorem ipsum: finite scope, clear goals, measurable outcomes.",
                    imageUrl:
                      "https://images.pexels.com/photos/6129443/pexels-photo-6129443.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                  },
                  {
                    title: "High-caliber peers",
                    body: "Lorem ipsum: meet other MDs/PhDs/operators you’ll respect.",
                    imageUrl:
                      "https://images.pexels.com/photos/6129679/pexels-photo-6129679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                  },
                  {
                    title: "Signal-rich community",
                    body: "Lorem ipsum: fewer asks, more outcomes.",
                    imageUrl:
                      "https://images.pexels.com/photos/6129679/pexels-photo-6129679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
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
                  { title: "Share", body: "Lorem ipsum: tell us your expertise and boundaries." },
                  { title: "Match", body: "Lorem ipsum: we route you to the right founders." },
                  { title: "Advise", body: "Lorem ipsum: high-impact sessions, clear outcomes." },
                  { title: "Compound", body: "Lorem ipsum: repeatable insight with a trusted network." },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>

        {/* Unique: Advisory perks */}
        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Advisory Perks</h2>
            <p className="mt-4 font-urbanist text-white/75 text-lg leading-relaxed max-w-2xl">
              Lorem ipsum: access to early-stage IP, networking with other top-tier MDs/PhDs, and a front-row seat to
              what’s coming next. Insert Value Prop Here.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Early signal", body: "Lorem ipsum: see emerging clinical workflows and new product shapes." },
              { title: "Peer network", body: "Lorem ipsum: meet other advisors you actually want to know." },
              { title: "Meaningful impact", body: "Lorem ipsum: help founders avoid mistakes that stall progress." },
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

        {/* TeamMemberCard reuse: heavyweight advisors */}
        <section className="bg-white py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-[1300px] mx-auto">
            <Reveal>
              <h2 className="text-black text-3xl md:text-4xl font-bold tracking-tight">Heavyweight advisors</h2>
              <p className="mt-4 font-urbanist text-black/70 text-lg leading-relaxed max-w-2xl">
                Lorem ipsum: Insert Value Prop Here—people who’ve done the work, shipped the thing, and learned the hard lessons.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Megan Kane",
                  role: "Executive Director, Co-Founder",
                  bio: "Insert Value Prop Here. Lorem ipsum credential and outcomes.",
                  imageSrc: "/images/team-megankane.jpg",
                },
                {
                  name: "Deena Al-Sammak",
                  role: "Program Manager, Co-Founder",
                  bio: "Insert Value Prop Here. Lorem ipsum clinical signal.",
                  imageSrc: "/images/team-deenasammak.png",
                },
                {
                  name: "Khali Abdi",
                  role: "User Experience, Community Strategy Manager",
                  bio: "Insert Value Prop Here. Lorem ipsum execution and systems.",
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
                ctaLabel="Request an Invitation to the Network"
                roleLabel="Advisor"
                step2Fields={[
                  { name: "expertise", label: "Area of expertise", placeholder: "Regulatory, clinical ops, GTM…" },
                  { name: "availability", label: "Availability", placeholder: "e.g. 1–2 hours/month" },
                  { name: "linkedin", label: "LinkedIn / Website", placeholder: "https://…" },
                  { name: "interests", label: "Interests", placeholder: "Med device, digital health, AI, etc." },
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

