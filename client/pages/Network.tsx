import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LogoMarquee from "@/components/LogoMarquee"
import ScrollReveal from "@/components/ScrollReveal"
import NetworkJumpNav from "@/components/NetworkJumpNav"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import InvestorNotifyDialog from "@/components/network/InvestorNotifyDialog"
import { cn } from "@/lib/utils"
import { ArrowRight, Check } from "lucide-react"
import { PAGE_HEADER_DARK_SUBTITLE_CLASS, PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"

const CTA = {
  founder: "/contact",
  investorNotify: "/contact",
  investorContact: "/contact",
  advisor: "/contact",
  partner: "/contact",
} as const

/** Oversized section numeral — absolutely positioned so it doesn't push the body copy down. */
function SectionNumeral({ value }: { value: string }) {
  return (
    <span
      aria-hidden
      className="hidden md:block pointer-events-none absolute top-12 right-6 md:right-10 lg:right-16 font-host-grotesk text-[140px] lg:text-[180px] font-extrabold leading-none tracking-tighter text-rellia-teal/[0.08] select-none"
    >
      {value}
    </span>
  )
}

/** Section tag — Network impact pill (not SectionPillBadge). */
function SectionTag({ children }: { children: string }) {
  return <NetworkEyebrow label={children} tone="onLight" />
}

/** Bullet item used inside the section feature lists. */
function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rellia-mint/30">
        <Check className="h-3 w-3 text-rellia-teal" strokeWidth={3} />
      </span>
      <span className="font-urbanist text-base md:text-[17px] leading-relaxed text-black/75">
        {children}
      </span>
    </li>
  )
}

