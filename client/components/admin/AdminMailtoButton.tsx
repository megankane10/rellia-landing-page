import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminOutlineActionButtonClass } from "@/components/admin/adminThemeClasses"
import { buildMailtoHref } from "@/lib/mailto"

type AdminMailtoButtonProps = {
  email: string
  subject: string
  body?: string
  label?: string
}

const AdminMailtoButton = ({
  email,
  subject,
  body = "",
  label = "Email sender",
}: AdminMailtoButtonProps) => {
  const trimmedEmail = email.trim()
  const href = buildMailtoHref(trimmedEmail, { subject, body })

  if (!href) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className={adminOutlineActionButtonClass}
        aria-label={label}
      >
        <Mail className="mr-2 h-4 w-4" aria-hidden />
        {label}
      </Button>
    )
  }

  return (
    <Button
      asChild
      variant="outline"
      className={adminOutlineActionButtonClass}
    >
      <a href={href} aria-label={`${label}: ${trimmedEmail}`} target="_self" rel="noopener noreferrer">
        <Mail className="mr-2 h-4 w-4" aria-hidden />
        {label}
      </a>
    </Button>
  )
}

export default AdminMailtoButton
