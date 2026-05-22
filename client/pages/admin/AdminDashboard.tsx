import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
import AdminSubmissionHubCard from "@/components/admin/AdminSubmissionHubCard"
import {
  countRecentSubmissions,
  isActiveSubmissionStatus,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import {
  cmsContentQueryKey,
  fetchCmsContentQueue,
  isCmsContentEnabled,
} from "@/lib/adminSanityContent"
import { CalendarClock, FileEdit, Inbox, Mail, Stethoscope } from "lucide-react"
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
  accentClass: string
}

const OverviewStat = ({ icon: Icon, value, label, accentClass }: OverviewStatProps) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_12px_40px_-24px_rgba(13,53,64,0.35)]",
      accentClass,
    )}
  >
    <div
      className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rellia-mint/20 blur-2xl"
      aria-hidden
    />
    <div className="relative flex items-start justify-between gap-3">
      <div>
        <p className="font-urbanist text-xs font-medium uppercase tracking-[0.1em] text-black/45">
          {label}
        </p>
        <p className="mt-2 font-host-grotesk text-3xl font-bold tracking-tight text-rellia-teal">
          {value}
        </p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rellia-mint/25 text-rellia-teal">
        <Icon className="h-5 w-5" aria-hidden strokeWidth={1.5} />
      </span>
    </div>
  </div>
)

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: fetchDashboardData,
  })

  const cmsEnabled = isCmsContentEnabled()
  const { data: cmsRows, isLoading: cmsLoading } = useQuery({
    queryKey: cmsContentQueryKey(),
    queryFn: fetchCmsContentQueue,
    staleTime: 60_000,
    enabled: cmsEnabled,
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

  const draftCount = cmsRows?.length ?? 0

  const contactRecentHint =
    recentContactCount > 0
      ? `${recentContactCount} new this week`
      : "No new submissions this week"

  const diagnosticRecentHint =
    recentDiagnosticCount > 0
      ? `${recentDiagnosticCount} new this week`
      : "No new submissions this week"

  const contentRecentHint = cmsLoading
    ? "Loading…"
    : draftCount === 0
      ? "No unpublished drafts"
      : `${draftCount} unpublished draft${draftCount === 1 ? "" : "s"}`

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-host-grotesk text-3xl font-bold tracking-tight text-black md:text-4xl">
          Overview
        </h1>
        <AdminSystemStatus />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <OverviewStat
          icon={Inbox}
          value={isLoading ? "—" : activeInquiries}
          label="Active inquiries"
          accentClass="ring-1 ring-rellia-teal/10"
        />
        <OverviewStat
          icon={Stethoscope}
          value={isLoading ? "—" : profiles.length}
          label="Diagnostic submissions"
          accentClass="ring-1 ring-rellia-mint/30"
        />
        <OverviewStat
          icon={CalendarClock}
          value={isLoading ? "—" : newThisWeek}
          label="New this week"
          accentClass="ring-1 ring-black/5"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-urbanist text-sm text-red-700">
          Could not load dashboard metrics: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-host-grotesk text-lg font-semibold text-black">View submissions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <AdminSubmissionHubCard
            title="Content drafts"
            to="/admin/content"
            recentHint={contentRecentHint}
            icon={FileEdit}
          />
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