export default function Network() {
  const [isInvestorNotifyOpen, setIsInvestorNotifyOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        {/* ───────────────────────────── HERO ───────────────────────────── */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-28 bg-rellia-teal overflow-hidden">
          {/* Background image */}
          <img
            src="/images/network-hero.png"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center select-none"
          />

          {/* Softer teal wash so image stays visible */}
          <div aria-hidden className="absolute inset-0 bg-rellia-teal/25" />

          {/* Left-to-right gradient — extra contrast under the headline */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-rellia-teal/75 via-rellia-teal/35 to-rellia-teal/20"
          />

          {/* Decorative grid lines — modernist structure cue */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <h1
                className={cn(
                  "text-white font-bold leading-tight tracking-tight",
                  PAGE_HEADER_TITLE_SIZE_CLASS,
                )}
              >
                The Rellia <br />
                <span className="relative inline-block align-bottom">
                  <span className="text-white" aria-hidden>
                    Network
                  </span>
                  <span className="absolute left-0 top-0 whitespace-nowrap text-rellia-mint motion-safe:animate-healthcare-fill motion-reduce:clip-path-none">
                    Network
                  </span>
                </span>
              </h1>

              <p className={cn(PAGE_HEADER_DARK_SUBTITLE_CLASS, "mt-8 max-w-2xl")}>
                Built for the people building the future of health.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <NetworkJumpNav
                mode="samePage"
                className="mt-[calc(theme(spacing.12)+15px)] md:mt-[calc(theme(spacing.16)+15px)]"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* ─────────────────────────── 01 · FOUNDERS ─────────────────────── */}
        <section
          id="founders"
          className="relative scroll-mt-24 md:scroll-mt-28 bg-white py-20 md:py-32 overflow-hidden"
        >
          <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">
            <SectionNumeral value="01" />

            <ScrollReveal>
              <SectionTag>Founders</SectionTag>
              <h2 className="mt-5 text-black text-3xl md:text-[40px] font-bold tracking-tight leading-[1.05] max-w-3xl">
                Are you building in <span className="text-rellia-teal">health tech?</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-6 md:mt-8 text-black/70 text-lg md:text-xl font-urbanist leading-relaxed max-w-3xl">
                Rellia is for founders who are serious about building in health tech. Whether you're working on
                digital health, a medical device, diagnostics, or a wellness product, and whether your customer is a
                hospital system or a patient at home, if you're solving a real problem in healthcare, you belong here.
              </p>
            </ScrollReveal>

            <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
              <ScrollReveal delay={0.15}>
                <div className="rounded-3xl border border-black/[0.08] bg-rellia-cream/40 p-8 md:p-10 h-full">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                    We welcome founders who are
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Committed to building their company, not casually exploring ideas</CheckItem>
                    <CheckItem>Technical, clinical, or commercially experienced</CheckItem>
                    <CheckItem>At any stage — idea, prototype, early users, or paying customers</CheckItem>
                    <CheckItem>Incorporated or not, funded or not, raising or not</CheckItem>
                    <CheckItem>Located anywhere in the world</CheckItem>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="rounded-3xl border border-rellia-teal/15 bg-white p-8 md:p-10 h-full shadow-sm">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                    What you'll get
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Clear, tangible outcomes. No fluff.</CheckItem>
                    <CheckItem>Direct access to domain experts who've been where you are</CheckItem>
                    <CheckItem>Guidance that will meaningfully improve your ability to raise funds</CheckItem>
                    <CheckItem>An efficient, high-signal experience that respects your time</CheckItem>
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.25}>
              <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-black/10 pt-10">
                <p className="font-urbanist text-base md:text-lg text-black/60 max-w-xl">
                  Applications are required. <span className="text-rellia-teal font-semibold">Membership is selective.</span>
                </p>
                <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable">
                  <Link to="/apply" aria-label="Apply to join the Rellia Network">
                    Apply to Join
                    <ArrowRight />
                  </Link>
                </RelliaAction>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Marquee — sits between Founders and Investors as the proof strip */}
        <LogoMarquee
          showHeading
          sectionClassName="py-10 md:py-14"
          title={
            <>
              Our <span className="text-rellia-teal">Portfolio</span> Companies
            </>
          }
        />

        {/* ─────────────────────────── 02 · ADVISORS ─────────────────────── */}
        <section
          id="advisors"
          className="relative scroll-mt-24 md:scroll-mt-28 bg-white py-20 md:py-32 overflow-hidden"
        >
          <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">
            <SectionNumeral value="02" />

            <ScrollReveal>
              <SectionTag>Advisors</SectionTag>
              <h2 className="mt-5 text-black text-3xl md:text-[40px] font-bold tracking-tight leading-[1.05] max-w-3xl">
                Some people are just wired to help others succeed.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-6 md:mt-8 text-black/70 text-lg md:text-xl font-urbanist leading-relaxed max-w-3xl">
                Rellia advisors are experienced operators, clinicians, executives, and specialists who want to stay
                connected to health tech innovation and support founders they believe in. If you've spent your career in
                healthcare, sharing your experience can change someone's trajectory
              </p>
            </ScrollReveal>

            <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-14 items-start">
              <ScrollReveal delay={0.15}>
                <div className="rounded-3xl border border-black/[0.08] bg-rellia-cream/50 p-8 md:p-10">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                    What to expect
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Structured, high-quality engagements — not open-ended commitments</CheckItem>
                    <CheckItem>Maximum impact with minimum time investment</CheckItem>
                    <CheckItem>Meaningful interactions with serious, vetted founders</CheckItem>
                    <CheckItem>A front-row seat to the latest advancements in digital health</CheckItem>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="relative rounded-3xl border-2 border-rellia-teal bg-rellia-teal text-white p-8 md:p-10 overflow-hidden">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                      backgroundSize: "60px 60px",
                    }}
                  />
                  <div className="relative">
                    <span className="font-host-grotesk text-xs font-semibold uppercase tracking-[0.18em] text-rellia-mint">
                      A note on your time
                    </span>
                    <p className="mt-5 font-urbanist text-lg md:text-xl leading-relaxed text-white/90">
                      Your time is valuable. Mentorship at Rellia is a volunteer role, and we
                      respect that completely.
                    </p>
                    <p className="mt-4 font-urbanist text-base leading-relaxed text-white/70">
                      You'll have full flexibility over your level of involvement. Engage as much or as little as your
                      schedule allows.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.25}>
              <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-black/10 pt-10">
                <p className="font-urbanist text-base md:text-lg text-black/60 max-w-xl">
                  The founders in our community are the kind of people worth showing up for. Let's find your match.
                </p>
                <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable">
                  <Link to="/apply" aria-label="Apply to join the Rellia Network">
                    Apply to Join
                    <ArrowRight />
                  </Link>
                </RelliaAction>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─────────────────────────── 03 · INVESTORS ────────────────────── */}
        <section
          id="investors"
          className="relative scroll-mt-24 md:scroll-mt-28 bg-rellia-cream/40 py-20 md:py-32 overflow-hidden"
        >
          <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">
            <SectionNumeral value="03" />

            <ScrollReveal>
              <SectionTag>Investors</SectionTag>
              <h2 className="mt-5 text-black text-3xl md:text-[40px] font-bold tracking-tight leading-[1.05] max-w-3xl">
                Stop sorting through cold pitch decks.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-6 md:mt-8 text-black/70 text-lg md:text-xl font-urbanist leading-relaxed max-w-3xl">
                Rellia surfaces health tech founders worth your attention: vetted, prepared, and supported by advisors
                with real industry experience. By the time they reach you, they've already done the hard work of
                validating their assumptions and sharpening their strategies.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-black/10 bg-black/10">
                {[
                  {
                    n: "I",
                    title: "Individually selected founders",
                    body:
                      "Every founder in our pipeline has been individually selected. We bring you only the most committed and pressure-tested builders that are genuinely worth your time.",
                  },
                  {
                    n: "II",
                    title: "Operator-coached",
                    body:
                      "Founders are coached by operators who've built and scaled in healthcare, not generalist advisors.",
                  },
                  {
                    n: "III",
                    title: "Virtual pitch events",
                    body:
                      "Curated to your portfolio focus and hosted virtually, our pitch events cut straight to the conversations that matter. No travel, no bad drinks, just founders worth meeting.",
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-white p-8 md:p-10 flex flex-col gap-4">
                    <span className="font-host-grotesk text-xs font-semibold tracking-[0.22em] text-rellia-mint">
                      {item.n}
                    </span>
                    <h3 className="font-host-grotesk text-xl md:text-2xl font-bold text-black tracking-tight leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-urbanist text-base leading-relaxed text-black/65">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-black/10 pt-10">
                <p className="font-urbanist text-base md:text-lg text-black/60 max-w-xl">
                  Get early access to founders we're backing before they're on anyone else's radar.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable">
                    <button
                      type="button"
                      aria-label="Get notified about pitch events"
                      aria-haspopup="dialog"
                      onClick={() => setIsInvestorNotifyOpen(true)}
                    >
                      Get Notified About Pitch Events
                      <ArrowRight />
                    </button>
                  </RelliaAction>
                  <RelliaAction asChild variant="relliaCtaSecondary" size="comfortable">
                    <Link to={CTA.investorContact}>
                      Contact Us Directly
                    </Link>
                  </RelliaAction>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─────────────────────────── 04 · INDUSTRY PARTNERS ────────────── */}
        <section
          id="partners"
          className="relative scroll-mt-24 md:scroll-mt-28 bg-rellia-cream/40 py-20 md:py-32 overflow-hidden"
        >
          <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">
            <SectionNumeral value="04" />

            <ScrollReveal>
              <SectionTag>Industry Partners</SectionTag>
              <h2 className="mt-5 text-black text-3xl md:text-[40px] font-bold tracking-tight leading-[1.05] max-w-3xl">
                Reach the health tech founders <span className="text-rellia-teal">who need you.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-6 md:mt-8 text-black/70 text-lg md:text-xl font-urbanist leading-relaxed max-w-3xl">
                If your clients are early-stage health tech companies, Rellia is where they live. The founders in our
                community trust what we recommend, and we are always looking for the best resources to put in front of
                them.
              </p>
            </ScrollReveal>

            <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
              <ScrollReveal delay={0.15}>
                <div className="rounded-3xl border border-black/[0.08] bg-white p-8 md:p-10 h-full shadow-sm">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                    Great fits include
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Legal, intellectual property, or privacy counsel</CheckItem>
                    <CheckItem>Consultants and strategy advisors</CheckItem>
                    <CheckItem>Contract manufacturing and design services</CheckItem>
                    <CheckItem>Contract research organizations (CROs)</CheckItem>
                    <CheckItem>Any organization who works to help health tech founders succeed</CheckItem>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="rounded-3xl border border-black/[0.08] bg-white p-8 md:p-10 h-full shadow-sm">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                    Partnership options
                  </h3>
                  <div className="mt-6 space-y-6">
                    <div className="border-l-2 border-rellia-mint pl-5">
                      <p className="font-host-grotesk text-lg md:text-xl font-bold text-black tracking-tight">
                        Sponsor a Program or Event
                      </p>
                      <p className="mt-2 font-urbanist text-base leading-relaxed text-black/65">
                        Participate in a program or event directly relevant to your business. Position yourself as a
                        subject matter expert, not just a logo.
                      </p>
                    </div>
                    <div className="border-l-2 border-rellia-teal pl-5">
                      <p className="font-host-grotesk text-lg md:text-xl font-bold text-black tracking-tight">
                        Become Part of the Community
                      </p>
                      <p className="mt-2 font-urbanist text-base leading-relaxed text-black/65">
                        Become a familiar face in the community. Annual partners get personalized introductions to
                        founders who are actively looking for exactly what they offer.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.25}>
              <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-black/10 pt-10">
                <p className="font-urbanist text-base md:text-lg text-black/60 max-w-xl">
                  Put your brand in front of founders at the exact moment they're making decisions about who to work
                  with.
                </p>
                <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable">
                  <Link to="/apply" aria-label="Apply to join the Rellia Network">
                    Apply to Join
                    <ArrowRight />
                  </Link>
                </RelliaAction>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div id="how-they-work-together" className="scroll-mt-24 md:scroll-mt-28">
          <RelliaCta
            title="One **network**. Four **doors** in."
            body="Founders, advisors, investors, and industry partners all showing up for the same reason - to move health innovation forward. That's what this community here for."
            primary={{ label: "Learn About Rellia", to: "/about" }}
            secondary={{ label: "Not sure where you fit? Contact us!", to: "/contact" }}
          />
        </div>
      </main>

      <Footer />

      <InvestorNotifyDialog open={isInvestorNotifyOpen} onOpenChange={setIsInvestorNotifyOpen} />
    </div>
  )
}
