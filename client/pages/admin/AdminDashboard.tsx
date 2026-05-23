import { useMemo, useState, type ReactNode } from "react"
import { Link, Navigate, Route, Routes, useSearchParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam } from "@/lib/adminApi"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
import AdminSubmissionHubCard from "@/components/admin/AdminSubmissionHubCard"
import AdminContentQueueList from "@/components/admin/AdminContentQueueList"
import AdminSubmissionStatusFilter from "@/components/admin/AdminSubmissionStatusFilter"
import AdminSubmissionStatusSelect from "@/components/admin/AdminSubmissionStatusSelect"
import AdminDeleteIconButton from "@/components/admin/AdminDeleteIconButton"
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
const COMPACT_CARD =
  "rounded-2xl border border-black/[0.07] bg-white p-3.5 transition-shadow hover:shadow-[0_6px_24px_-18px_rgba(13,53,64,0.22)]"
const SUPABASE_AUTH_USERS_URL =
  "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy/auth/users"

const countWeekOverWeekDelta = <T extends { created_at: string }>(rows: T[]): number => {
  const week = 7 * 24 * 60 * 60 * 1000
  const now = Date.now()
  const countBetween = (start: number, end: number) =>
    rows.filter((row) => {
      const t = new Date(row.created_at).getTime()
      return t >= start && t < end
    }).length
  return countBetween(now - week, now) - countBetween(now - 2 * week, now - week)
}

const TrendTag = ({ delta }: { delta: number }) => {
  if (delta === 0) {
    return (
      <span className="rounded-full bg-black/[0.05] px-2 py-0.5 font-urbanist text-[10px] text-black/45">
        —
      </span>
    )
  }
  const up = delta > 0
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-urbanist text-[10px]",
        up ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700",
      )}
    >
      {up ? "+" : ""}
      {delta}
    </span>
  )
}

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
    <h1 className="font-host-grotesk text-2xl font-semibold tracking-tight text-black md:text-[1.75rem]">
      {title}
    </h1>
    {subtitle ? <p className="mt-2 font-urbanist text-sm text-black/55">{subtitle}</p> : null}
  </div>
)

