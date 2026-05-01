import { PAGE_HEADER_DARK_SUBTITLE_CLASS, PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { ArrowRight, BarChart3, Check } from "lucide-react"

const HERO_IMAGE =
  "https://images.pexels.com/photos/8761335/pexels-photo-8761335.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

function AiGeneratedNote() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-4 py-3 text-white/85 shadow-sm">
      <p className="font-urbanist text-sm leading-relaxed">
        <span className="font-semibold text-white">Note:</span> This page was fully generated with AI and hasn’t been
        reworked yet with deeper thinking and section refinement.
      </p>
    </div>
  )
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rellia-mint/25">
        <Check className="h-3.5 w-3.5 text-rellia-mint" strokeWidth={3} />
      </span>
      <span className="font-urbanist text-white/80 leading-relaxed">{children}</span>
    </li>
  )
}

export default function NetworkInvestors() {
  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <section className="relative bg-rellia-teal pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
          />
          <div aria-hidden className="absolute inset-0 bg-rellia-teal/55" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-rellia-teal via-rellia-teal/55 to-rellia-teal/25" />

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="max-w-3xl">
                <AiGeneratedNote />
                <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                  <BarChart3 className="h-4 w-4 text-rellia-mint" />
                  Investors
                </p>
                <h1
                  className={`mt-6 text-white font-bold leading-tight tracking-tight ${PAGE_HEADER_TITLE_SIZE_CLASS}`}
                >
                  Meet founders worth your time
                  <br />
                  before the crowd does
                </h1>
                <p className={cn(PAGE_HEADER_DARK_SUBTITLE_CLASS, "mt-7 max-w-2xl")}>
                  Vetted, operator-coached health tech teams—closer to real traction, clearer on the path through
                  healthcare.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <RelliaAction asChild variant="heroSolidOnTeal" size="comfortable">
                    <a href="/contact" aria-label="Request investor access">
                      Request access
                      <ArrowRight aria-hidden />
                    </a>
                  </RelliaAction>
                  <RelliaAction asChild variant="heroGhostOnTeal" size="comfortable">
                    <a href="/apply" aria-label="Apply to join Rellia">
                      See the Network
                      <ArrowRight aria-hidden />
                    </a>
                  </RelliaAction>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-[1300px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              <ScrollReveal>
                <div>
                  <h2 className="text-black text-3xl md:text-4xl font-bold tracking-tight">
                    Less noise. More signal.
                  </h2>
                  <p className="mt-4 font-urbanist text-black/70 text-lg leading-relaxed max-w-xl">
                    Healthcare investing rewards rigor. We help founders build credible narratives backed by the
                    right validation—so your time goes to teams with real upside.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="rounded-3xl border border-black/10 bg-rellia-teal p-8 md:p-10 shadow-xl">
                  <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">What you can expect</h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Curated intros aligned to your thesis</CheckItem>
                    <CheckItem>Founders coached by operators and clinicians</CheckItem>
                    <CheckItem>Evidence-minded approach to validation</CheckItem>
                    <CheckItem>Pitch events designed for real conversations</CheckItem>
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Curated", body: "No mass blasts—only teams we’d personally vouch for." },
                { title: "Prepared", body: "Founders arrive sharper on strategy, risks, and next steps." },
                { title: "Relevant", body: "More meetings that match your portfolio focus." },
              ].map((c) => (
                <ScrollReveal key={c.title} delay={0.05}>
                  <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
                    <p className="font-host-grotesk text-xl font-bold tracking-tight text-rellia-teal">{c.title}</p>
                    <p className="mt-3 font-urbanist text-black/65 leading-relaxed">{c.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <RelliaCta
          title="Want **early access** to the next wave of health tech?"
          body="Tell us your thesis and what you’re looking for. We’ll follow up with next steps."
          primary={{ label: "Request access", to: "/contact" }}
          secondary={{ label: "Apply to join", to: "/apply" }}
        />
      </main>

      <Footer />
    </div>
  )
}

