import { useEffect, useId, useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useContactPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_CONTACT_PAGE, DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { Mail } from "lucide-react"
import SectionPillBadge from "@/components/SectionPillBadge"
import { loadHubspotV2Script } from "@/lib/hubspotForms"

const SUPPORT_EMAIL = DEFAULT_GLOBAL_SETTINGS.supportEmail

/** Same portal/region as previous embed; form id from `data-form-id` on `.hs-form-frame` */
const CONTACT_HUBSPOT_FORM = {
  region: "na3",
  portalId: "342926478",
  formId: "4a03a495-ecb1-475b-a845-3ec2ccfdbf65",
} as const

export default function Contact() {
  const { data } = useContactPage()
  const copy = data ?? DEFAULT_CONTACT_PAGE

  const targetIdRaw = useId()
  const targetId = useMemo(
    () => `contact-hubspot-${targetIdRaw.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [targetIdRaw],
  )
  const [formStatus, setFormStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    let cancelled = false

    const mountForm = async () => {
      setFormStatus("loading")
      try {
        await loadHubspotV2Script()
        if (cancelled) return

        const target = document.getElementById(targetId)
        if (!target) {
          setFormStatus("error")
          return
        }

        target.innerHTML = ""

        const create = window.hbspt?.forms?.create
        if (typeof create !== "function") {
          setFormStatus("error")
          return
        }

        create({
          region: CONTACT_HUBSPOT_FORM.region,
          portalId: CONTACT_HUBSPOT_FORM.portalId,
          formId: CONTACT_HUBSPOT_FORM.formId,
          target: `#${targetId}`,
        })

        if (!cancelled) setFormStatus("ready")
      } catch {
        if (!cancelled) setFormStatus("error")
      }
    }

    mountForm()

    return () => {
      cancelled = true
      const target = document.getElementById(targetId)
      if (target) target.innerHTML = ""
    }
  }, [targetId])

  return (
    <div className="min-h-screen bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
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

            {/* Right: HubSpot form — v2 API so it mounts after React (SPA + direct visits) */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:h-full">
              <div className="flex flex-col rounded-2xl border border-black/10 bg-white/95 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-7 lg:flex-1 lg:p-6">
                {formStatus === "error" ? (
                  <div className="space-y-2 py-4">
                    <p className="font-urbanist text-black/70">
                      We couldn’t load the form right now. Please try again in a moment.
                    </p>
                    <p className="font-urbanist text-black/60">
                      Or email{" "}
                      <a
                        className="underline decoration-black/25 hover:decoration-black/60"
                        href={`mailto:${SUPPORT_EMAIL}`}
                      >
                        {SUPPORT_EMAIL}
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <div className="relative min-h-[min(420px,55vh)] w-full flex-1">
                    <div id={targetId} className="min-h-[200px]" />
                    {formStatus === "loading" ? (
                      <div
                        className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/85"
                        aria-busy="true"
                        aria-live="polite"
                      >
                        <p className="font-urbanist text-black/60">Loading form…</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
