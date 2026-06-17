import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { isAdminShellRoute } from "@/lib/adminNav"

type RevealPhase = "idle" | "revealing"

const REVEAL_MS = 420

/**
 * Subtle “arrival” reveal on route change.
 * - Does NOT remount routes (so form state etc. stays stable)
 * - Avoids the full teal wipe screen
 * - Smoothes perceived content swaps while CMS revalidates
 */
export default function PageRevealOverlay() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<RevealPhase>("idle")
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduceMotion || isAdminShellRoute(location.pathname)) return
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)

    const start = window.setTimeout(() => setPhase("revealing"), 0)
    timeoutRef.current = window.setTimeout(() => setPhase("idle"), REVEAL_MS)

    return () => {
      window.clearTimeout(start)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [location.pathname, reduceMotion])

  if (reduceMotion || isAdminShellRoute(location.pathname)) return null

  return (
    <AnimatePresence>
      {phase !== "idle" ? (
        <motion.div
          key={location.pathname}
          className="fixed inset-0 z-[9998] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0 }}
        >
          {/* Light “curtain” that lifts away */}
          <div
            aria-hidden
            className="absolute inset-0 bg-white/35 backdrop-blur-md"
          />
          {/* Gentle vignette so the reveal feels intentional on light pages too */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/[0.06] via-transparent to-transparent"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

