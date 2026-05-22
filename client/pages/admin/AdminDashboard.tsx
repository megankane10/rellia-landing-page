import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSanityDrafts from "@/components/admin/AdminSanityDrafts"
import AdminContactSubmissions, {
  type ContactSubmission,
} from "@/components/admin/AdminContactSubmissions"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
import { BarChart3, Inbox, LineChart, Stethoscope } from "lucide-react"

type CompanyProfile = {
  id: string
  created_at: string
  name: string
  work_email: string
  company_name: string
  stage: string | null
  description: string | null
}

const fetchProfiles = async (): Promise<CompanyProfile[]> => {
  const { data, error } = await supabase
    .from("company_profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

const fetchContactCount = async (): Promise<number> => {
  const { data, error } = await supabase.from("contact_responses").select("id, status")
  if (error) return 0
  const rows = (data ?? []) as Pick<ContactSubmission, "id" | "status">[]
  return rows.filter((r) => {
    const s = r.status ?? "New"
    return s === "New" || s === "In Progress"
  }).length
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })

const MetricCard = ({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string | number
  hint: string
  icon: typeof BarChart3
}) => (
  <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
    <CardContent className="flex gap-4 p-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rellia-mint/25 text-rellia-teal">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <p className="font-urbanist text-xs font-medium uppercase tracking-[0.12em] text-black/45">
          {label}
        </p>
        <p className="mt-1 font-host-grotesk text-2xl font-bold text-rellia-teal">{value}</p>
        <p className="mt-1 font-urbanist text-xs text-black/50">{hint}</p>
      </div>
    </CardContent>
  </Card>
)

const AdminDashboard = () => {
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ["admin-company-profiles"],
    queryFn: fetchProfiles,
  })

  const { data: activeInquiries = 0, isLoading: contactsLoading } = useQuery({
    queryKey: ["admin-dashboard-metrics"],
    queryFn: fetchContactCount,
  })

  const submissionCount = profiles?.length ?? 0

  const recentProfiles = useMemo(() => (profiles ?? []).slice(0, 6), [profiles])

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-host-grotesk text-3xl font-bold tracking-tight text-rellia-teal">
            Operations dashboard
          </h1>
          <p className="mt-1 font-urbanist text-sm text-black/60">
            Diagnostics, inquiries, and content workflow in one place.
          </p>
        </div>
        <AdminSystemStatus />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Total diagnostic submissions"
          value={isLoading ? "—" : submissionCount}
          hint="Company profiles from the startup diagnostic"
          icon={Stethoscope}
        />
        <MetricCard
          label="Active inquiries"
          value={contactsLoading ? "—" : activeInquiries}
          hint="Contact form leads marked New or In Progress"
          icon={Inbox}
        />
        <Card className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50/80 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-slate-600">
              <LineChart className="h-5 w-5" aria-hidden />
              <CardTitle className="font-host-grotesk text-base text-slate-800">
                Traffic overview
              </CardTitle>
            </div>
            <CardDescription className="font-urbanist text-xs text-slate-500">
              Google Looker Studio embed — coming soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-[16/10] min-h-[140px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 text-center">
              <p className="font-urbanist text-xs text-slate-500">
                Analytics iframe placeholder
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div>
            <h2 className="font-host-grotesk text-xl font-semibold text-rellia-teal">
              Diagnostic submissions
            </h2>
            <p className="mt-1 font-urbanist text-sm text-black/55">
              {submissionCount} total submission{submissionCount !== 1 ? "s" : ""}
            </p>
          </div>

          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-[20px]" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 font-urbanist text-sm text-red-700">
              Failed to load submissions: {error instanceof Error ? error.message : "Unknown error"}
            </div>
          )}

          {profiles && profiles.length === 0 && (
            <p className="font-urbanist text-black/60">No diagnostic submissions yet.</p>
          )}

          {recentProfiles.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentProfiles.map((p) => (
                <Link key={p.id} to={`/admin/companies/${p.id}`} className="group">
                  <Card className="h-full rounded-[20px] border border-black/10 bg-white shadow-sm transition-shadow group-hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-host-grotesk text-base font-semibold text-rellia-teal">
                        {p.company_name}
                      </CardTitle>
                      <CardDescription className="font-urbanist text-xs text-black/60">
                        {p.name} · {p.work_email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-2">
                      {p.stage && (
                        <Badge className="rounded-full bg-rellia-mint/90 font-urbanist text-rellia-teal hover:bg-rellia-mint">
                          {p.stage}
                        </Badge>
                      )}
                      <span className="ml-auto font-urbanist text-xs text-black/50">
                        {formatDate(p.created_at)}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <AdminSanityDrafts />
        </div>
      </div>

      <AdminContactSubmissions />
    </div>
  )
}

export default AdminDashboard
