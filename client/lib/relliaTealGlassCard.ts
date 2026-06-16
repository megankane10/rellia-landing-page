import { cn } from "@/lib/utils"

/**
 * Frosted panels on teal / photographic hero bands (About Values, Network Impact metrics).
 * `translateZ(0)` promotes a compositor layer so `backdrop-filter` behaves consistently
 * across mobile and desktop.
 */
export const relliaTealGlassCardClass = cn(
  "rounded-2xl border border-white/32 bg-white/14 shadow-[0_18px_60px_-36px_rgba(0,0,0,0.45)]",
  "backdrop-blur-2xl [-webkit-backdrop-filter:blur(26px)] [transform:translateZ(0)]",
)

/** Frosted panel on light backgrounds with decorative imagery behind. */
export const relliaLightFrostCardClass = cn(
  "rounded-2xl border border-black/10 bg-white/70 shadow-sm",
  "backdrop-blur-md [-webkit-backdrop-filter:blur(14px)] [transform:translateZ(0)]",
)
