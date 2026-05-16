import { useEffect, useId, useMemo, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { loadHubspotV2Script } from "@/lib/hubspotForms"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"

const SUPPORT_EMAIL = DEFAULT_GLOBAL_SETTINGS.supportEmail

type HubspotEmbedConfig = {
  region: string
  portalId: string
  formId: string
}

const HUBSPOT_FORM: HubspotEmbedConfig = {
  region: "na3",
  portalId: "342926478",
  formId: "fa4bb92b-2e44-4a3c-9601-773b36e3e3d8",
}

export type InvestorNotifyDialogProps = {
  open: boolean
  onOpenChange: (next: boolean) => void
}

/** HubSpot pitch-event notifications form — same embed as the Investors card on `/network`. */
export default function InvestorNotifyDialog({ open, onOpenChange }: InvestorNotifyDialogProps) {
  const targetIdRaw = useId()
  const targetId = useMemo(() => `hubspot-form-${targetIdRaw.replace(/[^a-zA-Z0-9_-]/g, "")}`, [targetIdRaw])
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")

  useEffect(() => {
    if (!open) return

    let cancelled = false

    const mountForm = async () => {
      setStatus("loading")
      try {
        await loadHubspotV2Script()
        if (cancelled) return

        const target = document.getElementById(targetId)
        if (!target) {
          setStatus("error")
          return
        }

        target.innerHTML = ""

        const create = window.hbspt?.forms?.create
        if (typeof create !== "function") {
          setStatus("error")
          return
        }

        create({
          region: HUBSPOT_FORM.region,
          portalId: HUBSPOT_FORM.portalId,
          formId: HUBSPOT_FORM.formId,
          target: `#${targetId}`,
        })

        setStatus("ready")
      } catch {
        if (cancelled) return
        setStatus("error")
      }
    }

    mountForm()
    return () => {
      cancelled = true
    }
  }, [open, targetId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-label="Pitch event notifications form"
        className={cn(
          "w-[min(92vw,720px)] max-w-none",
          "max-h-[min(86vh,780px)] overflow-hidden",
          "rounded-2xl md:rounded-3xl border border-black/10 bg-white p-0 shadow-2xl",
        )}
      >
        <div className="max-h-[min(86vh,780px)] overflow-y-auto p-4 sm:p-5 md:p-8">
          {status === "error" ? (
            <div className="space-y-2">
              <p className="font-urbanist text-black/70">
                We couldn’t load the form right now. Please try again in a moment.
              </p>
              <p className="font-urbanist text-black/60">
                Or email{" "}
                <a className="underline decoration-black/25 hover:decoration-black/60" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="relative min-h-[160px]">
              <div id={targetId} />
              {status === "loading" ? (
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80"
                  aria-busy="true"
                  aria-live="polite"
                >
                  <p className="font-urbanist text-black/60">Loading form…</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
