import { useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"
import RelliaAction from "@/components/RelliaAction"
import { readOtpTokenHash } from "@/lib/adminAuthFromUrl"
import { supabase } from "@/lib/supabase"

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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const confirmationUrl = searchParams.get("confirmation_url")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validUrl = useMemo(() => isValidConfirmationUrl(confirmationUrl), [confirmationUrl])

  const handleContinue = async () => {
    if (!validUrl || !confirmationUrl) {
      setError("This invitation link is missing or invalid. Request a new invite from your administrator.")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const target = new URL(confirmationUrl)
      const tokenHash = readOtpTokenHash(target.searchParams)
      const typeParam = target.searchParams.get("type")
      const otpType = typeParam === "recovery" ? "recovery" : "invite"

      if (tokenHash) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        })
        if (verifyError) {
          setError(
            `${verifyError.message} If this invite was already opened (e.g. by an email scanner), ask for a new invite.`,
          )
          return
        }
        navigate("/admin/set-password", { replace: true, state: { showWelcome: true } })
        return
      }

      const callbackBase = `${window.location.origin}/admin/auth/callback`
      const redirectTo = `${callbackBase}?type=${encodeURIComponent(otpType)}`
      target.searchParams.set("redirect_to", redirectTo)
      window.location.href = target.toString()
    } catch {
      window.location.href = confirmationUrl
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuthLayout
      leftHeading="You're invited to the admin dashboard"
      leftDescription="Email scanners can open invite links too early. Continue only when you are ready to finish setting up your account."
      title="Accept invitation"
      showBackLink={false}
      footerLinks={
        <p className="text-center font-urbanist text-sm text-black/55">
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
      }
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
        className="w-full"
        disabled={!validUrl || loading}
        onClick={() => void handleContinue()}
      >
        {loading ? "Continuing…" : "Continue"}
      </RelliaAction>
    </AdminAuthLayout>
  )
}

export default AcceptInvite
