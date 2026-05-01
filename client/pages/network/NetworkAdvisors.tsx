import { PAGE_HEADER_DARK_SUBTITLE_CLASS, PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { ArrowRight, Check, GraduationCap } from "lucide-react"

const HERO_IMAGE =
  "https://images.pexels.com/photos/8376155/pexels-photo-8376155.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

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

export default function NetworkAdvisors() {
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
                  <GraduationCap className="h-4 w-4 text-rellia-mint" />
                  Advisors
                </p>
                <h1
                  className={`mt-6 text-white font-bold leading-tight tracking-tight ${PAGE_HEADER_TITLE_SIZE_CLASS}`}
                >
                  Be the person you wish you had
                  <br />
                  when you were building
                </h1>
                <p className={cn(PAGE_HEADER_DARK_SUBTITLE_CLASS, "mt-7 max-w-2xl")}>
                  Mentor serious health tech founders in structured, high-impact engagements—without the chaos.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <RelliaAction asChild variant="heroSolidOnTeal" size="comfortable">
                    <a href="/contact" aria-label="Express interest in mentoring">
                      Express interest
                      <ArrowRight aria-hidden />
                    </a>
                  </RelliaAction>
                  <RelliaAction asChild variant="heroGhostOnTeal" size="comfortable">
                    <a href="/network" aria-label="Learn about the network">
                      Learn about the Network
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
                    Mentorship that respects your time
                  </h2>
                  <p className="mt-4 font-urbanist text-black/70 text-lg leading-relaxed max-w-xl">
                    Rellia is built for operators and clinicians who want to help, but don’t want an open-ended time
                    sink. We structure engagements so they’re high-signal for both sides.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="rounded-3xl border border-black/10 bg-rellia-teal p-8 md:p-10 shadow-xl">
                  <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
                    What being an advisor looks like
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Curated matches with vetted founders</CheckItem>
                    <CheckItem>Flexible involvement—opt in to what fits</CheckItem>
                    <CheckItem>Short, focused sessions with clear outcomes</CheckItem>
                    <CheckItem>Support founders across product, clinical, and commercialization paths</CheckItem>
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Impact", body: "Your experience can change a founder’s trajectory in a single session." },
                { title: "Community", body: "Be part of an ecosystem that takes healthcare credibility seriously." },
                { title: "Signal", body: "Engage with builders who are committed and prepared." },
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
          title="Want to **mentor** health tech founders that actually execute?"
          body="Tell us what you’re great at. We’ll match you with founders who need exactly that."
          primary={{ label: "Express interest", to: "/contact" }}
          secondary={{ label: "Explore the Network", to: "/network" }}
        />
      </main>

      <Footer />
    </div>
  )
}

