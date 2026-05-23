import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSubmissionStatusSelect from "@/components/admin/AdminSubmissionStatusSelect"
import AdminDeleteSubmissionButton from "@/components/admin/AdminDeleteSubmissionButton"
import AdminMailtoButton from "@/components/admin/AdminMailtoButton"
import {
  formatAdminDateLong,
  statusBadgeClass,
  type SubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import type { ContactSubmission } from "@/pages/admin/AdminContactList"
import { ArrowLeft } from "lucide-react"

const fetchContact = async (id: string): Promise<ContactSubmission> => {
  const { data, error } = await supabase.from("contact_responses").select("*").eq("id", id).single()
  if (error) throw error
  return data as ContactSubmission
}

const AdminContactDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [updating, setUpdating] = useState(false)
  const [statusWritesEnabled, setStatusWritesEnabled] = useState(true)

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-contact", id],
    queryFn: () => fetchContact(id!),
    enabled: !!id,
  })

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    if (!id || !statusWritesEnabled) return
    setUpdating(true)
    const { error: updateError } = await supabase
      .from("contact_responses")
      .update({ status: newStatus })
      .eq("id", id)
    setUpdating(false)
    if (updateError) {
      if (updateError.message.includes("status") || updateError.message.includes("policy")) {
        setStatusWritesEnabled(false)
      }
      return
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-contact", id] })
    void queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
  }

  const handleDelete = async () => {
    if (!id) return
    const { error: deleteError } = await supabase.from("contact_responses").delete().eq("id", id)
    if (deleteError) return
    void queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] })
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
    navigate("/admin/submissions?tab=contact", { replace: true })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/submissions?tab=contact"
          className="inline-flex items-center gap-1.5 font-urbanist text-sm text-rellia-teal/80 hover:text-rellia-teal"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All contact submissions
        </Link>
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 font-urbanist text-sm text-red-700">
          Failed to load submission.
        </p>
      </div>
    )
  }

  const status = (data.status ?? "New") as SubmissionStatus
  const hasStatusField = "status" in data
  const isInvestor = (data as ContactSubmission & { submission_type?: string }).submission_type === "investor"
  const mailSubject = isInvestor
    ? "Re: Rellia Health pitch events"
    : `Re: Your message to Rellia Health`
  const mailBody = `Hi ${data.first_name},\n\n`

  return (
    <div className="space-y-6">
      <Link
        to="/admin/submissions?tab=contact"
        className="inline-flex items-center gap-1.5 font-urbanist text-sm text-rellia-teal/80 transition-colors hover:text-rellia-teal"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All contact submissions
      </Link>

      <article className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white/90 shadow-sm">
        <div className="border-b border-black/[0.06] bg-gradient-to-r from-rellia-mint/12 to-white px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-host-grotesk text-xl font-bold text-black md:text-2xl">
                {data.first_name} {data.last_name === "." ? "" : data.last_name}
                {isInvestor ? (
                  <span className="ml-2 inline-flex rounded-full bg-rellia-mint/30 px-2 py-0.5 align-middle font-urbanist text-xs font-medium text-rellia-teal">
                    Investor
                  </span>
                ) : null}
              </h1>
              <p className="mt-1 font-urbanist text-sm text-black/65">{data.email}</p>
              <p className="font-urbanist text-sm text-black/50">{formatAdminDateLong(data.created_at)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasStatusField && statusWritesEnabled ? (
                <AdminSubmissionStatusSelect
                  value={status}
                  disabled={updating}
                  ariaLabel={`Status for ${data.first_name} ${data.last_name}`}
                  onValueChange={(value) => void handleStatusChange(value)}
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
                onConfirm={handleDelete}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 md:px-6">
          {data.company ? (
            <div>
              <p className="font-urbanist text-sm font-medium text-black/50">Company</p>
              <p className="mt-1 font-urbanist text-base text-black/80">{data.company}</p>
            </div>
          ) : null}
          {data.job_title ? (
            <div>
              <p className="font-urbanist text-sm font-medium text-black/50">Role</p>
              <p className="mt-1 font-urbanist text-base text-black/80">{data.job_title}</p>
            </div>
          ) : null}
          <div>
            <p className="font-urbanist text-sm font-medium text-black/50">Message</p>
            <p className="mt-2 whitespace-pre-wrap font-urbanist text-base leading-relaxed text-black/80">
              {data.message}
            </p>
          </div>
          <div className="border-t border-black/[0.06] pt-5">
            <AdminMailtoButton
              email={data.email}
              subject={mailSubject}
              body={mailBody}
              label="Email sender"
            />
          </div>
        </div>
      </article>
    </div>
  )
}

export default AdminContactDetail