const OverviewStat = ({
  value,
  label,
  weekDelta,
}: {
  value: string | number
  label: string
  weekDelta?: number
}) => (
  <div className={cn(ADMIN_CARD, "p-5")}>
    <p className="font-urbanist text-sm font-semibold text-rellia-teal">{label}</p>
    <div className="mt-2 flex items-center gap-2">
      <p className="font-host-grotesk text-3xl tracking-tight text-rellia-teal">{value}</p>
      {weekDelta !== undefined ? <TrendTag delta={weekDelta} /> : null}
    </div>
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

  const contactWeekDelta = useMemo(() => countWeekOverWeekDelta(contacts), [contacts])
  const diagnosticWeekDelta = useMemo(() => countWeekOverWeekDelta(profiles), [profiles])

  const draftTypeSummary = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of cmsRows ?? []) {
      map.set(row._type, (map.get(row._type) ?? 0) + 1)
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [cmsRows])

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
        <PageHeading
          title="Overview"
          subtitle="At-a-glance view of open inquiries, diagnostic submissions, and unpublished CMS drafts."
        />
        <AdminSystemStatus />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <OverviewStat
          value={isLoading ? "—" : activeInquiries}
          label="Active inquiries"
          weekDelta={isLoading ? undefined : contactWeekDelta}
        />
        <OverviewStat
          value={isLoading ? "—" : unresolvedDiagnostics}
          label="Diagnostic submissions"
          weekDelta={isLoading ? undefined : diagnosticWeekDelta}
        />
        <OverviewStat
          value={cmsLoading ? "—" : draftCount}
          label="Unpublished drafts"
        />
      </div>

      {error ? (
        <div className={cn(ADMIN_CARD, "border-red-200 bg-red-50 px-4 py-3 font-urbanist text-sm text-red-700")}>
          Could not load dashboard metrics: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-host-grotesk text-lg font-medium text-black/90">Quick actions</h2>
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

      {cmsEnabled && draftTypeSummary.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-host-grotesk text-lg font-medium text-black/90">CMS draft queue</h2>
              <p className="mt-1 font-urbanist text-sm text-black/55">
                Unpublished Sanity documents by type — open Studio to review and publish.
              </p>
            </div>
            <Link
              to="/admin/content"
              className="font-urbanist text-sm text-rellia-teal hover:underline"
            >
              View all drafts
            </Link>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {draftTypeSummary.map(([type, count]) => (
              <li key={type} className={COMPACT_CARD}>
                <p className="font-host-grotesk text-sm text-black/90">{formatCmsDocumentTypeLabel(type)}</p>
                <p className="mt-0.5 font-urbanist text-xs text-black/50">
                  {count} draft{count === 1 ? "" : "s"} · <span className="font-mono text-[10px]">{type}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
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

const ContactSubmissionCard = ({
  row,
  onStatusChange,
  onDelete,
  statusWritesEnabled,
  updating,
}: {
  row: ContactRow
  onStatusChange: (status: SubmissionStatus) => void
  onDelete: () => void
  statusWritesEnabled: boolean
  updating: boolean
}) => {
  const status = (row.status ?? "New") as SubmissionStatus
  return (
    <li className={COMPACT_CARD}>
      <div className="flex items-center gap-3">
        <Link to={`/admin/contacts/${row.id}`} className="min-w-0 flex-1 group">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-host-grotesk text-sm text-black/90 group-hover:text-rellia-teal">
              {row.first_name} {row.last_name}
            </p>
            <StatusTag status={status} />
          </div>
          <p className="mt-1 font-urbanist text-xs text-black/50">
            {[row.company, formatAdminDate(row.created_at)].filter(Boolean).join(" · ")}
          </p>
        </Link>
        {statusWritesEnabled ? (
          <AdminSubmissionStatusSelect
            value={status}
            disabled={updating}
            ariaLabel={`Status for ${row.first_name} ${row.last_name}`}
            onValueChange={onStatusChange}
          />
        ) : null}
        <AdminDeleteIconButton
          label="Delete contact submission?"
          description="This permanently removes the message from your inbox."
          onConfirm={onDelete}
        />
      </div>
    </li>
  )
}

const DiagnosticSubmissionCard = ({
  row,
  onStatusChange,
  onDelete,
  statusWritesEnabled,
  updating,
}: {
  row: CompanyProfileRow
  onStatusChange: (status: SubmissionStatus) => void
  onDelete: () => void
  statusWritesEnabled: boolean
  updating: boolean
}) => {
  const status = (row.status ?? "New") as SubmissionStatus
  return (
    <li className={COMPACT_CARD}>
      <div className="flex items-center gap-3">
        <Link to={`/admin/companies/${row.id}`} className="min-w-0 flex-1 group">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-host-grotesk text-sm text-black/90 group-hover:text-rellia-teal">
              {row.name}
            </p>
            <StatusTag status={status} />
          </div>
          <p className="mt-1 font-urbanist text-xs text-black/50">{row.work_email}</p>
          <p className="mt-0.5 font-urbanist text-xs text-black/45">
            {row.company_name}
            {row.stage ? ` · ${row.stage}` : ""} · {formatAdminDate(row.created_at)}
          </p>
        </Link>
        {statusWritesEnabled ? (
          <AdminSubmissionStatusSelect
            value={status}
            disabled={updating}
            ariaLabel={`Status for ${row.company_name}`}
            onValueChange={onStatusChange}
          />
        ) : null}
        <AdminDeleteIconButton
          label="Delete diagnostic submission?"
          description="This removes the company profile and linked diagnostic response."
          onConfirm={onDelete}
        />
      </div>
    </li>
  )
}

const SubmissionsPage = () => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")
  const tab: SubmissionTab = tabParam === "diagnostic" ? "diagnostic" : "contact"
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusWritesEnabled, setStatusWritesEnabled] = useState(true)

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

  const handleContactStatus = async (contactId: string, newStatus: SubmissionStatus) => {
    if (!statusWritesEnabled) return
    setUpdatingId(contactId)
    const { error: updateError } = await supabase
      .from("contact_responses")
      .update({ status: newStatus })
      .eq("id", contactId)
    setUpdatingId(null)
    if (updateError) {
      if (updateError.message.includes("status") || updateError.message.includes("policy")) {
        setStatusWritesEnabled(false)
      }
      return
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
  }

  const handleDiagnosticStatus = async (profileId: string, newStatus: SubmissionStatus) => {
    if (!statusWritesEnabled) return
    setUpdatingId(profileId)
    const { error: updateError } = await supabase
      .from("company_profiles")
      .update({ status: newStatus })
      .eq("id", profileId)
    setUpdatingId(null)
    if (updateError) {
      if (updateError.message.includes("status") || updateError.message.includes("policy")) {
        setStatusWritesEnabled(false)
      }
      return
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-company-profiles"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
  }

  const handleContactDelete = async (contactId: string) => {
    const { error: deleteError } = await supabase.from("contact_responses").delete().eq("id", contactId)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
  }

  const handleDiagnosticDelete = async (profileId: string) => {
    const { error: deleteError } = await supabase.from("company_profiles").delete().eq("id", profileId)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-company-profiles"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Submissions"
        subtitle="View user submissions from the contact form and startup diagnostic."
      />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Submission type">
        <SubmissionTabButton active={tab === "contact"} onClick={() => setTab("contact")}>
          Contact Form
        </SubmissionTabButton>
        <SubmissionTabButton active={tab === "diagnostic"} onClick={() => setTab("diagnostic")}>
          Startup Diagnostic
        </SubmissionTabButton>
      </div>

      {!statusWritesEnabled ? (
        <p className={cn(ADMIN_CARD, "border-amber-200/80 bg-amber-50 px-4 py-3 font-urbanist text-sm text-amber-900")}>
          Status updates need Supabase policies. Run{" "}
          <code className="text-xs">scripts/supabase_admin_policies.sql</code> in the SQL editor.
        </p>
      ) : null}

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

      <ul className="grid gap-2 sm:grid-cols-2">
        {tab === "contact"
          ? (filteredRows as ContactRow[]).map((row) => (
              <ContactSubmissionCard
                key={row.id}
                row={row}
                onStatusChange={(value) => void handleContactStatus(row.id, value)}
                onDelete={() => handleContactDelete(row.id)}
                statusWritesEnabled={statusWritesEnabled}
                updating={updatingId === row.id}
              />
            ))
          : (filteredRows as CompanyProfileRow[]).map((row) => (
              <DiagnosticSubmissionCard
                key={row.id}
                row={row}
                onStatusChange={(value) => void handleDiagnosticStatus(row.id, value)}
                onDelete={() => handleDiagnosticDelete(row.id)}
                statusWritesEnabled={statusWritesEnabled}
                updating={updatingId === row.id}
              />
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
        <ul className="grid gap-2 sm:grid-cols-2">
          {users.map((member) => (
            <li key={member.id} className={COMPACT_CARD}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-urbanist text-sm text-black/85">{member.email}</p>
                  <p className="mt-0.5 font-urbanist text-xs text-black/45">
                    Joined {formatAdminDate(member.createdAt)}
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
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {!isLoading && !error && users.some((u) => u.lastSignInAt) ? (
        <section className="space-y-3">
          <h2 className="font-host-grotesk text-base font-medium text-black/90">Recent activity</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[...users]
              .filter((u) => u.lastSignInAt)
              .sort(
                (a, b) =>
                  new Date(b.lastSignInAt!).getTime() - new Date(a.lastSignInAt!).getTime(),
              )
              .slice(0, 8)
              .map((member) => (
                <li key={`activity-${member.id}`} className={COMPACT_CARD}>
                  <p className="font-urbanist text-sm text-black/80">{member.email}</p>
                  <p className="mt-0.5 font-urbanist text-xs text-black/45">
                    Last sign-in {formatAdminDate(member.lastSignInAt!)}
                  </p>
                </li>
              ))}
          </ul>
        </section>
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
