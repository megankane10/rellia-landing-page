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
import AdminSectionCard, { ADMIN_CARD } from "@/components/admin/AdminSectionCard"
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable"
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
import { ExternalLink, FileEdit, Inbox, Stethoscope, Users } from "lucide-react"

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
  submission_type?: string | null
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

const UNRESOLVED_COUNT_KEY = ["admin-unresolved-submissions-count"] as const

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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)]">
      <div className="space-y-6">
        <AdminSectionCard
          title="Overview"
          subtitle="At-a-glance view of open inquiries, diagnostic submissions, and unpublished CMS drafts."
          headerActions={<AdminSystemStatus />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-urbanist text-sm text-red-700">
              Could not load dashboard metrics: {error instanceof Error ? error.message : "Unknown error"}
            </p>
          ) : null}

          {cmsEnabled ? (
            <div className="mt-4">
              <OverviewStat value={cmsLoading ? "—" : draftCount} label="Unpublished drafts" />
            </div>
          ) : null}
        </AdminSectionCard>

        {cmsEnabled && draftTypeSummary.length > 0 ? (
          <AdminSectionCard
            title="CMS draft queue"
            subtitle="Unpublished Sanity documents by type — open Studio to review and publish."
            headerActions={
              <Link to="/admin/content" className="font-urbanist text-sm text-rellia-teal hover:underline">
                View all
              </Link>
            }
          >
            <AdminDataTable
              columns={[
                {
                  key: "type",
                  header: "Document type",
                  cell: ([type, count]) => (
                    <div>
                      <p className="font-host-grotesk text-sm text-black/90">{formatCmsDocumentTypeLabel(type)}</p>
                      <p className="font-mono text-[10px] text-black/40">{type}</p>
                      <p className="font-urbanist text-xs text-black/50">
                        {count} draft{count === 1 ? "" : "s"}
                      </p>
                    </div>
                  ),
                },
              ]}
              rows={draftTypeSummary}
              getRowKey={([type]) => type}
              emptyMessage="No drafts"
            />
          </AdminSectionCard>
        ) : null}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <AdminSectionCard title="Quick actions" subtitle="Jump to common admin tasks.">
          <div className="space-y-3">
            <AdminSubmissionHubCard
              title="Submissions inbox"
              to="/admin/submissions?tab=contact"
              recentHint={contactRecentHint}
              icon={Inbox}
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
        </AdminSectionCard>
      </aside>
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

