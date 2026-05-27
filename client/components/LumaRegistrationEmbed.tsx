import { cn } from "@/lib/utils"

type LumaRegistrationEmbedProps = {
  src: string
  title: string
  className?: string
}

/**
 * Luma `/embed/event/…/simple` forms are taller than one mobile viewport.
 * Scroll the wrapper on small screens (iframe uses a tall min-height) so fields are not clipped.
 */
export const LumaRegistrationEmbed = ({ src, title, className }: LumaRegistrationEmbedProps) => {
  return (
    <div
      className={cn(
        "w-full overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]",
        "max-h-[calc(100dvh-5.5rem)] sm:max-h-[calc(100dvh-6.5rem)]",
        "md:max-h-none md:overflow-visible",
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        className={cn(
          "block w-full border-0",
          "min-h-[calc(100dvh-5.5rem)] h-[min(1400px,calc(100dvh-5.5rem))]",
          "md:min-h-[700px] md:h-[700px] md:max-h-none",
        )}
        allow="payment; fullscreen"
      />
    </div>
  )
}
