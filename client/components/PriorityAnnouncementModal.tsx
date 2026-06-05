import { useState } from "react"
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
import { getApiCsrfHeaders } from "@/lib/apiCsrf"

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
  secondaryButtonLabel?: string
  secondaryButtonLink?: string
  formEnabled?: boolean
  formButtonLabel?: string
  formPlaceholderName?: string
  formPlaceholderEmail?: string
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
  secondaryButtonLabel,
  secondaryButtonLink,
  formEnabled = false,
  formButtonLabel,
  formPlaceholderName,
  formPlaceholderEmail,
}: PriorityAnnouncementModalProps) => {
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const trimmedLabel = buttonLabel?.trim()
  const trimmedLink = buttonLink?.trim()
  const trimmedSecondaryLabel = secondaryButtonLabel?.trim()
  const trimmedSecondaryLink = secondaryButtonLink?.trim()

  const showPrimary = Boolean(trimmedLabel && trimmedLink)
  const showSecondary = Boolean(trimmedSecondaryLabel && trimmedSecondaryLink)
  const showPill = Boolean(pillText?.trim())

  const handleClose = () => {
    onOpenChange(false)
    // Reset form states on close
    setFormName("")
    setFormEmail("")
    setSubmitSuccess(false)
    setSubmitError(null)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      handleClose()
    } else {
      onOpenChange(next)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const csrf = await getApiCsrfHeaders()
      const response = await fetch("/api/modal-submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...csrf,
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          source: heading || "priority modal",
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
      } else {
        const data = await response.json().catch(() => ({}))
        setSubmitError(data.error || "Could not save your submission. Please try again.")
      }
    } catch {
      setSubmitError("Could not submit your request. Check your internet connection.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        id="priority-announcement-modal"
        hideClose
        disableSlide={true}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        overlayClassName="z-[10001] bg-black/55"
        className={cn(
          "z-[10001] duration-300",
          "data-[state=open]:animate-priority-modal-in data-[state=closed]:animate-priority-modal-out",
          "gap-0 overflow-hidden border-black/10 p-0 sm:max-w-[min(92vw,520px)]",
          "rounded-3xl shadow-[0_24px_60px_rgba(13,53,64,0.35)]",
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

          <div className="mb-4 flex w-full items-center justify-between gap-4">
            {showPill ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rellia-teal/25 bg-transparent px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-rellia-teal">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rellia-teal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rellia-teal" />
                </span>
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
                "-mr-2 md:-mr-4",
              )}
              aria-label="Close announcement"
              onClick={handleClose}
            >
              <X className="h-5 w-5" aria-hidden />
            </DialogClose>
          </div>

          <h2 className="font-host-grotesk text-2xl font-bold tracking-tight text-black md:text-[1.65rem] leading-tight">
            {heading}
          </h2>

          {body?.trim() ? (
            <p className="mt-3 font-urbanist text-base leading-relaxed text-black/70">{body}</p>
          ) : null}

          {formEnabled ? (
            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              {submitSuccess ? (
                <div className="font-urbanist text-sm font-semibold text-rellia-mintDark bg-rellia-mint/20 border border-rellia-mint/30 rounded-2xl p-4">
                  Thank you! Your submission has been received.
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      required
                      placeholder={formPlaceholderName?.trim() || "First name"}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="h-12 w-full rounded-full border border-black/10 bg-black/[0.01] px-5 font-urbanist text-sm placeholder-black/40 outline-none focus:border-rellia-teal focus:ring-1 focus:ring-rellia-teal"
                    />
                    <input
                      type="email"
                      required
                      placeholder={formPlaceholderEmail?.trim() || "Email address"}
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="h-12 w-full rounded-full border border-black/10 bg-black/[0.01] px-5 font-urbanist text-sm placeholder-black/40 outline-none focus:border-rellia-teal focus:ring-1 focus:ring-rellia-teal"
                    />
                  </div>
                  {submitError && (
                    <p className="font-urbanist text-xs text-red-500 mt-1">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-14 w-full items-center justify-center rounded-full bg-rellia-teal font-host-grotesk text-sm font-bold text-white hover:bg-rellia-teal/95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : (formButtonLabel?.trim() || "Subscribe")}
                  </button>
                </>
              )}
            </form>
          ) : null}

          {showPrimary || showSecondary ? (
            <div className="mt-6 flex flex-col gap-3 w-full">
              {showPrimary ? (
                <CmsCtaLink
                  href={trimmedLink!}
                  onClick={handleClose}
                  className={cn(cmsCtaButtonClass, "w-full")}
                >
                  {trimmedLabel}
                </CmsCtaLink>
              ) : null}
              {showSecondary ? (
                <CmsCtaLink
                  href={trimmedSecondaryLink!}
                  onClick={handleClose}
                  className={cn(
                    "inline-flex h-14 w-full items-center justify-center rounded-full px-4 border border-black/15",
                    "bg-white font-host-grotesk text-sm font-semibold text-black hover:bg-black/5 transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40 focus-visible:ring-offset-2",
                  )}
                >
                  {trimmedSecondaryLabel}
                </CmsCtaLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
