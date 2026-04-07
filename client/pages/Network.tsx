import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LogoMarquee from "@/components/LogoMarquee"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import {
  ArrowRight,
  Check,
  Rocket,
  TrendingUp,
  GraduationCap,
  Building2,
  type LucideIcon,
} from "lucide-react"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"

const SUPPORT_EMAIL = DEFAULT_GLOBAL_SETTINGS.supportEmail

/** Build a mailto: with a subject line tagged for routing on the inbox side. */
const mailto = (subject: string) =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`

const CTA = {
  founder: mailto("Founder application — Rellia Network"),
  investorNotify: mailto("Pitch event notifications — Rellia Network"),
  investorContact: mailto("Investor inquiry — Rellia Network"),
  advisor: mailto("Mentor interest — Rellia Network"),
  partner: mailto("Partnership inquiry — Rellia Network"),
} as const

type SectionId = "founders" | "investors" | "advisors" | "partners"

const JUMP_LINKS: Array<{ id: SectionId; numeral: string; label: string; icon: LucideIcon }> = [
  { id: "founders", numeral: "01", label: "Founders", icon: Rocket },
  { id: "advisors", numeral: "02", label: "Advisors", icon: GraduationCap },
  { id: "investors", numeral: "03", label: "Investors", icon: TrendingUp },
  { id: "partners", numeral: "04", label: "Industry Partners", icon: Building2 },
]

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

/** Section tag pill — matches the FAQ hero badge style (rounded, white/70, backdrop blur). */
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-1 text-xs md:text-sm font-urbanist text-black/60 backdrop-blur">
      {children}
    </span>
  )
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

/** Smooth-scroll to a section, accounting for the fixed navbar height (~92px). */
const handleScrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 92
  window.scrollTo({ top: y, behavior: "smooth" })
}

export default function Network() {
  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main>
        {/* ───────────────────────────── HERO ───────────────────────────── */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-28 bg-rellia-teal overflow-hidden">
          {/* Background photograph */}
          <img
            src="/images/hero-network.png"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center select-none"
          />

          {/* Teal wash for text contrast */}
          <div aria-hidden className="absolute inset-0 bg-rellia-teal/40" />

          {/* Left-to-right gradient — extra contrast under the headline */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-rellia-teal via-rellia-teal/40 to-rellia-teal/30"
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
              <h1 className="text-white text-5xl md:text-7xl lg:text-[88px] font-extrabold leading-[0.95] tracking-tight">
                The Rellia <br />
                <span className="relative inline-block align-bottom">
                  <span className="text-white">Network</span>
                  <span
                    className="absolute left-0 top-0 whitespace-nowrap text-rellia-mint motion-safe:animate-healthcare-fill motion-reduce:clip-path-none"
                    aria-hidden
                  >
                    Network
                  </span>
                </span>
              </h1>

              <p className="mt-8 text-white/85 text-xl md:text-2xl font-urbanist leading-snug max-w-2xl">
                Built for the people building the future of health.
              </p>
            </ScrollReveal>

            {/* Anchor jump nav — four doors */}
            <ScrollReveal delay={0.15}>
              <nav
                aria-label="Jump to section"
                className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/15 border border-white/15 rounded-2xl overflow-hidden"
              >
                {JUMP_LINKS.map(({ id, numeral, label, icon: Icon }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleScrollToId(id)
                    }}
                    className="group flex flex-col gap-3 md:gap-4 lg:gap-5 bg-rellia-teal p-5 md:p-7 lg:p-9 transition-colors hover:bg-rellia-teal/70"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-host-grotesk text-xs lg:text-sm font-semibold tracking-[0.18em] text-rellia-mint">
                        {numeral}
                      </span>
                      <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-rellia-mint/80" strokeWidth={1.75} />
                    </div>
                    <span className="font-host-grotesk text-base md:text-xl lg:text-2xl font-semibold text-white leading-tight">
                      {label}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1 font-urbanist text-[13px] lg:text-sm text-white/70 group-hover:text-rellia-mint transition-colors">
                      Jump to section
                      <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                ))}
              </nav>
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
              <h2 className="mt-5 text-black text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
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
                <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                  <a href={CTA.founder}>
                    Apply to Join as a Founder
                    <ArrowRight />
                  </a>
                </RelliaAction>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Marquee — sits between Founders and Investors as the proof strip */}
        <LogoMarquee />

        {/* ─────────────────────────── 02 · INVESTORS ────────────────────── */}
        <section
          id="investors"
          className="relative scroll-mt-24 md:scroll-mt-28 bg-rellia-cream/40 py-20 md:py-32 overflow-hidden"
        >
          <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">
            <SectionNumeral value="02" />

            <ScrollReveal>
              <SectionTag>Investors</SectionTag>
              <h2 className="mt-5 text-black text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
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
                  <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                    <a href={CTA.investorNotify}>
                      Get Notified About Pitch Events
                      <ArrowRight />
                    </a>
                  </RelliaAction>
                  <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
                    <a href={CTA.investorContact}>
                      Contact Us Directly
                    </a>
                  </RelliaAction>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─────────────────────────── 03 · ADVISORS ─────────────────────── */}
        <section
          id="advisors"
          className="relative scroll-mt-24 md:scroll-mt-28 bg-white py-20 md:py-32 overflow-hidden"
        >
          <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">
            <SectionNumeral value="03" />

            <ScrollReveal>
              <SectionTag>Advisors</SectionTag>
              <h2 className="mt-5 text-black text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
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
                      Every session is designed to be worthwhile — for you and for the founder
                      you're guiding.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.25}>
              <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-black/10 pt-10">
                <p className="font-urbanist text-base md:text-lg text-black/60 max-w-xl">
                  Selective by design. We onboard advisors thoughtfully and match them to the right founders.
                </p>
                <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                  <a href={CTA.advisor}>
                    Express Interest in Mentoring
                    <ArrowRight />
                  </a>
                </RelliaAction>
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
              <h2 className="mt-5 text-black text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
                Reach the health tech founders <span className="text-rellia-teal">who need you.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-6 md:mt-8 text-black/70 text-lg md:text-xl font-urbanist leading-relaxed max-w-3xl">
                Some of the best partners for early-stage health tech founders aren't investors —
                they're the service providers, specialists, and organizations who help them build.
                If your clients are health tech founders, Rellia is where you should be.
              </p>
            </ScrollReveal>

            <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
              <ScrollReveal delay={0.15}>
                <div className="rounded-3xl border border-black/[0.08] bg-white p-8 md:p-10 h-full shadow-sm">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.16em] text-rellia-teal/70">
                    Great fits include
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Legal and regulatory counsel</CheckItem>
                    <CheckItem>Consultants and strategy advisors</CheckItem>
                    <CheckItem>Contract manufacturing and design services</CheckItem>
                    <CheckItem>Contract research organizations (CROs)</CheckItem>
                    <CheckItem>And other resource providers who serve early-stage health tech companies</CheckItem>
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
                        Event or Program Sponsorship
                      </p>
                      <p className="mt-2 font-urbanist text-base leading-relaxed text-black/65">
                        Align your brand with a specific Rellia event or program relevant to your business.
                      </p>
                    </div>
                    <div className="border-l-2 border-rellia-teal pl-5">
                      <p className="font-host-grotesk text-lg md:text-xl font-bold text-black tracking-tight">
                        Annual Sponsorship
                      </p>
                      <p className="mt-2 font-urbanist text-base leading-relaxed text-black/65">
                        Maintain year-round visibility and access to Rellia's growing community of
                        health tech founders.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.25}>
              <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-black/10 pt-10">
                <p className="font-urbanist text-base md:text-lg text-black/60 max-w-xl">
                  Tell us a little about your offering and we'll find the right fit.
                </p>
                <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                  <a href={CTA.partner}>
                    Get in Touch About Partnering
                    <ArrowRight />
                  </a>
                </RelliaAction>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <RelliaCta
          title="One network. Four doors in."
          body="Whichever door is yours, the goal is the same — move health innovation forward, faster. Pick the one that fits and we'll take it from there."
          primary={{ label: "Learn About Rellia", to: "/about" }}
          secondary={{ label: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` }}
        />
      </main>

      <Footer />
    </div>
  )
}
