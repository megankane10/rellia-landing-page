import type { CSSProperties, ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type AdminPageRevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

/** Route enter — translate only (no opacity/blur) so the canvas never flashes white between admin pages */
const AdminPageReveal = ({ children, delay = 0, className }: AdminPageRevealProps) => {
  const reduceMotion = useReducedMotion()

  const motionStyle: CSSProperties | undefined = reduceMotion
    ? undefined
    : { animationDelay: `${delay}s` }

  return (
    <div
      className={cn(!reduceMotion && "animate-admin-page-enter", className)}
      style={motionStyle}
    >
      {children}
    </div>
  )
}

export default AdminPageReveal
