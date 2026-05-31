import { X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { CmsCtaLink, cmsCtaButtonClass } from "@/components/CmsCtaLink"

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
          "sm:right-5 sm:left-auto sm:bottom-5 sm:w-[min(94vw,460px)] md:right-8 md:bottom-8",
          "gap-0 rounded-[2.25rem] border border-black/[0.08] py-7 px-6 md:rounded-[2.75rem] md:py-9 md:px-8",
          "shadow-[0_20px_50px_rgba(13,53,64,0.3)]",
          "bg-gradient-to-r from-rellia-mint via-rellia-greyTeal to-rellia-mint",
          "data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4",
          "data-[state=closed]:slide-out-to-right-0 data-[state=open]:slide-in-from-right-0",
          "data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100",
        )}
      >
        <DialogTitle className="sr-only">Site Announcement</DialogTitle>
        <DialogDescription className="sr-only">
          Important updates and announcements for Rellia Health members and visitors.
        </DialogDescription>
        <div className="flex w-full flex-col items-stretch text-left">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rellia-teal/25 bg-transparent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rellia-teal">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rellia-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rellia-teal"></span>
              </span>
              {pillText?.trim() || "LIVE"}
            </span>
            <DialogClose
              className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                "border border-rellia-teal/20 bg-white/80 text-rellia-teal",
                "transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
              )}
              aria-label="Dismiss announcement"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" aria-hidden />
            </DialogClose>
          </div>

          <p className="font-urbanist text-[19px] font-semibold leading-relaxed text-black md:text-[22px] md:leading-relaxed">
            {text}
          </p>
 
          {showButton && (
            <div className="mt-5">
              <CmsCtaLink
                href={trimmedLink!}
                onClick={handleDismiss}
                className={cn(cmsCtaButtonClass, "focus-visible:ring-offset-transparent")}
              >
                {trimmedLabel}
              </CmsCtaLink>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
