import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSubmissionStatusSelect from "@/components/admin/AdminSubmissionStatusSelect"
import AdminSubmissionStatusFilter from "@/components/admin/AdminSubmissionStatusFilter"
import AdminDeleteSubmissionButton from "@/components/admin/AdminDeleteSubmissionButton"
import {
  countByStatusFilter,
  formatAdminDate,
  matchesStatusFilter,
  statusBadgeClass,
  type StatusFilterValue,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import { ArrowLeft, Inbox } from "lucide-react"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"

export type ContactSubmission = {
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

const fetchContacts = async (): Promise<ContactSubmission[]> => {
  const { data, error } = await supabase
    .from("contact_responses")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as ContactSubmission[]
}

const AdminContactList = () => {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusWritesEnabled, setStatusWritesEnabled] = useState(true)

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["admin-contact-submissions"],
    queryFn: fetchContacts,
  })

  const statusCounts = useMemo(() => countByStatusFilter(rows), [rows])

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesStatusFilter(row, statusFilter)),
    [rows, statusFilter],
  )

  const statusSupported = useMemo(
    () => rows.length === 0 || rows.some((row) => "status" in row),
    [rows],
  )

  const handleStatusChange = async (contactId: string, newStatus: SubmissionStatus) => {
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

  const handleDelete = async (contactId: string) => {
    const { error: deleteError } = await supabase.from("contact_responses").delete().eq("id", contactId)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-1.5 font-urbanist text-sm text-rellia-teal/80 transition-colors hover:text-rellia-teal"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Dashboard
      </Link>

      <div>
        <h1 className="font-host-grotesk text-2xl font-bold text-foreground md:text-3xl">Contact Form</h1>
        <p className="mt-2 font-urbanist text-base text-muted-foreground">
          {rows.length} message{rows.length === 1 ? "" : "s"}
        </p>
      </div>

      <AdminSubmissionStatusFilter
        value={statusFilter}
        onChange={setStatusFilter}
        counts={statusCounts}
      />

      {!statusWritesEnabled && (
        <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 font-urbanist text-sm text-amber-900">
          Status updates need Supabase policies. Run{" "}
          <code className="text-xs">scripts/supabase_admin_policies.sql</code> in the SQL editor.
        </p>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <p className="font-urbanist text-sm text-red-700">
          Failed to load contacts: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {!isLoading && !error && filteredRows.length === 0 && (
        <AdminCompactEmptyState
          icon={Inbox}
          title="No submissions match this filter"
          description={
            statusFilter === "all"
              ? "Contact form messages will appear here."
              : `No contact messages with status “${statusFilter}”.`
          }
        />
      )}

      <ul className="space-y-3">
        {filteredRows.map((row) => {
          const status = (row.status ?? "New") as SubmissionStatus
          return (
            <li
              key={row.id}
              className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <Link to={`/admin/contacts/${row.id}`} className="min-w-0 flex-1 group">
                  <p className="font-host-grotesk text-base font-semibold text-foreground group-hover:text-rellia-teal">
                    {row.first_name} {row.last_name}
                  </p>
                  <p className="mt-1 font-urbanist text-sm text-muted-foreground">
                    {row.email}
                    {row.company ? ` · ${row.company}` : ""} · {formatAdminDate(row.created_at)}
                  </p>
                  <p className="mt-2 line-clamp-2 font-urbanist text-sm text-muted-foreground">{row.message}</p>
                </Link>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  {statusSupported && statusWritesEnabled ? (
                    <AdminSubmissionStatusSelect
                      value={status}
                      disabled={updatingId === row.id}
                      ariaLabel={`Status for ${row.first_name} ${row.last_name}`}
                      onValueChange={(value) => void handleStatusChange(row.id, value)}
                    />
                  ) : (
                    <Badge
                      variant="outline"
                      className={`rounded-full font-urbanist text-sm ${statusBadgeClass(status)}`}
                    >
                      {status}
                    </Badge>
                  )}
                  <AdminDeleteSubmissionButton
                    label="Delete contact submission?"
                    description="This permanently removes the message from your inbox."
                    onConfirm={() => handleDelete(row.id)}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AdminContactList
