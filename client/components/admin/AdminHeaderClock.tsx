import { useEffect, useState } from "react"
import { Clock3 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
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

  const toggleLabel = expanded ? "Hide date and time" : "Show date and time"

  return (
    <div
      className={cn("hidden items-center gap-2.5 font-urbanist md:flex", className)}
      aria-live="polite"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-transparent",
              "text-rellia-teal transition-[background-color,border-color,box-shadow]",
              "hover:border-rellia-teal/25 hover:bg-rellia-mint/15 dark:text-rellia-mint",
              "dark:hover:border-rellia-mint/25 dark:hover:bg-rellia-mint/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
            )}
            aria-expanded={expanded}
            aria-label={toggleLabel}
          >
            <Clock3 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </button>
        </TooltipTrigger>
        <AdminTooltipContent side="bottom" align="center">
          {toggleLabel}
        </AdminTooltipContent>
      </Tooltip>

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

      <span className="sr-only">
        {formatDate(now)} {formatTime(now)}
      </span>
    </div>
  )
}

export default AdminHeaderClock
