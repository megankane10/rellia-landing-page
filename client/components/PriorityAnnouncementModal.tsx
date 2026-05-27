import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CmsCtaLink, cmsCtaButtonClass } from "@/components/CmsCtaLink"

export type PriorityAnnouncementModalProps = {
  open: boolean
  onOpenChange: (next: boolean) => void
  heading: string
  body?: string
  imageSrc?: string
  imageAlt?: string
  pillText?: string
  buttonLabel?: string
  buttonLink?: string
}

export const PriorityAnnouncementModal = ({
  open,
  onOpenChange,
  heading,
  body,
  imageSrc,
  imageAlt,
  pillText,
  buttonLabel,
  buttonLink,
}: PriorityAnnouncementModalProps) => {
  const trimmedLabel = buttonLabel?.trim()
  const trimmedLink = buttonLink?.trim()
  const showButton = Boolean(trimmedLabel && trimmedLink)
  const showPill = Boolean(pillText?.trim())

  const handleClose = () => onOpenChange(false)

  const handleOpenChange = (next: boolean) => {
    if (next) onOpenChange(true)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        id="priority-announcement-modal"
        hideClose
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        className={cn(
          "gap-0 overflow-hidden border-black/10 p-0 sm:max-w-[min(92vw,520px)]",
          "rounded-[1.75rem] shadow-[0_24px_60px_rgba(13,53,64,0.35)]",
        )}
        aria-label={heading}
      >
        {imageSrc?.trim() ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-rellia-mint/30">
            <img
              src={imageSrc}
              alt={imageAlt?.trim() || ""}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="px-6 py-7 md:px-8 md:py-8">
          <DialogTitle className="sr-only">{heading}</DialogTitle>
          <DialogDescription className="sr-only">{body || heading}</DialogDescription>

          <div className="mb-4 flex w-full items-start justify-between gap-4">
            {showPill ? (
              <span className="inline-flex items-center rounded-full border border-rellia-teal/25 bg-rellia-mint/30 px-3 py-1 font-urbanist text-[11px] font-bold uppercase tracking-[0.14em] text-rellia-teal">
                {pillText}
              </span>
            ) : (
              <span aria-hidden />
            )}

            <DialogClose
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                "border border-black/10 bg-white/95 text-black shadow-sm",
                "transition-opacity hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40 focus-visible:ring-offset-2",
                "-mr-1",
              )}
              aria-label="Close announcement"
              onClick={handleClose}
            >
              <X className="h-5 w-5" aria-hidden />
            </DialogClose>
          </div>

          <h2 className="font-host-grotesk text-2xl font-bold tracking-tight text-black md:text-[1.65rem]">
            {heading}
          </h2>

          {body?.trim() ? (
            <p className="mt-3 font-urbanist text-base leading-relaxed text-black/70">{body}</p>
          ) : null}

          {showButton ? (
            <div className="mt-6">
              <CmsCtaLink
                href={trimmedLink!}
                onClick={handleClose}
                className={cmsCtaButtonClass}
              >
                {trimmedLabel}
              </CmsCtaLink>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
