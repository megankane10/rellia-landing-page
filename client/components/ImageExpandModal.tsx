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
  if (!src) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        aria-label={`Expanded image: ${alt}`}
        className="fixed inset-0 z-[10005] flex max-w-none items-center justify-center border-0 bg-black/90 p-4 md:p-6 outline-none backdrop-blur-md transition-all duration-300"
      >
        <DialogTitle className="sr-only">Expanded View of Image</DialogTitle>
        <DialogDescription className="sr-only">
          Expanded lightbox viewer showing details for: {alt}
        </DialogDescription>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-[10006] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-rellia-mint focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Close expanded view"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center overflow-hidden rounded-2xl">
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
