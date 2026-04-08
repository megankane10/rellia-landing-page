import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useContactPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_CONTACT_PAGE } from "@shared/cms/defaults"
import { Mail } from "lucide-react"
import SectionPillBadge from "@/components/SectionPillBadge"

const HUBSPOT_SCRIPT_SRC = "https://js-na3.hsforms.net/forms/embed/342926478.js"

export default function Contact() {
  const { data } = useContactPage()
  const copy = data ?? DEFAULT_CONTACT_PAGE

  useEffect(() => {
    const existing = document.querySelector(`script[src="${HUBSPOT_SCRIPT_SRC}"]`)
    if (existing) {
      return
    }

    const script = document.createElement("script")
    script.src = HUBSPOT_SCRIPT_SRC
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="min-h-screen bg-white font-host-grotesk">
      <Navbar />

      <main>
        <section className="relative bg-rellia-cream pb-16 pt-[92px] md:pb-24 md:pt-[110px]">
          <div className="mx-auto flex w-full max-w-[1300px] flex-col items-stretch gap-8 px-6 md:px-10 lg:flex-row lg:items-stretch lg:gap-10">
            {/* Left: copy + quote */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-8">
              <div className="shrink-0">
                <SectionPillBadge className="mb-6 gap-2 px-4 py-2 text-sm">
                  <Mail className="h-4 w-4 text-rellia-mint" aria-hidden />
                  <span>{copy.heroBadge}</span>
                </SectionPillBadge>
                <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-rellia-teal md:text-5xl">
                  {copy.pageTitle}
                </h1>
                <p className="max-w-xl whitespace-pre-line font-urbanist text-base leading-relaxed text-black/70 md:text-lg">
                  {copy.intro}
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white/70 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-9">
                <p className="font-urbanist text-lg leading-relaxed text-black/80 md:text-xl">
                  “{copy.quoteText}”
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-black/10 bg-rellia-cream/50">
                    <img
                      src="/images/team-megankane.jpg"
                      alt={copy.quoteAttributionName}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-host-grotesk text-base font-semibold text-rellia-teal">
                      {copy.quoteAttributionName}
                    </p>
                    <p className="font-urbanist text-sm text-black/60">{copy.quoteAttributionRole}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: HubSpot form embed */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:h-full">
              <div className="flex flex-col rounded-2xl border border-black/10 bg-white/95 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-7 lg:flex-1 lg:p-6">
                <div
                  className="hs-form-frame"
                  data-region="na3"
                  data-form-id="4a03a495-ecb1-475b-a845-3ec2ccfdbf65"
                  data-portal-id="342926478"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
