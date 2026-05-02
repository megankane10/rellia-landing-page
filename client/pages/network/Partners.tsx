import type { LucideIcon } from "lucide-react"
import { usePexelsPhoto } from "@/hooks/usePexelsPhoto"
import PageHeader from "@/components/PageHeader"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import SectionHeading from "@/components/SectionHeading"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import ScrollReveal from "@/components/ScrollReveal"
import { GETPROVEN_VENDORS_GRID_URL } from "@/config/partnerLinks"
import { ArrowRight, Check, ExternalLink, Handshake, LayoutGrid, Megaphone } from "lucide-react"
import { Link } from "react-router-dom"
import RelliaCta from "@/components/RelliaCta"
import { CreamSection, GlassCardLight, LightSection, Reveal } from "./_shared"

const engagementCardClass =
  "group flex min-h-[240px] flex-col rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-md transition-colors duration-300 hover:border-rellia-mint/40 hover:bg-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal"

type EngagementItem =
  | {
      title: string
      body: string
      cta: string
      icon: LucideIcon
      to: string
    }
  | {
      title: string
      body: string
      cta: string
      icon: LucideIcon
      href: string
      external: true
    }

const GETPROVEN_BENEFITS = [
  "Independent vendor marketplace—VC-grade firms use Proven to centralize vendor libraries instead of scattered spreadsheets",
  "Portfolio companies access exclusive vendor deals with redemption tracking so savings stay visible",
  "Pre-vetted service providers and verified references reduce bad-fit spend across tools and services",
  "Analytics on what portfolio companies search for and adopt—so recommendations stay grounded in usage data",
  "Community features let portcos share vendor experiences and discover trusted providers faster",
] as const

const ENGAGEMENT: readonly EngagementItem[] = [
  {
    title: "Join directory",
    body: "List your organization so founders can discover the right integration, pilot, and procurement paths.",
    href: GETPROVEN_VENDORS_GRID_URL,
    external: true,
    cta: "Open directory",
    icon: LayoutGrid,
  },
  {
    title: "Sponsor",
    body: "Put your brand behind programs and events where execution-quality teams spend their time.",
    to: "/contact",
    cta: "Talk sponsorship",
    icon: Megaphone,
  },
  {
    title: "Become a partner",
    body: "Co-design pilots, APIs, and enterprise handoffs with a community that treats adoption as the product.",
    to: "/contact",
    cta: "Start a conversation",
    icon: Handshake,
  },
]

const BENEFITS = [
  "Pilot-ready founders with clearer scope and success metrics",
  "Structured introductions to technical and clinical leaders",
  "Shared language on security, compliance, and deployment",
  "Credibility inside a network built for health system reality",
  "Long-term relationships—not one-off vendor fairs",
] as const

