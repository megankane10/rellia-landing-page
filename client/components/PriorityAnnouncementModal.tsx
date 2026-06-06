import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CmsCtaLink, cmsCtaButtonClass } from "@/components/CmsCtaLink"
import { clearApiCsrfCache, getApiCsrfHeaders } from "@/lib/apiCsrf"

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

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") ?? formName).trim()
    const email = String(formData.get("email") ?? formEmail).trim()
    const source = (heading || "priority modal").trim().slice(0, 200)

    if (!name) {
      setSubmitError("Please enter your name.")
      setSubmitting(false)
      return
    }

    if (!email) {
      setSubmitError("Please enter your email address.")
      setSubmitting(false)
      return
    }

    const payload = { name, email, source }

    const postOnce = async () => {
      const csrf = await getApiCsrfHeaders()
      return fetch("/api/modal-submit", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
          ...csrf,
        },
        body: JSON.stringify(payload),
      })
    }

    try {
      let response = await postOnce()
      let data = (await response.json().catch(() => ({}))) as {
        error?: string
        code?: string
        details?: { fieldErrors?: Record<string, string[]> }
      }

      if (!response.ok && response.status === 403 && data.code === "CSRF") {
        clearApiCsrfCache()
        response = await postOnce()
        data = (await response.json().catch(() => ({}))) as typeof data
      }

      if (response.ok) {
        setSubmitSuccess(true)
        return
      }

      const fieldErrors = data.details?.fieldErrors
      if (fieldErrors?.email?.length) {
        setSubmitError("Please enter a valid email address.")
        return
      }
      if (fieldErrors?.name?.length) {
        setSubmitError("Please enter your name.")
        return
      }

      setSubmitError(data.error || "Could not save your submission. Please try again.")
    } catch {
      setSubmitError("Could not submit your request. Check your internet connection.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderBodyWithLinks = (text?: string) => {
    if (!text) return null
    const parts = text.split("Sanity Studio")
    if (parts.length <= 1) return text
    return (
      <>
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1
          return (
            <span key={index}>
              {part}
              {!isLast && (
                <a
                  href="https://relliahealth.sanity.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-rellia-teal underline hover:text-rellia-teal/80"
                >
                  Sanity Studio
                </a>
              )}
            </span>
          )
        })}
      </>
    )
  }

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={handleClose}
            className="fixed inset-0 z-[10001] bg-black/55 backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              id="priority-announcement-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="priority-modal-title"
              initial={{ opacity: 0, y: -40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "pointer-events-auto w-full overflow-hidden border border-black/[0.08]",
                "shadow-[0_20px_50px_rgba(13,53,64,0.3)]",
                "bg-gradient-to-r from-rellia-mint via-rellia-greyTeal to-rellia-mint",
                "rounded-[2.25rem] md:rounded-[2.75rem]",
                // Wide layout if there is a form or 2 action buttons; narrower layout for 1 or 0 buttons
                (formEnabled || (showPrimary && showSecondary))
                  ? "max-w-[min(92vw,520px)]"
                  : "max-w-[min(92vw,440px)]"
              )}
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
                <div className="mb-4 flex w-full items-center justify-between gap-4">
                  {showPill ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rellia-teal/25 bg-transparent px-2.5 py-1 text-[11px] font-black font-host-grotesk uppercase tracking-[0.14em] text-rellia-teal">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rellia-teal opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rellia-teal" />
                      </span>
                      {pillText}
                    </span>
                  ) : (
                    <span aria-hidden />
                  )}

                  <button
                    type="button"
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
                  </button>
                </div>

                <h2 id="priority-modal-title" className="font-urbanist text-[19px] font-semibold leading-relaxed text-black md:text-[22px] md:leading-relaxed">
                  {heading}
                </h2>

                {body?.trim() ? (
                  <p className="mt-3 font-urbanist text-base leading-relaxed text-black">
                    {renderBodyWithLinks(body)}
                  </p>
                ) : null}

                {formEnabled ? (
                  <form onSubmit={handleFormSubmit} className={`${body?.trim() ? 'mt-6' : 'mt-4'} space-y-4`}>
                    {submitSuccess ? (
                      <div className="flex justify-center py-8" role="status" aria-label="Submission received">
                        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rellia-teal text-white shadow-md">
                          <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            name="name"
                            autoComplete="name"
                            required
                            placeholder={formPlaceholderName?.trim() || "First name"}
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            onInput={(e) => setFormName(e.currentTarget.value)}
                            className="h-12 w-full rounded-full border border-black/20 bg-black/[0.09] px-5 font-urbanist text-sm text-black/90 placeholder-black/45 outline-none transition-colors focus:border-rellia-teal/60 focus:bg-black/[0.12] focus:ring-2 focus:ring-rellia-teal/15"
                          />
                          <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            placeholder={formPlaceholderEmail?.trim() || "Email address"}
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            onInput={(e) => setFormEmail(e.currentTarget.value)}
                            className="h-12 w-full rounded-full border border-black/20 bg-black/[0.09] px-5 font-urbanist text-sm text-black/90 placeholder-black/45 outline-none transition-colors focus:border-rellia-teal/60 focus:bg-black/[0.12] focus:ring-2 focus:ring-rellia-teal/15"
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

                {(!formEnabled && (showPrimary || showSecondary)) ? (
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
