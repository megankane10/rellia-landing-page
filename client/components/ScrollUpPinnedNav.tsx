import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollUpPinnedNavProps = {
  children: ReactNode
  /** Landmark label, e.g. "Breadcrumb" */
  ariaLabel: string
  className?: string
}

/**
 * Fixed bar directly under the navbar (72px / 86px). Visible at the top of the page;
 * hides while scrolling down; reappears pinned under the navbar when scrolling up.
 */
export const ScrollUpPinnedNav = ({ children, ariaLabel, className }: ScrollUpPinnedNavProps) => {
  const [pinned, setPinned] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPinned(true)
        return
      }

      const y = window.scrollY
      const delta = y - lastY.current
      lastY.current = y

      if (y < 56) {
        setPinned(true)
        return
      }

      if (delta > 10) setPinned(false)
      else if (delta < -10) setPinned(true)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "fixed inset-x-0 top-[72px] z-40 border-b border-black/[0.06] bg-gradient-to-r from-rellia-cream/90 to-white/95 backdrop-blur-md md:top-[86px]",
        "transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none",
        pinned ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0",
        className,
      )}
    >
      {children}
    </nav>
  )
}
