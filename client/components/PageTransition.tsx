import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

type TransitionPhase = "idle" | "enter"

const OVERLAY_MS = 900

/** Toggle to re-enable the teal wipe + logo overlay between routes */
const PAGE_TRANSITION_ENABLED = false

export default function PageTransition() {
  const location = useLocation()
  const [phase, setPhase] = useState<TransitionPhase>("idle")
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!PAGE_TRANSITION_ENABLED) return
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)

    setPhase("enter")
    timeoutRef.current = window.setTimeout(() => setPhase("idle"), OVERLAY_MS)

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [location.pathname])

  if (!PAGE_TRANSITION_ENABLED) return null

  return (
    <AnimatePresence>
      {phase !== "idle" ? (
        <motion.div
          key={location.pathname}
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 0, x: 42, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            opacity: 0,
            x: -48,
            filter: "blur(14px)",
            transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          {/* teal wipe */}
          <motion.div
            className="absolute inset-0 bg-rellia-teal"
            initial={{ x: "-100%" }}
            animate={{
              x: ["-100%", "0%", "0%", "100%"],
              transition: {
                duration: 0.9,
                times: [0, 0.22, 0.78, 1],
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          />

          {/* logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src="/images/hologram-logo.png"
              alt="Rellia hologram logo"
              className="h-20 w-20 md:h-24 md:w-24 drop-shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.85, 1, 1, 0.95],
                rotate: 360,
                transition: { duration: 0.9, times: [0, 0.22, 0.78, 1], ease: [0.4, 0, 0.2, 1] },
              }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

