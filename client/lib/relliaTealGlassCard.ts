import { cn } from "@/lib/utils"

/**
 * Frosted panels on teal / photographic hero bands (About Values, Network Impact metrics).
 * `translateZ(0)` promotes a compositor layer so `backdrop-filter` behaves consistently
 * across mobile and desktop.
 */
export const relliaTealGlassCardClass = cn(
  "rounded-2xl border border-white/28 bg-white/8 shadow-[0_18px_60px_-36px_rgba(0,0,0,0.45)]",
  "backdrop-blur-xl [-webkit-backdrop-filter:blur(20px)] [transform:translateZ(0)]",
)
