import { cn } from "@/lib/utils"

/**
 * Frosted panels on teal / photographic hero bands (About Values, Network Impact metrics).
 * `translateZ(0)` promotes a compositor layer so `backdrop-filter` behaves consistently
 * across mobile and desktop.
 */
export const relliaTealGlassCardClass = cn(
  "rounded-2xl border border-white/18 bg-white/10 shadow-[0_18px_60px_-36px_rgba(0,0,0,0.65)]",
  "md:backdrop-blur-lg md:[-webkit-backdrop-filter:blur(16px)] [transform:translateZ(0)]",
)
