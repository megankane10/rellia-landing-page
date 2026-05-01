import { PAGE_HEADER_DARK_SUBTITLE_CLASS, PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { ArrowRight, Check, Sparkles } from "lucide-react"

const HERO_IMAGE =
  "https://images.pexels.com/photos/7414216/pexels-photo-7414216.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

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

export default function NetworkFounders() {
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
                  <Sparkles className="h-4 w-4 text-rellia-mint" />
                  Founders
                </p>
                <h1
                  className={`mt-6 text-white font-bold leading-tight tracking-tight ${PAGE_HEADER_TITLE_SIZE_CLASS}`}
                >
                  You’re building in health tech.
                  <br />
                  We’ll help you ship with confidence.
                </h1>
                <p className={cn(PAGE_HEADER_DARK_SUBTITLE_CLASS, "mt-7 max-w-2xl")}>
                  A high-signal network of operators, clinicians, and investors focused on getting you to your next
                  milestone faster.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <RelliaAction asChild variant="heroSolidOnTeal" size="comfortable">
                    <a href="/apply" aria-label="Apply to join as a founder">
                      Apply to Join
                      <ArrowRight aria-hidden />
                    </a>
                  </RelliaAction>
                  <RelliaAction asChild variant="heroGhostOnTeal" size="comfortable">
                    <a href="/network" aria-label="Explore the full network">
                      Explore the Network
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
                    A modern support system for healthcare builders
                  </h2>
                  <p className="mt-4 font-urbanist text-black/70 text-lg leading-relaxed max-w-xl">
                    Build in the open, move fast without breaking trust, and avoid costly detours in regulation,
                    procurement, and clinical validation.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="rounded-3xl border border-black/10 bg-rellia-teal p-8 md:p-10 shadow-xl">
                  <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
                    What founders typically get
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Clear milestones and the shortest path to launch</CheckItem>
                    <CheckItem>Clinician + operator feedback loops you can trust</CheckItem>
                    <CheckItem>Introductions that convert into real conversations</CheckItem>
                    <CheckItem>Fundraising narrative pressure-tested by experts</CheckItem>
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Move faster", body: "Decide with context. Stop guessing what “good” looks like in healthcare." },
                { title: "De-risk", body: "Validate earlier with the right people before you lock in a roadmap." },
                { title: "Raise smarter", body: "Tell a sharper story with evidence that investors actually care about." },
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

        <section className="bg-rellia-cream/45 py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-[1300px] mx-auto">
            <ScrollReveal>
              <div className="rounded-[32px] border border-black/10 bg-white overflow-hidden shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="p-8 md:p-10">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
                      Built for execution, not vibes
                    </h3>
                    <p className="mt-4 font-urbanist text-black/70 text-lg leading-relaxed">
                      You’ll leave each interaction with clarity: what to do next, who to talk to, and how to present
                      your progress credibly inside healthcare.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                        <a href="/contact" aria-label="Talk to the team">
                          Talk to the team
                          <ArrowRight aria-hidden />
                        </a>
                      </RelliaAction>
                      <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
                        <a href="/stories" aria-label="Read founder stories">
                          Read stories
                        </a>
                      </RelliaAction>
                    </div>
                  </div>
                  <div className={cn("relative min-h-[280px] lg:min-h-full")}>
                    <img
                      src="https://images.pexels.com/photos/7414108/pexels-photo-7414108.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <RelliaCta
          title="Ready to **build** with the right people behind you?"
          body="Apply to join the founders network and get the clarity, credibility, and momentum you need."
          primary={{ label: "Apply to Join", to: "/apply" }}
          secondary={{ label: "Explore the full Network", to: "/network" }}
        />
      </main>

      <Footer />
    </div>
  )
}

