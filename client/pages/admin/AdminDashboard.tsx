import { useMemo } from "react"
import { Link } from "react-router-dom"
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
import {
  BookOpen,
  Briefcase,
  CalendarClock,
  CalendarDays,
  ExternalLink,
  FileText,
  Inbox,
  Mail,
  Stethoscope,
  Users,
} from "lucide-react"

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

type MetricTileProps = {
  icon: typeof Stethoscope
  value: string | number
  label: string
}

const MetricTile = ({ icon: Icon, value, label }: MetricTileProps) => (
  <div className="rounded-2xl border border-black/[0.07] bg-white/90 px-5 py-4 shadow-sm">
    <div className="flex items-center gap-2.5">
      <Icon className="h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
      <p className="font-host-grotesk text-2xl font-bold tracking-tight text-rellia-teal">{value}</p>
    </div>
    <p className="mt-2 font-urbanist text-sm text-black/65">{label}</p>
  </div>
)

const QUICK_LINKS = [
  { label: "Programs", to: "/programs", icon: Briefcase },
  { label: "Events", to: "/events", icon: CalendarDays },
  { label: "Stories", to: "/stories", icon: BookOpen },
  { label: "Careers", to: "/careers", icon: Users },
  { label: "Apply", to: "/apply", icon: FileText },
  { label: "Public diagnostic", to: "/diagnostics", icon: Stethoscope },
] as const

const STUDIO_URL = "https://relliahealth.sanity.studio"

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
          <p className="mt-2 max-w-xl font-urbanist text-base text-rellia-teal">
            Submissions, content drafts, and service health at a glance.
          </p>
        </div>
        <AdminSystemStatus />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricTile
          icon={Stethoscope}
          value={isLoading ? "—" : profiles.length}
          label="Diagnostic submissions"
        />
        <MetricTile
          icon={Inbox}
          value={isLoading ? "—" : activeInquiries}
          label="Active inquiries"
        />
        <MetricTile
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
            title="Contact"
            to="/admin/contacts"
            total={isLoading ? "—" : contacts.length}
            recentHint={contactRecentHint}
            icon={Mail}
          />
          <AdminSubmissionHubCard
            title="Startup Diagnostic"
            to="/admin/diagnostics"
            total={isLoading ? "—" : profiles.length}
            recentHint={diagnosticRecentHint}
            icon={Stethoscope}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-host-grotesk text-lg font-semibold text-black">Website quick links</h2>
        <p className="font-urbanist text-sm text-black/60">
          Jump to live pages you already manage in Sanity — useful for checking published content after edits.
        </p>
        <ul className="flex flex-wrap gap-2">
          {QUICK_LINKS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-urbanist text-sm text-black/70 transition-colors hover:border-rellia-teal/25 hover:text-rellia-teal"
              >
                <item.icon className="h-4 w-4 text-rellia-teal" aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-urbanist text-sm text-black/70 transition-colors hover:border-rellia-teal/25 hover:text-rellia-teal"
            >
              Sanity Studio
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </li>
        </ul>
        <p className="font-urbanist text-xs text-black/45">
          Possible future tiles: membership checkout stats, FAQ edits queue, founder/advisor directory moderation, or
          event RSVP exports if those flows gain admin APIs.
        </p>
      </section>

      <AdminSanityDrafts />
    </div>
  )
}

export default AdminDashboard
