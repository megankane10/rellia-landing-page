import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    if (!trimmedEmail) return
    const params = new URLSearchParams()
    if (subject.trim()) params.set("subject", subject)
    if (body.trim()) params.set("body", body)
    const query = params.toString()
    const href = query ? `mailto:${trimmedEmail}?${query}` : `mailto:${trimmedEmail}`
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
