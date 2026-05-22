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
import { ArrowLeft } from "lucide-react"

type CompanyProfile = {
  id: string
  created_at: string
  name: string
  work_email: string
  company_name: string
  stage: string | null
  description: string | null
  status?: SubmissionStatus | null
}

const fetchProfiles = async (): Promise<CompanyProfile[]> => {
  const { data, error } = await supabase
    .from("company_profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as CompanyProfile[]
}

const AdminDiagnosticList = () => {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusWritesEnabled, setStatusWritesEnabled] = useState(true)

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["admin-company-profiles"],
    queryFn: fetchProfiles,
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

  const handleStatusChange = async (profileId: string, newStatus: SubmissionStatus) => {
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

  const handleDelete = async (profileId: string) => {
    const { error: deleteError } = await supabase.from("company_profiles").delete().eq("id", profileId)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-company-profiles"] })
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
        <h1 className="font-host-grotesk text-2xl font-bold text-black md:text-3xl">
          Startup diagnostic submissions
        </h1>
        <p className="mt-2 font-urbanist text-base text-black/65">
          {rows.length} submission{rows.length === 1 ? "" : "s"}
        </p>
      </div>

      <AdminSubmissionStatusFilter
        value={statusFilter}
        onChange={setStatusFilter}
        counts={statusCounts}
      />

      {!statusWritesEnabled && (
        <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 font-urbanist text-sm text-amber-900">
          Status updates need the <code className="text-xs">status</code> column and RLS policies from{" "}
          <code className="text-xs">scripts/supabase_admin_policies.sql</code>.
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
          Failed to load submissions: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {!isLoading && !error && filteredRows.length === 0 && (
        <p className="rounded-2xl border border-dashed border-black/10 bg-white/70 px-4 py-10 text-center font-urbanist text-base text-black/60">
          No submissions match this filter.
        </p>
      )}

      <ul className="space-y-3">
        {filteredRows.map((row) => {
          const status = (row.status ?? "New") as SubmissionStatus
          return (
            <li
              key={row.id}
              className="rounded-2xl border border-black/[0.07] bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <Link to={`/admin/companies/${row.id}`} className="min-w-0 flex-1 group">
                  <p className="font-host-grotesk text-base font-semibold text-black group-hover:text-rellia-teal">
                    {row.company_name}
                  </p>
                  <p className="mt-1 font-urbanist text-sm text-black/60">
                    {row.name} · {row.work_email} · {formatAdminDate(row.created_at)}
                  </p>
                  {row.stage ? (
                    <Badge className="mt-2 rounded-full bg-rellia-mint/90 font-urbanist text-sm text-rellia-teal hover:bg-rellia-mint">
                      {row.stage}
                    </Badge>
                  ) : null}
                </Link>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  {statusSupported && statusWritesEnabled ? (
                    <AdminSubmissionStatusSelect
                      value={status}
                      disabled={updatingId === row.id}
                      ariaLabel={`Status for ${row.company_name}`}
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
                    label="Delete diagnostic submission?"
                    description="This removes the company profile and linked diagnostic response."
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

export default AdminDiagnosticList
