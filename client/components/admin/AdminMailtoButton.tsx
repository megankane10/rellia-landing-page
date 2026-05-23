import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  const handleOpenMail = () => {
    const href = buildMailtoHref(trimmedEmail, { subject, body })
    if (!href) return
    window.location.assign(href)
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={!trimmedEmail}
      onClick={handleOpenMail}
      className="rounded-full border-rellia-teal/25 text-rellia-teal hover:bg-rellia-mint/20"
      aria-label={trimmedEmail ? `${label}: ${trimmedEmail}` : label}
    >
      <Mail className="mr-2 h-4 w-4" aria-hidden />
      {label}
    </Button>
  )
}

export default AdminMailtoButton
