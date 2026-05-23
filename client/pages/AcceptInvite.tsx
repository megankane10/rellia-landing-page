import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"
import RelliaAction from "@/components/RelliaAction"

const isValidConfirmationUrl = (value: string | null): value is string => {
  if (!value?.trim()) return false
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

const AcceptInvite = () => {
  const [searchParams] = useSearchParams()
  const confirmationUrl = searchParams.get("confirmation_url")
  const [error, setError] = useState<string | null>(null)

  const validUrl = useMemo(() => isValidConfirmationUrl(confirmationUrl), [confirmationUrl])

  const handleContinue = () => {
    if (!validUrl || !confirmationUrl) {
      setError("This invitation link is missing or invalid. Request a new invite from your administrator.")
      return
    }
    window.location.href = confirmationUrl
  }

  return (
    <AdminAuthLayout
      leftHeading="You're invited to the admin dashboard"
      leftDescription="Email scanners can open invite links too early. Continue only when you are ready to finish setting up your account."
      title="Accept invitation"
      description="Click continue to verify your invite and set your password."
      leftTextTone="mint"
    >
      {!validUrl ? (
        <p className="font-urbanist text-sm text-red-700" role="alert">
          This invitation link is missing or invalid. Open the link from your invite email again, or ask for a new
          invitation.
        </p>
      ) : null}

      {error ? (
        <p className="font-urbanist text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <RelliaAction
        type="button"
        variant="tealFilled"
        size="comfortable"
        className="mt-4 w-full"
        disabled={!validUrl}
        onClick={handleContinue}
      >
        Continue
      </RelliaAction>

      <p className="mt-6 text-center font-urbanist text-sm text-black/55">
        <Link
          to="/admin/login"
          className="font-medium text-rellia-teal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
        >
          Sign in
        </Link>
        {" · "}
        <Link
          to="/"
          className="text-black/50 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
        >
          Back to website
        </Link>
      </p>
    </AdminAuthLayout>
  )
}

export default AcceptInvite
