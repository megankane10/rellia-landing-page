import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import RelliaAction from "@/components/RelliaAction"
import { Link } from "react-router-dom"

const SUPPORT_EMAIL = DEFAULT_GLOBAL_SETTINGS.supportEmail

export type InvestorNotifyDialogProps = {
  open: boolean
  onOpenChange: (next: boolean) => void
}

/** Investor pitch-event interest — routes to contact while HubSpot is removed. */
export default function InvestorNotifyDialog({ open, onOpenChange }: InvestorNotifyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-label="Pitch event notifications"
        className={cn(
          "w-[min(92vw,720px)] max-w-none",
          "max-h-[min(86vh,780px)] overflow-hidden",
          "rounded-2xl md:rounded-3xl border border-black/10 bg-white p-0 shadow-2xl",
        )}
      >
        <div className="max-h-[min(86vh,780px)] overflow-y-auto p-6 sm:p-8 md:p-10">
          <h2 className="font-host-grotesk text-2xl font-bold text-rellia-teal mb-4">
            Get pitch event updates
          </h2>
          <p className="font-urbanist text-base text-black/70 leading-relaxed mb-8">
            Tell us you want notifications for Rellia pitch events and investor programming. We&apos;ll follow up by email.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <RelliaAction asChild variant="mintTealFill" size="comfortable" className="w-full sm:w-auto">
              <Link to="/contact" onClick={() => onOpenChange(false)}>
                Contact us
              </Link>
            </RelliaAction>
            <RelliaAction asChild variant="outlineOnWhite" size="comfortable" className="w-full sm:w-auto">
              <a href={`mailto:${SUPPORT_EMAIL}`}>Email {SUPPORT_EMAIL}</a>
            </RelliaAction>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
