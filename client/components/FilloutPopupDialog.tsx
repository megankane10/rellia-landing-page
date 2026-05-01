import { FilloutStandardEmbed } from "@fillout/react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type FilloutPopupDialogProps = {
  open: boolean
  onOpenChange: (next: boolean) => void
  formUrl: string
  title?: string
  description?: string
}

const getFilloutIdFromUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return ""

  const marker = "/t/"
  const index = trimmed.indexOf(marker)
  if (index === -1) return ""

  const after = trimmed.slice(index + marker.length)
  const id = after.split(/[/?#]/)[0] ?? ""
  return id.trim()
}

export default function FilloutPopupDialog({
  open,
  onOpenChange,
  formUrl,
  title = "Join the waitlist",
  description = "Fill out this short form and we'll follow up.",
}: FilloutPopupDialogProps) {
  const filloutId = getFilloutIdFromUrl(formUrl)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-label={title}
        className={cn(
          "w-[min(92vw,900px)] max-w-none",
          "max-h-[min(86vh,860px)] overflow-hidden",
          "rounded-2xl border border-black/10 bg-white p-0 shadow-2xl md:rounded-3xl",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <DialogTitle className="font-host-grotesk text-base font-semibold text-black">
              {title}
            </DialogTitle>
            <DialogDescription className="font-urbanist text-sm text-black/55">
              {description}
            </DialogDescription>
          </div>
        </div>

        <div className="max-h-[min(72vh,720px)] overflow-y-auto p-3 sm:p-4">
          {filloutId ? (
            <div className="w-full min-h-[256px]">
              <FilloutStandardEmbed
                filloutId={filloutId}
                inheritParameters
                dynamicResize
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-center">
              <p className="font-urbanist text-sm text-black/60">
                We couldn't load the embedded form.{" "}
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-black/20 underline-offset-4 hover:decoration-black/60"
                >
                  Open it in a new tab
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
