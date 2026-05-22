import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import AdminSanityDrafts from "@/components/admin/AdminSanityDrafts"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
import AdminSubmissionHubCard from "@/components/admin/AdminSubmissionHubCard"
import {
  countRecentSubmissions,
  isActiveSubmissionStatus,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import { CalendarClock, Inbox, Mail, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"

type CompanyProfileRow = {
  id: string
  created_at: string
  status?: SubmissionStatus | null
}

type ContactRow = {
  id: string
  created_at: string
  status?: SubmissionStatus | null
}

const fetchDashboardData = async () => {
  const [profilesRes, contactsRes] = await Promise.all([
    supabase.from("company_profiles").select("id, created_at, status").order("created_at", { ascending: false }),
    supabase.from("contact_responses").select("id, created_at, status").order("created_at", { ascending: false }),
  ])

  if (profilesRes.error) throw new Error(profilesRes.error.message)
  if (contactsRes.error) throw new Error(contactsRes.error.message)

  const profiles = (profilesRes.data ?? []) as CompanyProfileRow[]
  const contacts = (contactsRes.data ?? []) as ContactRow[]

  return { profiles, contacts }
}

type OverviewStatProps = {
  icon: typeof Inbox
  value: string | number
  label: string
}

const OverviewStat = ({ icon: Icon, value, label }: OverviewStatProps) => (
  <div
    className={cn(
      "rounded-2xl border border-black/[0.06] border-l-4 border-l-rellia-mint bg-rellia-greyTeal px-5 py-5 shadow-sm",
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-urbanist text-xs font-medium uppercase tracking-[0.1em] text-black/50">
          {label}
        </p>
        <p className="mt-2 font-host-grotesk text-3xl font-bold tracking-tight text-rellia-teal">
          {value}
        </p>
      </div>
      <Icon className="h-6 w-6 shrink-0 text-rellia-teal/50" aria-hidden strokeWidth={1.5} />
    </div>
  </div>
)

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: fetchDashboardData,
  })

  const profiles = data?.profiles ?? []
  const contacts = data?.contacts ?? []

  const activeInquiries = useMemo(
    () => contacts.filter((row) => isActiveSubmissionStatus(row.status)).length,
    [contacts],
  )

  const recentContactCount = useMemo(() => countRecentSubmissions(contacts), [contacts])
  const recentDiagnosticCount = useMemo(() => countRecentSubmissions(profiles), [profiles])
  const newThisWeek = recentContactCount + recentDiagnosticCount

  const contactRecentHint =
    recentContactCount > 0
      ? `${recentContactCount} new this week`
      : "No new submissions this week"

  const diagnosticRecentHint =
    recentDiagnosticCount > 0
      ? `${recentDiagnosticCount} new this week`
      : "No new submissions this week"

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-host-grotesk text-2xl font-bold tracking-tight text-black md:text-3xl">
            Overview
          </h1>
          <p className="mt-2 max-w-xl font-urbanist text-base text-black/65">
            Form submissions, Sanity drafts, and connection health for this environment.
          </p>
        </div>
        <AdminSystemStatus />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <OverviewStat
          icon={Inbox}
          value={isLoading ? "—" : activeInquiries}
          label="Active inquiries"
        />
        <OverviewStat
          icon={Stethoscope}
          value={isLoading ? "—" : profiles.length}
          label="Diagnostic submissions"
        />
        <OverviewStat
          icon={CalendarClock}
          value={isLoading ? "—" : newThisWeek}
          label="New this week"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-urbanist text-sm text-red-700">
          Could not load dashboard metrics: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-host-grotesk text-lg font-semibold text-black">View submissions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSubmissionHubCard
            title="Contact Form"
            to="/admin/contacts"
            recentHint={contactRecentHint}
            icon={Mail}
          />
          <AdminSubmissionHubCard
            title="Startup Diagnostic"
            to="/admin/diagnostics"
            recentHint={diagnosticRecentHint}
            icon={Stethoscope}
          />
        </div>
      </section>

      <AdminSanityDrafts />
    </div>
  )
}

export default AdminDashboard
