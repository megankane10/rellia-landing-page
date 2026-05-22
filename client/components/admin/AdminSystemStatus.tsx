import { useEffect, useState } from "react"
import { getApiCsrfHeaders } from "@/lib/apiCsrf"
import { supabase } from "@/lib/supabase"
import { isSanityConfigured } from "@/lib/sanity"
import { cn } from "@/lib/utils"

type ServiceState = "checking" | "online" | "offline"

type ServiceStatus = {
  label: string
  state: ServiceState
}

const StatusDot = ({ state }: { state: ServiceState }) => (
  <span
    className={cn(
      "inline-block h-2 w-2 shrink-0 rounded-full",
      state === "checking" && "animate-pulse bg-black/30",
      state === "online" && "animate-pulse bg-emerald-500",
      state === "offline" && "bg-red-500",
    )}
    aria-hidden
  />
)

const pingSupabase = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from("company_profiles").select("id", { count: "exact", head: true })
    return !error
  } catch {
    return false
  }
}

const pingSanity = async (): Promise<boolean> => {
  if (!isSanityConfigured()) return false
  try {
    const csrf = await getApiCsrfHeaders()
    const res = await fetch("/api/sanity/query", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json", ...csrf },
      body: JSON.stringify({ queryId: "globalSettings" }),
    })
    return res.ok
  } catch {
    return false
  }
}

const AdminSystemStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { label: "Database", state: "checking" },
    { label: "CMS API", state: "checking" },
  ])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const [dbOk, cmsOk] = await Promise.all([pingSupabase(), pingSanity()])
      if (cancelled) return
      setServices([
        { label: "Database", state: dbOk ? "online" : "offline" },
        {
          label: cmsOk ? "CMS API" : "CMS API",
          state: isSanityConfigured() ? (cmsOk ? "online" : "offline") : "offline",
        },
      ])
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className="rounded-2xl border border-black/8 bg-white/80 px-4 py-3"
      aria-label="System status"
    >
      <p className="font-host-grotesk text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
        System status
      </p>
      <ul className="mt-2 space-y-1.5">
        {services.map((s) => (
          <li key={s.label} className="flex items-center gap-2 font-urbanist text-xs text-black/65">
            <StatusDot state={s.state} />
            <span>
              {s.label}:{" "}
              {s.state === "checking"
                ? "Checking…"
                : s.state === "online"
                  ? "Online"
                  : "Disrupted"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminSystemStatus
