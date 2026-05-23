import { useMemo, useState, type ReactNode } from "react"
import { Link, Navigate, Route, Routes, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam } from "@/lib/adminApi"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
import AdminSubmissionHubCard from "@/components/admin/AdminSubmissionHubCard"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import AdminSubmissionStatusFilter from "@/components/admin/AdminSubmissionStatusFilter"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  countByStatusFilter,
  countRecentSubmissions,
  formatAdminDate,
  isActiveSubmissionStatus,
  matchesStatusFilter,
  statusBadgeClass,
  type StatusFilterValue,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import {
  cmsContentQueryKey,
  fetchCmsContentQueue,
  formatCmsDocumentTypeLabel,
  isCmsContentEnabled,
} from "@/lib/adminSanityContent"
import { cn } from "@/lib/utils"
import { ExternalLink, FileEdit, Inbox, Mail, Stethoscope, Users } from "lucide-react"

const ADMIN_CARD = "rounded-3xl border border-black/[0.06] bg-white"
const SUPABASE_AUTH_USERS_URL =
  "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy/auth/users"

// ─── Shared types ─────────────────────────────────────────────────────────────

type CompanyProfileRow = {
  id: string
  created_at: string
  name: string
  work_email: string
  company_name: string
  stage: string | null
  description: string | null
  status?: SubmissionStatus | null
}

type ContactRow = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  company: string | null
  job_title: string | null
  message: string
  status?: SubmissionStatus | null
}

type SubmissionTab = "contact" | "diagnostic"

const fetchDashboardData = async () => {
  const [profilesRes, contactsRes] = await Promise.all([
    supabase.from("company_profiles").select("id, created_at, status").order("created_at", { ascending: false }),
    supabase.from("contact_responses").select("id, created_at, status").order("created_at", { ascending: false }),
  ])
  if (profilesRes.error) throw new Error(profilesRes.error.message)
  if (contactsRes.error) throw new Error(contactsRes.error.message)
  return {
    profiles: (profilesRes.data ?? []) as CompanyProfileRow[],
    contacts: (contactsRes.data ?? []) as ContactRow[],
  }
}

const fetchContacts = async (): Promise<ContactRow[]> => {
  const { data, error } = await supabase.from("contact_responses").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as ContactRow[]
}

const fetchProfiles = async (): Promise<CompanyProfileRow[]> => {
  const { data, error } = await supabase.from("company_profiles").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as CompanyProfileRow[]
}

const PageHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div>
    <h1 className="font-host-grotesk text-2xl tracking-tight text-black md:text-[1.75rem]">{title}</h1>
    {subtitle ? <p className="mt-2 font-urbanist text-sm text-black/55">{subtitle}</p> : null}
  </div>
)

const OverviewStat = ({
  value,
  label,
  hint,
}: {
  value: string | number
  label: string
  hint: string
}) => (
  <div className={cn(ADMIN_CARD, "p-5")}>
    <p className="font-urbanist text-xs text-black/45">{label}</p>
    <p className="mt-1 font-host-grotesk text-3xl tracking-tight text-rellia-teal">{value}</p>
    <p className="mt-2 font-urbanist text-xs text-black/50">{hint}</p>
  </div>
)

// ─── Overview ─────────────────────────────────────────────────────────────────

const OverviewPage = () => {
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

  const unresolvedDiagnostics = useMemo(
    () => profiles.filter((row) => isActiveSubmissionStatus(row.status)).length,
    [profiles],
  )

  const draftCount = cmsRows?.length ?? 0
  const recentContactCount = useMemo(() => countRecentSubmissions(contacts), [contacts])
  const recentDiagnosticCount = useMemo(() => countRecentSubmissions(profiles), [profiles])

  const contactRecentHint =
    recentContactCount > 0 ? `${recentContactCount} new this week` : "No new submissions this week"

  const diagnosticRecentHint =
    recentDiagnosticCount > 0 ? `${recentDiagnosticCount} new this week` : "No new submissions this week"

  const contentRecentHint = cmsLoading
    ? "Loading…"
    : draftCount === 0
      ? "No unpublished drafts"
      : `${draftCount} unpublished draft${draftCount === 1 ? "" : "s"}`

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeading title="Overview" />
        <AdminSystemStatus />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <OverviewStat
          value={isLoading ? "—" : activeInquiries}
          label="Active inquiries"
          hint="Contact form · open items"
        />
        <OverviewStat
          value={isLoading ? "—" : unresolvedDiagnostics}
          label="Diagnostic submissions"
          hint="Unresolved startup diagnostics"
        />
        <OverviewStat
          value={cmsLoading ? "—" : draftCount}
          label="Unpublished drafts"
          hint={contentRecentHint}
        />
      </div>

      {error ? (
        <div className={cn(ADMIN_CARD, "border-red-200 bg-red-50 px-4 py-3 font-urbanist text-sm text-red-700")}>
          Could not load dashboard metrics: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-host-grotesk text-lg text-black/90">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AdminSubmissionHubCard
            title="Contact Form"
            to="/admin/submissions?tab=contact"
            recentHint={contactRecentHint}
            icon={Mail}
          />
          <AdminSubmissionHubCard
            title="Startup Diagnostic"
            to="/admin/submissions?tab=diagnostic"
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

// ─── Submissions ──────────────────────────────────────────────────────────────

const SubmissionTabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-full px-4 py-2 font-urbanist text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
      active ? "bg-rellia-mint/35 text-rellia-teal" : "text-black/45 hover:bg-black/[0.06] hover:text-black/65",
    )}
  >
    {children}
  </button>
)

const StatusTag = ({ status }: { status: SubmissionStatus }) => (
  <Badge variant="outline" className={cn("rounded-full font-urbanist text-xs", statusBadgeClass(status))}>
    {status}
  </Badge>
)

const LIST_CARD =
  "rounded-3xl border border-black/[0.07] bg-white/90 p-4 transition-shadow hover:shadow-[0_8px_30px_-20px_rgba(13,53,64,0.25)]"

const ContactSubmissionCard = ({ row }: { row: ContactRow }) => {
  const status = (row.status ?? "New") as SubmissionStatus
  return (
    <li className={LIST_CARD}>
      <Link to={`/admin/contacts/${row.id}`} className="flex items-center justify-between gap-4 group">
        <div className="min-w-0 flex-1">
          <p className="font-host-grotesk text-base text-black/90 group-hover:text-rellia-teal">
            {row.first_name} {row.last_name}
          </p>
          <p className="mt-1 font-urbanist text-sm text-black/55">
            {[row.company, formatAdminDate(row.created_at)].filter(Boolean).join(" · ")}
          </p>
        </div>
        <StatusTag status={status} />
      </Link>
    </li>
  )
}

const DiagnosticSubmissionCard = ({ row }: { row: CompanyProfileRow }) => {
  const status = (row.status ?? "New") as SubmissionStatus
  return (
    <li className={LIST_CARD}>
      <Link to={`/admin/companies/${row.id}`} className="flex items-center justify-between gap-4 group">
        <div className="min-w-0 flex-1">
          <p className="font-host-grotesk text-base text-black/90 group-hover:text-rellia-teal">
            {row.company_name}
          </p>
          <p className="mt-1 font-urbanist text-sm text-black/55">
            {row.name}
            {row.stage ? ` · ${row.stage}` : ""} · {formatAdminDate(row.created_at)}
          </p>
        </div>
        <StatusTag status={status} />
      </Link>
    </li>
  )
}

const SubmissionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")
  const tab: SubmissionTab = tabParam === "diagnostic" ? "diagnostic" : "contact"
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all")

  const setTab = (next: SubmissionTab) => {
    setSearchParams({ tab: next }, { replace: true })
    setStatusFilter("all")
  }

  const contactsQuery = useQuery({ queryKey: ["admin-contact-submissions"], queryFn: fetchContacts })
  const diagnosticsQuery = useQuery({ queryKey: ["admin-company-profiles"], queryFn: fetchProfiles })

  const rows = tab === "contact" ? (contactsQuery.data ?? []) : (diagnosticsQuery.data ?? [])
  const isLoading = tab === "contact" ? contactsQuery.isLoading : diagnosticsQuery.isLoading
  const error = tab === "contact" ? contactsQuery.error : diagnosticsQuery.error

  const statusCounts = useMemo(() => countByStatusFilter(rows), [rows])
  const filteredRows = useMemo(
    () => rows.filter((row) => matchesStatusFilter(row, statusFilter)),
    [rows, statusFilter],
  )

  return (
    <div className="space-y-6">
      <PageHeading
        title="Submissions"
        subtitle="View user submissions from the contact form and startup diagnostic."
      />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Submission type">
        <SubmissionTabButton active={tab === "contact"} onClick={() => setTab("contact")}>
          Contact
        </SubmissionTabButton>
        <SubmissionTabButton active={tab === "diagnostic"} onClick={() => setTab("diagnostic")}>
          Diagnostics
        </SubmissionTabButton>
      </div>

      <AdminSubmissionStatusFilter value={statusFilter} onChange={setStatusFilter} counts={statusCounts} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-3xl" />
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="font-urbanist text-sm text-red-700">
          Failed to load submissions: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      ) : null}

      {!isLoading && !error && filteredRows.length === 0 ? (
        <AdminCompactEmptyState
          icon={tab === "contact" ? Inbox : Stethoscope}
          title="No submissions match this filter"
          description={
            statusFilter === "all"
              ? tab === "contact"
                ? "Contact form messages will appear here."
                : "Startup diagnostic submissions will appear here."
              : `No items with status “${statusFilter}”.`
          }
        />
      ) : null}

      <ul className="space-y-3">
        {tab === "contact"
          ? (filteredRows as ContactRow[]).map((row) => <ContactSubmissionCard key={row.id} row={row} />)
          : (filteredRows as CompanyProfileRow[]).map((row) => (
              <DiagnosticSubmissionCard key={row.id} row={row} />
            ))}
      </ul>
    </div>
  )
}

// ─── Team ─────────────────────────────────────────────────────────────────────

const TeamPage = () => {
  const { session } = useAuth()
  const token = session?.access_token ?? ""

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["admin-team", token],
    queryFn: () => fetchAdminTeam(token),
    enabled: Boolean(token),
    staleTime: 60_000,
  })

  return (
    <div className="space-y-8">
      <PageHeading title="Team" subtitle="Admin accounts with access to this dashboard." />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-3xl" />
          ))}
        </div>
      ) : null}

      {error ? (
        <p className={cn(ADMIN_CARD, "px-4 py-3 font-urbanist text-sm text-red-700")}>
          {error instanceof Error ? error.message : "Could not load team members."}
        </p>
      ) : null}

      {!isLoading && !error && users.length > 0 ? (
        <ul className={cn("divide-y divide-black/[0.06]", ADMIN_CARD)}>
          {users.map((member) => (
            <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="font-urbanist text-sm text-black/85">{member.email}</p>
                <p className="mt-0.5 font-urbanist text-xs text-black/45">
                  Joined {formatAdminDate(member.createdAt)}
                  {member.lastSignInAt
                    ? ` · Last sign-in ${formatAdminDate(member.lastSignInAt)}`
                    : " · Never signed in"}
                </p>
              </div>
              {member.confirmedAt ? (
                <span className="rounded-full bg-rellia-mint/25 px-2.5 py-0.5 font-urbanist text-xs text-rellia-teal">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-urbanist text-xs text-amber-900">
                  Invite pending
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {!isLoading && !error && users.length === 0 ? (
        <AdminCompactEmptyState
          icon={Users}
          title="No team members found"
          description="Invite colleagues from Supabase Auth to grant dashboard access."
        />
      ) : null}

      <div className={cn(ADMIN_CARD, "bg-rellia-mint/10 px-5 py-4")}>
        <p className="font-urbanist text-sm leading-relaxed text-black/70">
          To invite new admins, add users in Supabase Auth. They will receive an email invitation to set a
          password.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          asChild
          className="mt-4 rounded-full border-rellia-teal/20 text-rellia-teal hover:bg-rellia-mint/15"
        >
          <a href={SUPABASE_AUTH_USERS_URL} target="_blank" rel="noopener noreferrer">
            Open Supabase Auth
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
          </a>
        </Button>
      </div>
    </div>
  )
}

// ─── Content drafts ───────────────────────────────────────────────────────────

const ContentDraftsPage = () => {
  const cmsConfigured = isCmsContentEnabled()
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const { data, isLoading, error } = useQuery({
    queryKey: cmsContentQueryKey(),
    queryFn: fetchCmsContentQueue,
    staleTime: 60_000,
    enabled: cmsConfigured,
  })

  const draftRows = data ?? []

  const typeOptions = useMemo(() => {
    const types = [...new Set(draftRows.map((row) => row._type))].sort()
    return types
  }, [draftRows])

  const filteredRows = useMemo(() => {
    if (typeFilter === "all") return draftRows
    return draftRows.filter((row) => row._type === typeFilter)
  }, [draftRows, typeFilter])

  return (
    <div className="space-y-6">
      <PageHeading
        title="Content drafts"
        subtitle="Unpublished Sanity drafts — publish in Studio when ready."
      />

      {!cmsConfigured ? (
        <p className={cn(ADMIN_CARD, "border-amber-200/70 bg-amber-50/80 px-4 py-3 font-urbanist text-sm text-amber-950")}>
          CMS is not configured. Set <code className="text-xs">VITE_SANITY_PROJECT_ID</code> and{" "}
          <code className="text-xs">VITE_SANITY_DATASET</code> on this deployment.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={cn(
                "rounded-full px-3 py-1.5 font-urbanist text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
                typeFilter === "all"
                  ? "bg-rellia-mint/35 text-rellia-teal"
                  : "text-black/45 hover:bg-black/[0.06]",
              )}
            >
              All ({draftRows.length})
            </button>
            {typeOptions.map((type) => {
              const count = draftRows.filter((row) => row._type === type).length
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-urbanist text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
                    typeFilter === type
                      ? "bg-rellia-mint/35 text-rellia-teal"
                      : "text-black/45 hover:bg-black/[0.06]",
                  )}
                >
                  {formatCmsDocumentTypeLabel(type)} ({count})
                </button>
              )
            })}
          </div>

          <AdminContentQueueList
            rows={filteredRows}
            isLoading={isLoading}
            error={error}
            dataset=""
            emptyTitle="No drafts in this category"
            groupByType={false}
          />
        </>
      )}
    </div>
  )
}

// ─── Router (single entry file) ───────────────────────────────────────────────

const AdminDashboard = () => (
  <Routes>
    <Route index element={<Navigate to="overview" replace />} />
    <Route path="overview" element={<OverviewPage />} />
    <Route path="submissions" element={<SubmissionsPage />} />
    <Route path="team" element={<TeamPage />} />
    <Route path="content" element={<ContentDraftsPage />} />
    <Route path="*" element={<Navigate to="overview" replace />} />
  </Routes>
)

export default AdminDashboard
