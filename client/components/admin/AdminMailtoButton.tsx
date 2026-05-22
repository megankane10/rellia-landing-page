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
  const href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <Button
      type="button"
      variant="outline"
      asChild
      className="rounded-full border-rellia-teal/25 text-rellia-teal hover:bg-rellia-mint/20"
    >
      <a href={href} aria-label={`${label}: ${email}`}>
        <Mail className="mr-2 h-4 w-4" aria-hidden />
        {label}
      </a>
    </Button>
  )
}

export default AdminMailtoButton
