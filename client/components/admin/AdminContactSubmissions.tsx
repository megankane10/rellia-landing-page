import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type ContactStatus = "New" | "In Progress" | "Resolved"

export type ContactSubmission = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  company: string | null
  job_title: string | null
  message: string
  status?: ContactStatus | null
}

const STATUS_OPTIONS: ContactStatus[] = ["New", "In Progress", "Resolved"]

const statusBadgeClass = (status: ContactStatus) => {
  if (status === "Resolved") return "bg-emerald-50 text-emerald-800 border-emerald-200"
  if (status === "In Progress") return "bg-amber-50 text-amber-900 border-amber-200"
  return "bg-sky-50 text-sky-900 border-sky-200"
}

const fetchContacts = async (): Promise<{ rows: ContactSubmission[]; statusSupported: boolean }> => {
  const { data, error } = await supabase
    .from("contact_responses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    if (error.message.toLowerCase().includes("does not exist")) {
      return { rows: [], statusSupported: false }
    }
    throw error
  }

  const rows = (data ?? []) as ContactSubmission[]
  const statusSupported = rows.length === 0 || rows.some((r) => "status" in r)
  return { rows, statusSupported }
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })

const AdminContactSubmissions = () => {
  const queryClient = useQueryClient()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusWritesEnabled, setStatusWritesEnabled] = useState(true)

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-contact-submissions"],
    queryFn: fetchContacts,
  })

  const rows = data?.rows ?? []
  const statusSupported = data?.statusSupported ?? true

  const activeInquiryCount = useMemo(
    () =>
      rows.filter((r) => {
        const s = (r.status ?? "New") as ContactStatus
        return s === "New" || s === "In Progress"
      }).length,
    [rows],
  )

  const handleStatusChange = async (contactId: string, newStatus: ContactStatus) => {
    if (!statusWritesEnabled) return
    setUpdatingId(contactId)
    const { error: updateError } = await supabase
      .from("contact_responses")
      .update({ status: newStatus })
      .eq("id", contactId)

    setUpdatingId(null)
    if (updateError) {
      if (updateError.message.includes("status") || updateError.message.includes("column")) {
        setStatusWritesEnabled(false)
      }
      return
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-metrics"] })
  }

  return (
    <Card className="rounded-[20px] border border-black/10 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="font-host-grotesk text-lg text-rellia-teal">Contact submissions</CardTitle>
        <CardDescription className="font-urbanist text-sm text-black/55">
          {activeInquiryCount > 0
            ? `${activeInquiryCount} active inquir${activeInquiryCount === 1 ? "y" : "ies"}`
            : "Inquiries from the public contact form"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!statusWritesEnabled && (
          <p className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 font-urbanist text-sm text-amber-900">
            Lead status updates will be available soon. Run the contact status migration in Supabase to
            enable workflow tracking.
          </p>
        )}

        {isLoading && <Skeleton className="h-40 w-full rounded-xl" />}

        {error && (
          <p className="font-urbanist text-sm text-red-700">
            Contact inbox is not available yet. Submissions are saved on the server — this view will
            list them once the table is connected for admin reads.
          </p>
        )}

        {!isLoading && !error && rows.length === 0 && (
          <p className="font-urbanist text-sm text-black/55">
            No contact submissions yet, or admin read access is still being configured.
          </p>
        )}

        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-black/8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-host-grotesk">Name</TableHead>
                  <TableHead className="font-host-grotesk">Email</TableHead>
                  <TableHead className="font-host-grotesk">Status</TableHead>
                  <TableHead className="font-host-grotesk text-right">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const status = (row.status ?? "New") as ContactStatus
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-urbanist text-sm">
                        {row.first_name} {row.last_name}
                        {row.company ? (
                          <span className="block text-xs text-black/45">{row.company}</span>
                        ) : null}
                      </TableCell>
                      <TableCell className="font-urbanist text-sm text-black/70">{row.email}</TableCell>
                      <TableCell>
                        {statusSupported && statusWritesEnabled ? (
                          <Select
                            value={status}
                            disabled={updatingId === row.id}
                            onValueChange={(v) => handleStatusChange(row.id, v as ContactStatus)}
                          >
                            <SelectTrigger
                              className="h-8 w-[140px] rounded-full border font-urbanist text-xs"
                              aria-label={`Status for ${row.first_name} ${row.last_name}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant="outline"
                            className={`rounded-full font-urbanist text-xs ${statusBadgeClass(status)}`}
                          >
                            {status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-urbanist text-xs text-black/50">
                        {formatDate(row.created_at)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminContactSubmissions
