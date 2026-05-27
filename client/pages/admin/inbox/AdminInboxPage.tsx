import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Inbox, Search, Stethoscope } from "lucide-react"
import { supabase } from "@/lib/supabase"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminRecordList from "@/components/admin/AdminRecordList"
import AdminSubmissionStatusFilter from "@/components/admin/AdminSubmissionStatusFilter"
import AdminSubmissionStatusSelect from "@/components/admin/AdminSubmissionStatusSelect"
import AdminDeleteIconButton from "@/components/admin/AdminDeleteIconButton"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  countByStatusFilter,
  formatAdminDate,
  matchesStatusFilter,
  statusBadgeClass,
  type StatusFilterValue,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import {
  contactDisplayName,
  contactTypeLabel,
  fetchContactSubmissions,
  fetchDiagnosticSubmissions,
  type CompanyProfileRow,
  type ContactRow,
} from "@/lib/adminSubmissions"
import { cn } from "@/lib/utils"
import type { AdminTableColumn } from "@/components/admin/AdminDataTable"

type SubmissionTab = "contact" | "diagnostic"

const UNRESOLVED_COUNT_KEY = ["admin-unresolved-submissions-count"] as const

const StatusTag = ({ status }: { status: SubmissionStatus }) => (
  <Badge variant="outline" className={cn("rounded-full font-urbanist text-xs", statusBadgeClass(status))}>
    {status}
  </Badge>
)

const matchesSearch = (haystack: string, query: string) => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return haystack.toLowerCase().includes(q)
}

