import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

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

type AdminHeaderClockProps = {
  className?: string
}

const AdminHeaderClock = ({ className }: AdminHeaderClockProps) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    const intervalId = window.setInterval(tick, 30_000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div
      className={cn("hidden items-center gap-3 font-urbanist sm:flex", className)}
      aria-live="polite"
      aria-label={`Current date and time: ${formatDate(now)} ${formatTime(now)}`}
    >
      <span className="whitespace-nowrap text-lg font-semibold text-foreground">{formatDate(now)}</span>
      <div className="h-5 w-px shrink-0 bg-border/80" aria-hidden />
      <span className="whitespace-nowrap text-lg font-normal tabular-nums text-muted-foreground">
        {formatTime(now)}
      </span>
    </div>
  )
}

export default AdminHeaderClock
