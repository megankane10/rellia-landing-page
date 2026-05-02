import type { ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

/**
 * Founder/advisor directory detail: desktop = large dialog; mobile = bottom sheet with drag handle,
 * ~full height, swipe-down hint on handle (drag to dismiss).
 */
export default function NetworkDirectoryModal({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  const isMobile = useIsMobile()
  const reduceMotion = useReducedMotion()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={cn(
            "flex max-h-[92dvh] flex-col gap-0 rounded-t-[28px] border-0 bg-white p-0 pt-2",
            "mt-[max(0.75rem,env(safe-area-inset-top))]",
          )}
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Directory profile</SheetTitle>
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (reduceMotion) return
              if (info.offset.y > 72 || info.velocity.y > 420) {
                onOpenChange(false)
              }
            }}
            className="flex shrink-0 cursor-grab touch-none justify-center pb-2 pt-1 active:cursor-grabbing"
          >
            <div className="h-1.5 w-12 rounded-full bg-black/20" aria-hidden />
          </motion.div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 md:px-8">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,920px)] w-[min(92vw,960px)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-black/10 bg-white p-0 sm:max-w-none">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