const contactTypeLabel = (row: ContactRow) => {
  if (row.submission_type === "investor") return "Investor notify"
  return "Contact"
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

  const contactRows = contactsQuery.data ?? []
  const diagnosticRows = diagnosticsQuery.data ?? []
  const isLoading = tab === "contact" ? contactsQuery.isLoading : diagnosticsQuery.isLoading
  const error = tab === "contact" ? contactsQuery.error : diagnosticsQuery.error

  const statusCounts = useMemo(
    () => (tab === "contact" ? countByStatusFilter(contactRows) : countByStatusFilter(diagnosticRows)),
    [tab, contactRows, diagnosticRows],
  )

  const filteredContactRows = useMemo(
    () =>
      [...contactRows]
        .filter((row) => matchesStatusFilter(row, statusFilter))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [contactRows, statusFilter],
  )

  const filteredDiagnosticRows = useMemo(
    () =>
      [...diagnosticRows]
        .filter((row) => matchesStatusFilter(row, statusFilter))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [diagnosticRows, statusFilter],
  )

  const invalidateSubmissionQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
    void queryClient.invalidateQueries({ queryKey: UNRESOLVED_COUNT_KEY })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
  }

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
    invalidateSubmissionQueries(queryClient)
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
    invalidateSubmissionQueries(queryClient)
  }

  const handleContactDelete = async (contactId: string) => {
    const { error: deleteError } = await supabase.from("contact_responses").delete().eq("id", contactId)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] })
    invalidateSubmissionQueries(queryClient)
  }

  const handleDiagnosticDelete = async (profileId: string) => {
    const { error: deleteError } = await supabase.from("company_profiles").delete().eq("id", profileId)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-company-profiles"] })
    invalidateSubmissionQueries(queryClient)
  }

  const contactColumns: AdminTableColumn<ContactRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => (
        <Link to={`/admin/contacts/${row.id}`} className="font-host-grotesk text-sm text-rellia-teal hover:underline">
          {row.first_name} {row.last_name === "." ? "" : row.last_name}
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => (
        <span className="text-black/60">{contactTypeLabel(row)}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => <span className="text-black/70">{row.email}</span>,
    },
    {
      key: "company",
      header: "Company",
      cell: (row) => <span className="text-black/60">{row.company || "—"}</span>,
    },
    {
      key: "date",
      header: "Received",
      cell: (row) => <span className="text-black/50">{formatAdminDate(row.created_at)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const status = (row.status ?? "New") as SubmissionStatus
        return statusWritesEnabled ? (
          <AdminSubmissionStatusSelect
            value={status}
            disabled={updatingId === row.id}
            ariaLabel={`Status for ${row.first_name}`}
            onValueChange={(value) => void handleContactStatus(row.id, value)}
          />
        ) : (
          <StatusTag status={status} />
        )
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (row) => (
        <AdminDeleteIconButton
          label="Delete contact submission?"
          description="This permanently removes the message from your inbox."
          onConfirm={() => void handleContactDelete(row.id)}
        />
      ),
    },
  ]

  const diagnosticColumns: AdminTableColumn<CompanyProfileRow>[] = [
    {
      key: "name",
      header: "Founder",
      cell: (row) => (
        <Link to={`/admin/companies/${row.id}`} className="font-host-grotesk text-sm text-rellia-teal hover:underline">
          {row.name}
        </Link>
      ),
    },
    {
      key: "company",
      header: "Company",
      cell: (row) => <span className="text-black/70">{row.company_name}</span>,
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => <span className="text-black/60">{row.work_email}</span>,
    },
    {
      key: "stage",
      header: "Stage",
      cell: (row) => <span className="text-black/50">{row.stage || "—"}</span>,
    },
    {
      key: "date",
      header: "Received",
      cell: (row) => <span className="text-black/50">{formatAdminDate(row.created_at)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const status = (row.status ?? "New") as SubmissionStatus
        return statusWritesEnabled ? (
          <AdminSubmissionStatusSelect
            value={status}
            disabled={updatingId === row.id}
            ariaLabel={`Status for ${row.company_name}`}
            onValueChange={(value) => void handleDiagnosticStatus(row.id, value)}
          />
        ) : (
          <StatusTag status={status} />
        )
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (row) => (
        <AdminDeleteIconButton
          label="Delete diagnostic submission?"
          description="This removes the company profile and linked diagnostic response."
          onConfirm={() => void handleDiagnosticDelete(row.id)}
        />
      ),
    },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]">
      <AdminSectionCard
        title="Submissions"
        subtitle="Contact form, investor notifications, and startup diagnostic results — newest first."
      >
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Submission type">
          <SubmissionTabButton active={tab === "contact"} onClick={() => setTab("contact")}>
            Inbox
          </SubmissionTabButton>
          <SubmissionTabButton active={tab === "diagnostic"} onClick={() => setTab("diagnostic")}>
            Startup Diagnostic
          </SubmissionTabButton>
        </div>

        {!statusWritesEnabled ? (
          <p className="mb-4 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 font-urbanist text-sm text-amber-900">
            Status updates need Supabase policies. Run{" "}
            <code className="text-xs">scripts/supabase_admin_policies.sql</code> in the SQL editor.
          </p>
        ) : null}

        <AdminSubmissionStatusFilter value={statusFilter} onChange={setStatusFilter} counts={statusCounts} />

        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 font-urbanist text-sm text-red-700">
            Failed to load submissions: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        ) : null}

        {!isLoading &&
        !error &&
        (tab === "contact" ? filteredContactRows.length === 0 : filteredDiagnosticRows.length === 0) ? (
          <AdminCompactEmptyState
            icon={tab === "contact" ? Inbox : Stethoscope}
            title="No submissions match this filter"
            description={
              statusFilter === "all"
                ? tab === "contact"
                  ? "Contact and investor messages will appear here."
                  : "Startup diagnostic submissions will appear here."
                : `No items with status “${statusFilter}”.`
            }
          />
        ) : null}

        {!isLoading && !error ? (
          <div className="mt-4">
            {tab === "contact" && filteredContactRows.length > 0 ? (
              <AdminDataTable
                columns={contactColumns}
                rows={filteredContactRows}
                getRowKey={(row) => row.id}
              />
            ) : null}
            {tab === "diagnostic" && filteredDiagnosticRows.length > 0 ? (
              <AdminDataTable
                columns={diagnosticColumns}
                rows={filteredDiagnosticRows}
                getRowKey={(row) => row.id}
              />
            ) : null}
          </div>
        ) : null}
      </AdminSectionCard>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <AdminSectionCard title="Quick actions" subtitle="Common submission tasks.">
          <div className="space-y-3 font-urbanist text-sm text-black/65">
            <p>Update status as you work through each inquiry. Resolved items leave the unresolved counter.</p>
            <Link to="/admin/resources" className="inline-block font-medium text-rellia-teal hover:underline">
              Admin resources →
            </Link>
          </div>
        </AdminSectionCard>
      </aside>
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

  const recentActivity = useMemo(
    () =>
      [...users]
        .filter((u) => u.lastSignInAt)
        .sort((a, b) => new Date(b.lastSignInAt!).getTime() - new Date(a.lastSignInAt!).getTime())
        .slice(0, 8),
    [users],
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]">
      <div className="space-y-6">
        <AdminSectionCard title="Team" subtitle="Admin accounts with access to this dashboard.">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : null}

          {error ? (
            <p className="font-urbanist text-sm text-red-700">
              {error instanceof Error ? error.message : "Could not load team members."}
            </p>
          ) : null}

          {!isLoading && !error && users.length === 0 ? (
            <AdminCompactEmptyState
              icon={Users}
              title="No team members found"
              description="Invite colleagues from Supabase Auth to grant dashboard access."
            />
          ) : null}

          {!isLoading && !error && users.length > 0 ? (
            <AdminDataTable
              columns={[
                {
                  key: "email",
                  header: "Email",
                  cell: (member) => <span className="text-black/80">{member.email}</span>,
                },
                {
                  key: "joined",
                  header: "Joined",
                  cell: (member) => (
                    <span className="text-black/50">{formatAdminDate(member.createdAt)}</span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (member) =>
                    member.confirmedAt ? (
                      <span className="rounded-full bg-rellia-mint/25 px-2.5 py-0.5 text-xs text-rellia-teal">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-900">
                        Invite pending
                      </span>
                    ),
                },
              ]}
              rows={users}
              getRowKey={(member) => member.id}
            />
          ) : null}
        </AdminSectionCard>

        {recentActivity.length > 0 ? (
          <AdminSectionCard title="Recent activity" subtitle="Latest admin sign-ins.">
            <AdminDataTable
              columns={[
                {
                  key: "email",
                  header: "Email",
                  cell: (member) => <span className="text-black/80">{member.email}</span>,
                },
                {
                  key: "last",
                  header: "Last sign-in",
                  cell: (member) => (
                    <span className="text-black/50">{formatAdminDate(member.lastSignInAt!)}</span>
                  ),
                },
              ]}
              rows={recentActivity}
              getRowKey={(member) => `activity-${member.id}`}
            />
          </AdminSectionCard>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <AdminSectionCard title="Invite admins" subtitle="New users set a password via email invite.">
          <p className="font-urbanist text-sm leading-relaxed text-black/70">
            Add users in Supabase Auth. Set the invite redirect to your site&apos;s{" "}
            <code className="text-xs">/accept-invite</code> flow so links are not consumed by email scanners.
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
        </AdminSectionCard>
      </aside>
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]">
      <AdminSectionCard
        title="Content drafts"
        subtitle="Unpublished Sanity drafts — publish in Studio when ready."
      >
        {!cmsConfigured ? (
          <p className="rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 font-urbanist text-sm text-amber-950">
            CMS is not configured. Set <code className="text-xs">VITE_SANITY_PROJECT_ID</code> and{" "}
            <code className="text-xs">VITE_SANITY_DATASET</code> on this deployment.
          </p>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
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
      </AdminSectionCard>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <AdminSectionCard title="Quick actions" subtitle="Open Sanity Studio to publish.">
          <a
            href="https://relliahealth.sanity.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-urbanist text-sm font-medium text-rellia-teal hover:underline"
          >
            Open Sanity Studio
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </AdminSectionCard>
      </aside>
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
