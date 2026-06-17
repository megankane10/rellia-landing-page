import { Badge } from "@/components/ui/badge"
import { statusBadgeClass, type SubmissionStatus } from "@/lib/adminSubmissionStatus"
import { cn } from "@/lib/utils"

type AdminSubmissionStatusBadgeProps = {
  status: SubmissionStatus
  className?: string
}

const AdminSubmissionStatusBadge = ({ status, className }: AdminSubmissionStatusBadgeProps) => (
  <Badge variant="outline" className={cn(statusBadgeClass(status), className)}>
    {status}
  </Badge>
)

export default AdminSubmissionStatusBadge
