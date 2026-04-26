import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { ArrowRight, Building2, Check } from "lucide-react"

const HERO_IMAGE =
  "https://images.pexels.com/photos/6129679/pexels-photo-6129679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

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

export default function NetworkPartners() {
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
                  <Building2 className="h-4 w-4 text-rellia-mint" />
                  Partners
                </p>
                <h1 className="mt-6 text-rellia-cream text-5xl md:text-7xl lg:text-[84px] font-semibold leading-[0.95] tracking-tight">
                  Reach founders at the moment
                  <br />
                  they’re making real decisions
                </h1>
                <p className="mt-7 font-urbanist text-white/85 text-lg md:text-2xl leading-snug max-w-2xl">
                  Sponsor programs, provide resources, and build trusted relationships with health tech founders.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <RelliaAction asChild variant="heroSolidOnTeal" size="comfortable">
                    <a href="/contact" aria-label="Partner with Rellia">
                      Partner with Rellia
                      <ArrowRight aria-hidden />
                    </a>
                  </RelliaAction>
                  <RelliaAction asChild variant="heroGhostOnTeal" size="comfortable">
                    <a href="/industry-partners/directory" aria-label="View partner directory">
                      View directory
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
                    A trusted channel into health tech
                  </h2>
                  <p className="mt-4 font-urbanist text-black/70 text-lg leading-relaxed max-w-xl">
                    The founders in our network are actively building—and actively choosing vendors, partners, and
                    service providers. Show up with real value and you’ll earn trust fast.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="rounded-3xl border border-black/10 bg-rellia-teal p-8 md:p-10 shadow-xl">
                  <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">Great fits include</h3>
                  <ul className="mt-6 space-y-4">
                    <CheckItem>Legal, privacy, and compliance partners</CheckItem>
                    <CheckItem>Clinical research / pilots / evidence partners</CheckItem>
                    <CheckItem>Design, engineering, and implementation teams</CheckItem>
                    <CheckItem>Go-to-market, sales, and commercialization experts</CheckItem>
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.15}>
              <div className="mt-12 md:mt-16 rounded-[32px] border border-black/10 bg-rellia-cream/45 p-8 md:p-10">
                <h3 className="text-black text-2xl md:text-3xl font-bold tracking-tight">Partnership options</h3>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Sponsor a program",
                      body: "Be present in a moment that matters—where founders need expertise, not ads.",
                    },
                    {
                      title: "Workshops & education",
                      body: "Teach founders what you know best. Earn trust by being useful.",
                    },
                    {
                      title: "Introductions",
                      body: "Meet founders who are actively searching for what you provide.",
                    },
                  ].map((c) => (
                    <div key={c.title} className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
                      <p className="font-host-grotesk text-xl font-bold tracking-tight text-rellia-teal">{c.title}</p>
                      <p className="mt-3 font-urbanist text-black/65 leading-relaxed">{c.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <RelliaCta
          title="Want to partner with the Rellia network?"
          body="Tell us what you do and who you help. We’ll follow up with options that fit."
          primary={{ label: "Partner with Rellia", to: "/contact" }}
          secondary={{ label: "Explore the Network", to: "/network" }}
        />
      </main>

      <Footer />
    </div>
  )
}

