import { useEffect, useState } from "react"
import { getSanityDataset, isSanityConfigured, sanityFetch } from "@/lib/sanity"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type ServiceState = "checking" | "online" | "offline" | "unconfigured"

type ServiceStatus = {
  label: string
  detail?: string
  state: ServiceState
}

const stateLabel = (state: ServiceState): string => {
  if (state === "checking") return "Checking"
  if (state === "online") return "Online"
  if (state === "unconfigured") return "Not set up"
  return "Offline"
}

const StatusPill = ({ service }: { service: ServiceStatus }) => (
  <li
    className={cn(
      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-urbanist text-sm",
      service.state === "online" && "border-emerald-200/80 bg-emerald-50/90 text-emerald-900",
      service.state === "checking" && "border-black/10 bg-white/90 text-black/60",
      service.state === "offline" && "border-red-200/80 bg-red-50/90 text-red-800",
      service.state === "unconfigured" && "border-amber-200/80 bg-amber-50/90 text-amber-900",
    )}
    title={service.detail}
  >
    <span
      className={cn(
        "h-1.5 w-1.5 shrink-0 rounded-full",
        service.state === "checking" && "animate-pulse bg-black/30",
        service.state === "online" && "bg-emerald-500",
        service.state === "offline" && "bg-red-500",
        service.state === "unconfigured" && "bg-amber-500",
      )}
      aria-hidden
    />
    <span className="font-medium">{service.label}</span>
    <span className="text-black/40">·</span>
    <span>{stateLabel(service.state)}</span>
    {service.detail ? (
      <>
        <span className="text-black/40">·</span>
        <span className="text-black/55">{service.detail}</span>
      </>
    ) : null}
  </li>
)

const pingSupabase = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("company_profiles")
      .select("id", { count: "exact", head: true })
    return !error
  } catch {
    return false
  }
}

const pingSanity = async (): Promise<"online" | "offline" | "unconfigured"> => {
  if (!isSanityConfigured()) return "unconfigured"
  const data = await sanityFetch<Record<string, unknown>>("globalSettings")
  return data ? "online" : "offline"
}

const AdminSystemStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { label: "Database", state: "checking" },
    { label: "CMS", state: "checking" },
  ])

  useEffect(() => {
    let cancelled = false
    const dataset = getSanityDataset() || "—"

    const run = async () => {
      const [dbOk, cmsState] = await Promise.all([pingSupabase(), pingSanity()])
      if (cancelled) return
      setServices([
        { label: "Database", state: dbOk ? "online" : "offline" },
        {
          label: "CMS",
          state: cmsState,
          detail: cmsState === "unconfigured" ? undefined : `dataset: ${dataset}`,
        },
      ])
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="System status">
      <span className="font-urbanist text-xs font-medium uppercase tracking-[0.12em] text-black/50">
        Status
      </span>
      <ul className="flex flex-wrap items-center gap-2">
        {services.map((service) => (
          <StatusPill key={service.label} service={service} />
        ))}
      </ul>
    </div>
  )
}

export default AdminSystemStatus
