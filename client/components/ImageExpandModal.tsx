import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ImageExpandModalProps = {
  src: string | null
  alt: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DISMISS_MS = 320

export default function ImageExpandModal({
  src,
  alt,
  open,
  onOpenChange,
}: ImageExpandModalProps) {
  const scrollYRef = useRef(0)
  const [displaySrc, setDisplaySrc] = useState<string | null>(null)

  useEffect(() => {
    if (open && src) {
      setDisplaySrc(src)
      scrollYRef.current = window.scrollY
    }
  }, [open, src])

  useEffect(() => {
    if (open) return
    const timer = window.setTimeout(() => setDisplaySrc(null), DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      const scrollY = scrollYRef.current
      onOpenChange(false)
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY)
      })
      return
    }
    onOpenChange(true)
  }

  if (!displaySrc) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideClose
        disableSlide
        overlayClassName={cn(
          "bg-black/90 backdrop-blur-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "duration-300 ease-out",
        )}
        aria-label={`Expanded image: ${alt}`}
        onClick={() => handleOpenChange(false)}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className={cn(
          "fixed inset-0 left-0 top-0 z-[10005] flex h-[100dvh] w-screen max-w-none",
          "translate-x-0 translate-y-0 items-center justify-center border-0 bg-transparent",
          "p-4 shadow-none outline-none md:p-6 cursor-zoom-out",
          "duration-300 ease-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-[0.98] data-[state=closed]:zoom-out-95",
        )}
      >
        <DialogTitle className="sr-only">Expanded View of Image</DialogTitle>
        <DialogDescription className="sr-only">
          Expanded lightbox viewer showing details for: {alt}
        </DialogDescription>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            handleOpenChange(false)
          }}
          className={cn(
            "absolute right-4 top-4 z-[10006] inline-flex h-11 w-11 items-center justify-center rounded-full",
            "bg-white/10 text-white transition-[background-color,transform,opacity] duration-300 ease-out",
            "hover:bg-white/20 hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-rellia-mint focus:ring-offset-2 focus:ring-offset-black",
          )}
          aria-label="Close expanded view"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          onClick={(event) => event.stopPropagation()}
          className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center overflow-hidden rounded-2xl cursor-default"
        >
          <img
            src={displaySrc}
            alt={alt}
            className="h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain rounded-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
