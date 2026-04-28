import { useEffect, useId, useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useContactPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_CONTACT_PAGE, DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { loadHubspotV2Script } from "@/lib/hubspotForms"
import { Quote } from "lucide-react"

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
        <section className="relative bg-white pb-16 pt-[92px] md:pb-24 md:pt-[110px]">
          <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10">
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_16px_60px_rgba(0,0,0,0.08)]">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: image + copy + quote (connected panel) */}
                <div className="relative flex flex-col justify-between border-b border-black/10 bg-rellia-teal lg:border-b-0 lg:border-r">
                  <div className="pointer-events-none absolute inset-0">
                    <img
                      src="https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=1600"
                      alt=""
                      className="h-full w-full object-cover object-center opacity-60"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-rellia-teal/35 via-rellia-teal/60 to-rellia-teal"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="relative flex flex-col px-7 pb-7 pt-14 md:px-10 md:pb-10 md:pt-16 min-h-[540px] md:min-h-[620px]">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                      {copy.pageTitle}
                    </h1>
                    <p className="mt-4 max-w-xl font-urbanist text-base leading-relaxed text-white/80 md:text-lg">
                      {copy.intro}
                    </p>

                    <div className="mt-auto pt-10">
                      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                      <div className="mt-6">
                        <div className="flex items-start gap-2">
                          <Quote className="mt-1 h-5 w-5 shrink-0 text-white/80" aria-hidden />
                          <p className="font-urbanist text-xl leading-relaxed text-white/95 md:text-2xl">
                            {copy.quoteText}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                            <img
                              src="/images/team-megankane.jpg"
                              alt={copy.quoteAttributionName}
                              className="h-full w-full object-cover object-top"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-host-grotesk text-base font-semibold text-white">
                              {copy.quoteAttributionName}
                            </p>
                            <p className="font-urbanist text-sm text-white/75">{copy.quoteAttributionRole}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between gap-4 border-t border-white/10 px-7 py-5 text-sm text-white/75 md:px-10">
                    <span className="font-urbanist">{copy.heroBadge}</span>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="font-urbanist underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
                      aria-label={`Email ${SUPPORT_EMAIL}`}
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                </div>

                {/* Right: HubSpot form — v2 API so it mounts after React (SPA + direct visits) */}
                <div className="flex min-h-0 min-w-0 flex-col bg-white p-6 md:p-10 lg:h-full">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
