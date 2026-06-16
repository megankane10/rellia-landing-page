import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X } from "lucide-react"

export type ImageExpandModalProps = {
  src: string | null
  alt: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImageExpandModal({
  src,
  alt,
  open,
  onOpenChange,
}: ImageExpandModalProps) {
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!open) return
    scrollYRef.current = window.scrollY
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

  if (!src) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideClose
        disableSlide
        overlayClassName="bg-black/90 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-300"
        aria-label={`Expanded image: ${alt}`}
        onClick={() => handleOpenChange(false)}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="fixed inset-0 left-0 top-0 z-[10005] flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center border-0 bg-transparent p-4 shadow-none outline-none md:p-6 cursor-zoom-out duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
      >
        <DialogTitle className="sr-only">Expanded View of Image</DialogTitle>
        <DialogDescription className="sr-only">
          Expanded lightbox viewer showing details for: {alt}
        </DialogDescription>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleOpenChange(false)
          }}
          className="absolute right-4 top-4 z-[10006] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-rellia-mint focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Close expanded view"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center overflow-hidden rounded-2xl cursor-default"
        >
          <img
            src={src}
            alt={alt}
            className="h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain rounded-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