const AdminInboxPage = () => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")
  const tab: SubmissionTab = tabParam === "diagnostic" ? "diagnostic" : "contact"
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusWritesEnabled, setStatusWritesEnabled] = useState(true)

  const setTab = (next: SubmissionTab) => {
    setSearchParams({ tab: next }, { replace: true })
    setStatusFilter("all")
    setSearchQuery("")
  }

  const contactsQuery = useQuery({ queryKey: ["admin-contact-submissions"], queryFn: fetchContactSubmissions })
  const diagnosticsQuery = useQuery({ queryKey: ["admin-company-profiles"], queryFn: fetchDiagnosticSubmissions })

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
        .filter((row) =>
          matchesSearch(
            [contactDisplayName(row), row.email, row.company ?? "", contactTypeLabel(row)].join(" "),
            searchQuery,
          ),
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [contactRows, statusFilter, searchQuery],
  )

  const filteredDiagnosticRows = useMemo(
    () =>
      [...diagnosticRows]
        .filter((row) => matchesStatusFilter(row, statusFilter))
        .filter((row) =>
          matchesSearch([row.name, row.work_email, row.company_name, row.stage ?? ""].join(" "), searchQuery),
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [diagnosticRows, statusFilter, searchQuery],
  )

  const invalidateSubmissionQueries = () => {
    void queryClient.invalidateQueries({ queryKey: UNRESOLVED_COUNT_KEY })
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
    invalidateSubmissionQueries()
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
    invalidateSubmissionQueries()
  }

  const handleContactDelete = async (contactId: string) => {
    const { error: deleteError } = await supabase.from("contact_responses").delete().eq("id", contactId)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] })
    invalidateSubmissionQueries()
  }

  const handleDiagnosticDelete = async (profileId: string) => {
    const { error: deleteError } = await supabase.from("company_profiles").delete().eq("id", profileId)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-company-profiles"] })
    invalidateSubmissionQueries()
  }

  const contactColumns: AdminTableColumn<ContactRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => (
        <Link to={`/admin/contacts/${row.id}`} className="font-medium text-rellia-teal hover:underline">
          {contactDisplayName(row)}
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => <span className="text-muted-foreground">{contactTypeLabel(row)}</span>,
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => <span>{row.email}</span>,
    },
    {
      key: "company",
      header: "Company",
      cell: (row) => <span className="text-muted-foreground">{row.company || "—"}</span>,
    },
    {
      key: "date",
      header: "Received",
      cell: (row) => <span className="text-muted-foreground">{formatAdminDate(row.created_at)}</span>,
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
        <Link to={`/admin/companies/${row.id}`} className="font-medium text-rellia-teal hover:underline">
          {row.name}
        </Link>
      ),
    },
    {
      key: "company",
      header: "Company",
      cell: (row) => <span>{row.company_name}</span>,
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => <span className="text-muted-foreground">{row.work_email}</span>,
    },
    {
      key: "stage",
      header: "Stage",
      cell: (row) => <span className="text-muted-foreground">{row.stage || "—"}</span>,
    },
    {
      key: "date",
      header: "Received",
      cell: (row) => <span className="text-muted-foreground">{formatAdminDate(row.created_at)}</span>,
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

  const renderList = () => {
    if (isLoading) {
      return (
        <div className="space-y-3 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 font-urbanist text-sm text-destructive">
          Failed to load submissions: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )
    }

    const rows = tab === "contact" ? filteredContactRows : filteredDiagnosticRows
    const emptyIcon = tab === "contact" ? Inbox : Stethoscope

    if (rows.length === 0) {
      return (
        <AdminCompactEmptyState
          icon={emptyIcon}
          title="No submissions match your filters"
          description={
            statusFilter === "all" && !searchQuery.trim()
              ? tab === "contact"
                ? "Contact and investor messages will appear here."
                : "Startup diagnostic submissions will appear here."
              : "Try clearing the search or status filter."
          }
        />
      )
    }

    if (tab === "contact") {
      return (
        <AdminRecordList
          rows={filteredContactRows}
          getRowKey={(row) => row.id}
          columns={contactColumns}
          mobileFields={[
            {
              label: "Name",
              value: (row) => (
                <Link to={`/admin/contacts/${row.id}`} className="font-medium text-rellia-teal hover:underline">
                  {contactDisplayName(row)}
                </Link>
              ),
            },
            { label: "Type", value: (row) => contactTypeLabel(row) },
            { label: "Email", value: (row) => row.email },
            {
              label: "Status",
              value: (row) => {
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
          ]}
          mobileActions={(row) => (
            <AdminDeleteIconButton
              label="Delete contact submission?"
              description="This permanently removes the message from your inbox."
              onConfirm={() => void handleContactDelete(row.id)}
            />
          )}
        />
      )
    }

    return (
      <AdminRecordList
        rows={filteredDiagnosticRows}
        getRowKey={(row) => row.id}
        columns={diagnosticColumns}
        mobileFields={[
          {
            label: "Founder",
            value: (row) => (
              <Link to={`/admin/companies/${row.id}`} className="font-medium text-rellia-teal hover:underline">
                {row.name}
              </Link>
            ),
          },
          { label: "Company", value: (row) => row.company_name },
          { label: "Email", value: (row) => row.work_email },
          {
            label: "Status",
            value: (row) => {
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
        ]}
        mobileActions={(row) => (
          <AdminDeleteIconButton
            label="Delete diagnostic submission?"
            description="This removes the company profile and linked diagnostic response."
            onConfirm={() => void handleDiagnosticDelete(row.id)}
          />
        )}
      />
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Inbox"
        description="Website form submissions, investor notifications, and startup diagnostic leads. Filter by status or search by name and email."
      />

      {!statusWritesEnabled ? (
        <p className="mb-4 rounded-lg border border-amber-200/80 bg-amber-50 px-4 py-3 font-urbanist text-sm text-amber-900">
          Status updates need Supabase policies. Run{" "}
          <code className="text-xs">scripts/supabase_admin_policies.sql</code> in the SQL editor.
        </p>
      ) : null}

      <Tabs value={tab} onValueChange={(value) => setTab(value as SubmissionTab)} className="space-y-4">
        <TabsList className="grid h-auto w-full max-w-md grid-cols-2">
          <TabsTrigger value="contact" className="font-urbanist">
            Contact & investor
          </TabsTrigger>
          <TabsTrigger value="diagnostic" className="font-urbanist">
            Startup diagnostic
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tab === "contact" ? "Search name, email, company…" : "Search founder, company, email…"}
              className="pl-9"
              aria-label="Search submissions"
            />
          </div>
        </div>

        <AdminSubmissionStatusFilter value={statusFilter} onChange={setStatusFilter} counts={statusCounts} />

        <TabsContent value="contact" className="mt-0">
          {renderList()}
        </TabsContent>
        <TabsContent value="diagnostic" className="mt-0">
          {renderList()}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminInboxPage
