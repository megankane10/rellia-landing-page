import PageHeader from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import SectionPillBadge from "@/components/SectionPillBadge"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"
import { CreamSection, GlassCardLight, LightSection, Reveal } from "./_shared"

const ENGAGEMENT = [
  {
    title: "Join directory",
    body: "List your organization so founders can discover the right integration, pilot, and procurement paths.",
    to: "/industry-partners/directory",
    cta: "Open directory",
  },
  {
    title: "Sponsor",
    body: "Put your brand behind programs and events where execution-quality teams spend their time.",
    to: "/contact",
    cta: "Talk sponsorship",
  },
  {
    title: "Become a partner",
    body: "Co-design pilots, APIs, and enterprise handoffs with a community that treats adoption as the product.",
    to: "/contact",
    cta: "Start a conversation",
  },
] as const

const BENEFITS = [
  "Pilot-ready founders with clearer scope and success metrics",
  "Structured introductions to technical and clinical leaders",
  "Shared language on security, compliance, and deployment",
  "Credibility inside a network built for health system reality",
  "Long-term relationships—not one-off vendor fairs",
] as const

export default function Partners() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title={
            <>
              Industry partners for <span className="text-rellia-mint">real adoption</span>
            </>
          }
          subtitle="Pilot design, integration support, and enterprise credibility—so promising products don’t die in procurement limbo."
          variant="dark"
        />

        <LightSection className="pt-10 md:pt-14">
          <Reveal>
            <SectionPillBadge>Engage</SectionPillBadge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">Three ways to work with Rellia</h2>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              Large cards, clear intent—pick the path that matches how your team likes to start.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {ENGAGEMENT.map((card, idx) => (
              <Reveal key={card.title} delay={0.06 * idx}>
                <Link
                  to={card.to}
                  className="group block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2"
                >
                  <GlassCardLight className="flex h-full min-h-[280px] flex-col p-8 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-rellia-mint/50 group-hover:shadow-[0_24px_80px_-40px_rgba(13,53,64,0.35)]">
                    <h3 className="font-host-grotesk text-2xl font-semibold tracking-tight text-rellia-teal">{card.title}</h3>
                    <p className="mt-4 flex-1 font-urbanist leading-relaxed text-black/70">{card.body}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal">
                      {card.cta}
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </GlassCardLight>
                </Link>
              </Reveal>
            ))}
          </div>
        </LightSection>

        <CreamSection>
          <Reveal>
            <SectionPillBadge>Benefits</SectionPillBadge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">Benefits of partnering</h2>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              What partners tell us they value most once programs are underway.
            </p>
          </Reveal>
          <ul className="mt-10 max-w-2xl space-y-4" aria-label="Partner benefits">
            {BENEFITS.map((line, idx) => (
              <Reveal key={line} delay={0.04 * idx}>
                <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-mint/35">
                    <Check className="h-3.5 w-3.5 text-rellia-teal" strokeWidth={3} aria-hidden />
                  </span>
                  {line}
                </li>
              </Reveal>
            ))}
          </ul>
        </CreamSection>

        <LightSection>
          <Reveal>
            <GlassCardLight className="relative overflow-hidden px-8 py-10 md:px-12 md:py-14">
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rellia-mint/25 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-rellia-teal/10 blur-3xl" />
              <div className="relative max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-rellia-teal md:text-4xl">Get in touch</h2>
                <p className="mt-4 font-urbanist text-lg leading-relaxed text-black/70">
                  Tell us about your organization, integration surface area, and the founder profiles you want to see more
                  of. We&apos;ll route you to the right partner lead.
                </p>
                <RelliaAction asChild variant="tealFilledLift" size="comfortable" className="mt-8">
                  <Link to="/contact" aria-label="Go to contact page">
                    Contact Rellia
                  </Link>
                </RelliaAction>
              </div>
            </GlassCardLight>
          </Reveal>
        </LightSection>
      </main>

      <Footer />
    </div>
  )
}
