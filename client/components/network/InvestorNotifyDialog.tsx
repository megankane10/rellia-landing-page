import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import InvestorNotifyForm from "@/components/network/InvestorNotifyForm"

export type InvestorNotifyDialogProps = {
  open: boolean
  onOpenChange: (next: boolean) => void
}

export default function InvestorNotifyDialog({ open, onOpenChange }: InvestorNotifyDialogProps) {
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
        <DialogTitle className="sr-only">Investor Notifications Form</DialogTitle>
        <DialogDescription className="sr-only">
          Sign up to receive pitch event notifications and investor dealflow updates.
        </DialogDescription>
        <div className="max-h-[min(86vh,780px)] overflow-y-auto p-4 sm:p-5 md:p-8">
          <InvestorNotifyForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
