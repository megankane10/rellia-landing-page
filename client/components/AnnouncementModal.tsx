import { Link } from "react-router-dom"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type AnnouncementModalProps = {
  open: boolean
  onOpenChange: (next: boolean) => void
  text: string
  buttonLabel?: string
  buttonLink?: string
  pillText?: string
}

export default function AnnouncementModal({
  open,
  onOpenChange,
  text,
  buttonLabel,
  buttonLink,
  pillText,
}: AnnouncementModalProps) {
  const trimmedLabel = buttonLabel?.trim()
  const trimmedLink = buttonLink?.trim()
  const showButton = Boolean(trimmedLabel && trimmedLink)

  const handleDismiss = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        id="announcement-modal"
        hideClose
        aria-label="Announcement"
        onOpenAutoFocus={(event) => event.preventDefault()}
        overlayClassName="z-[10001] bg-transparent pointer-events-none"
        className={cn(
          "z-[10001] pointer-events-auto",
          "left-4 right-4 bottom-4 top-auto w-auto max-w-none translate-x-0 translate-y-0",
          "sm:left-5 sm:right-auto sm:bottom-5 sm:w-[min(94vw,460px)] md:left-8 md:bottom-8",
          "gap-0 rounded-[1.75rem] border-0 py-7 px-6 md:rounded-[2.75rem] md:py-9 md:px-8",
          "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]",
          "bg-gradient-to-r from-rellia-mint via-rellia-greyTeal to-rellia-mint",
          "data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4",
          "data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-left-0",
          "data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100",
        )}
      >
        <DialogTitle className="sr-only">Site Announcement</DialogTitle>
        <DialogDescription className="sr-only">
          Important updates and announcements for Rellia Health members and visitors.
        </DialogDescription>
        <div className="flex w-full flex-col items-stretch text-left">
          <div className="mb-3 flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rellia-teal/25 bg-transparent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rellia-teal">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rellia-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rellia-teal"></span>
              </span>
              {pillText?.trim() || "LIVE"}
            </span>
          </div>

          <p className="font-urbanist text-[19px] font-semibold leading-relaxed text-black md:text-[22px] md:leading-relaxed">
            {text}
          </p>
 
          <div className="mt-5 flex gap-2.5">
            {showButton && (
              <Link
                to={trimmedLink!}
                onClick={handleDismiss}
                className={cn(
                  "inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-full px-4",
                  "bg-rellia-mint font-host-grotesk text-sm font-semibold text-rellia-teal",
                  "transition-colors duration-200 hover:bg-rellia-mint/90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                )}
              >
                {trimmedLabel}
              </Link>
            )}
 
            <button
              type="button"
              id="announcement-modal-dismiss"
              onClick={handleDismiss}
              className={cn(
                "inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-full px-4",
                "border border-rellia-teal/25 bg-white/30 font-host-grotesk text-sm font-semibold text-rellia-teal",
                "transition-colors duration-200 hover:bg-white/50",
                "outline-none focus:outline-none focus:bg-white/30 focus-visible:bg-white/50 focus-visible:ring-2 focus-visible:ring-rellia-teal/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                !showButton && "flex-[2]",
              )}
            >
              Dismiss
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