/** Teal band + glass link cards — aligned with homepage How It Works rhythm */
function PartnerEngageTealBand() {
  return (
    <section className="relative w-full overflow-hidden bg-rellia-teal px-6 py-16 md:px-10 md:py-24">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 top-6 w-[320px] max-w-[55vw] opacity-[0.06] md:right-0 md:top-4 md:w-[420px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-[420px] w-[420px] rounded-full bg-rellia-mint/22 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-rellia-mint/16 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.14),transparent_52%),radial-gradient(circle_at_75%_40%,rgba(157,214,208,0.12),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <NetworkEyebrow label="Engage" tone="onDark" />
          <h2 className="mt-5 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]">
            Three ways to <span className="text-rellia-mint">work with Rellia</span>
          </h2>
          <p className="mt-4 max-w-2xl font-urbanist text-base font-medium leading-relaxed text-white/80 md:text-lg">
            Large cards, clear intent—pick the path that matches how your team likes to start.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3 lg:gap-6">
            {ENGAGEMENT.map((card) => {
              const Icon = card.icon
              const inner = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rellia-mint/35 text-rellia-teal transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-host-grotesk text-xl font-semibold tracking-tight text-white">{card.title}</h3>
                  <p className="mt-4 flex-1 font-urbanist leading-relaxed text-white/85">{card.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-mint">
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </>
              )
              return "href" in card ? (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={engagementCardClass}
                >
                  {inner}
                </a>
              ) : (
                <Link key={card.title} to={card.to} className={engagementCardClass}>
                  {inner}
                </Link>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function BenefitsWithImageSplit() {
  const img = usePexelsPhoto({
    query: "business partnership handshake modern office",
    fallbackUrl: "/images/metrics-bg-pexels-2.jpg",
    orientation: "landscape",
  })

  return (
    <CreamSection>
      <div className="grid gap-12 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-16">
        <Reveal>
          <NetworkEyebrow label="Benefits" tone="onLight" />
          <SectionHeading
            animated={false}
            title="Why partners stay"
            description="What partners tell us they value most once programs are underway."
            className="mt-5"
          />
          <ul className="mt-10 max-w-xl space-y-4" aria-label="Partner benefits">
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
        </Reveal>
        <Reveal delay={0.06}>
          <div className="overflow-hidden rounded-2xl border border-rellia-teal/15 shadow-[0_28px_80px_-48px_rgba(13,53,64,0.45)]">
            <img
              src={img}
              alt="Partners collaborating in a professional setting"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </CreamSection>
  )
}

function GetProvenSplit() {
  return (
    <LightSection className="bg-rellia-cream/15">
      <div className="flex flex-col">
        <Reveal>
          <div className="max-w-3xl">
            <img
              src="/images/getproven-wordmark.png"
              alt="GetProven"
              width={420}
              height={80}
              className="h-auto w-full max-w-[min(100%,380px)] object-contain object-left md:max-w-[420px]"
              loading="lazy"
              decoding="async"
            />
            <h2 className="mt-6 font-host-grotesk text-3xl font-semibold leading-[1.15] tracking-tight text-black md:mt-8 md:text-[40px] md:leading-[1.12]">
              <span className="text-rellia-teal">Prove the savings</span> your portfolio is leaving on the table
            </h2>
            <p className="mt-4 font-urbanist text-base font-medium leading-relaxed text-black/70 md:text-lg">
              Centralize vendors, surface exclusive deals, and track redemptions—so VC and PE firms see savings instead of
              scattered spreadsheets.
            </p>
          </div>
        </Reveal>
        <ul className="mt-10 max-w-3xl space-y-4" aria-label="GetProven benefits">
          {GETPROVEN_BENEFITS.map((line, idx) => (
            <Reveal key={line.slice(0, 40)} delay={0.04 * idx}>
              <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-mint/35">
                  <Check className="h-3.5 w-3.5 text-rellia-teal" strokeWidth={3} aria-hidden />
                </span>
                {line}
              </li>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <RelliaAction asChild variant="tealFilledLift" size="comfortable">
            <a
              href={GETPROVEN_VENDORS_GRID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2"
            >
              Explore GetProven
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </RelliaAction>
          <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
            <Link
              to="/industry-partners/directory"
              className="inline-flex cursor-pointer items-center gap-2"
              aria-label="Open Rellia industry partners directory"
            >
              Rellia partner directory
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </RelliaAction>
        </div>
      </div>
    </LightSection>
  )
}

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

        <PartnerEngageTealBand />
        <BenefitsWithImageSplit />
        <GetProvenSplit />

        <LightSection>
          <Reveal>
            <GlassCardLight className="relative overflow-hidden px-8 py-10 md:px-12 md:py-14">
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rellia-mint/25 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-rellia-teal/10 blur-3xl" />
              <div className="relative max-w-2xl">
                <NetworkEyebrow label="Next step" tone="onLight" />
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-rellia-teal md:text-4xl">Get in touch</h2>
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

        <RelliaCta
          title="**Partner** with Rellia"
          body="Apply to collaborate or list your org in the directory—founders use both paths to find the right integration and procurement fit."
          primary={{ label: "Apply", to: "/apply" }}
          secondary={{
            label: "Open directory",
            href: GETPROVEN_VENDORS_GRID_URL,
            external: true,
          }}
        />
      </main>

      <Footer />
    </div>
  )
}
