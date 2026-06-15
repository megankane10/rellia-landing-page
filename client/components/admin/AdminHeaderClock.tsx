import { useEffect, useState } from "react"
import { Clock3 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "admin:header-clock-expanded"

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

const readExpandedPreference = (): boolean => {
  if (typeof window === "undefined") return true
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === null) return true
  return stored === "true"
}

type AdminHeaderClockProps = {
  className?: string
}

const AdminHeaderClock = ({ className }: AdminHeaderClockProps) => {
  const prefersReducedMotion = useReducedMotion()
  const [now, setNow] = useState(() => new Date())
  const [expanded, setExpanded] = useState(readExpandedPreference)

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(intervalId)
  }, [])

  const handleToggle = () => {
    setExpanded((prev) => {
      const next = !prev
      window.localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  const slideTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "hidden items-center gap-2.5 rounded-lg px-0.5 py-1 font-urbanist sm:flex",
        "text-left transition-colors hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
        className,
      )}
      aria-expanded={expanded}
      aria-label={
        expanded
          ? `Hide date and time. Currently ${formatDate(now)} ${formatTime(now)}`
          : "Show date and time"
      }
    >
      <Clock3
        className="h-5 w-5 shrink-0 text-rellia-teal"
        strokeWidth={1.75}
        aria-hidden
      />

      <motion.div
        className="flex min-w-0 items-center overflow-hidden"
        initial={false}
        animate={{
          maxWidth: expanded ? 420 : 0,
          opacity: expanded ? 1 : 0,
          x: expanded ? 0 : -10,
        }}
        transition={slideTransition}
        aria-hidden={!expanded}
      >
        <div className="flex items-center gap-3 whitespace-nowrap pr-0.5">
          <span className="text-lg font-semibold text-foreground">{formatDate(now)}</span>
          <div className="h-5 w-px shrink-0 bg-border/80" aria-hidden />
          <time
            dateTime={now.toISOString()}
            className="text-lg font-normal tabular-nums text-muted-foreground"
          >
            {formatTime(now)}
          </time>
        </div>
      </motion.div>

      <span className="sr-only" aria-live="polite">
        {formatDate(now)} {formatTime(now)}
      </span>
    </button>
  )
}

export default AdminHeaderClock
