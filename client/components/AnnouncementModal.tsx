import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id="announcement-modal"
          role="dialog"
          aria-modal="false"
          aria-label="Site announcement"
          initial={{ opacity: 0, y: -40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed z-[10010] pointer-events-none",
            "left-4 right-4 bottom-4 sm:left-auto sm:right-5 sm:bottom-5 md:right-8 md:bottom-8",
            "w-auto max-w-none sm:w-[min(94vw,460px)]",
          )}
        >
          <div
            className={cn(
              "pointer-events-auto",
              "rounded-[2.25rem] border border-black/[0.08] py-7 px-6 md:rounded-[2.75rem] md:py-9 md:px-8",
              "shadow-[0_20px_50px_rgba(13,53,64,0.3)]",
              "bg-gradient-to-r from-rellia-mint via-rellia-greyTeal to-rellia-mint",
            )}
          >
            <div className="flex w-full flex-col items-stretch text-left">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rellia-teal/25 bg-transparent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rellia-teal">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rellia-teal opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rellia-teal" />
                  </span>
                  {pillText?.trim() || "LIVE"}
                </span>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    "border border-rellia-teal/20 bg-white/80 text-rellia-teal",
                    "transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
                  )}
                  aria-label="Dismiss announcement"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <p className="font-urbanist text-[19px] font-semibold leading-relaxed text-black md:text-[22px] md:leading-relaxed">
                {text}
              </p>

              {showButton ? (
                <div className="mt-5">
                  <CmsCtaLink
                    href={trimmedLink!}
                    onClick={handleDismiss}
                    className={cn(cmsCtaButtonClass, "focus-visible:ring-offset-transparent")}
                  >
                    {trimmedLabel}
                  </CmsCtaLink>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
