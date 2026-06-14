import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import {
  readAuthTypeFromUrl,
  readHashAuthError,
  readOtpTokenHash,
} from "@/lib/adminAuthFromUrl"
import { waitForSupabaseSession } from "@/lib/waitForSupabaseSession"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"

const AdminAuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState("Completing sign-in…")

  useEffect(() => {
    let cancelled = false

    const finish = async () => {
      const hashError = readHashAuthError()
      if (hashError) {
        if (!cancelled) {
          setMessage("This link is invalid or has expired. Request a new invitation.")
          window.setTimeout(() => navigate("/admin/login", { replace: true }), 2400)
        }
        return
      }

      const authType = readAuthTypeFromUrl(searchParams)
      const tokenHash = readOtpTokenHash(searchParams)

      if (tokenHash) {
        const otpType = authType === "recovery" ? "recovery" : "invite"
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        })
        if (verifyError) {
          if (!cancelled) {
            setMessage("This link is invalid or has expired. Request a new invitation.")
            window.setTimeout(() => navigate("/admin/login", { replace: true }), 2400)
          }
          return
        }
      }

      const code = searchParams.get("code")
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          if (!cancelled) {
            setMessage("This link is invalid or has expired. Request a new invitation.")
            window.setTimeout(() => navigate("/admin/login", { replace: true }), 2400)
          }
          return
        }
      }

      const session = await waitForSupabaseSession()
      if (cancelled) return

      if (!session) {
        setMessage("Could not verify your session. Try signing in again.")
        window.setTimeout(() => navigate("/admin/login", { replace: true }), 2400)
        return
      }

      const invitedAt = session.user.invited_at
      const needsPassword =
        authType === "invite" ||
        authType === "recovery" ||
        Boolean(invitedAt)

      if (needsPassword) {
        navigate("/admin/set-password", {
          replace: true,
          state: authType === "recovery" ? null : { showWelcome: true },
        })
        return
      }

      navigate("/admin/overview", { replace: true })
    }

    void finish()

    return () => {
      cancelled = true
    }
  }, [navigate, searchParams])

  return (
    <AdminAuthLayout
      leftHeading="Almost there"
      leftDescription="We are confirming your invitation and preparing your admin account."
      title="Signing you in"
      description={message}
      leftTextTone="mint"
    >
      <div className="flex justify-center py-10" role="status" aria-live="polite">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-rellia-mint border-t-rellia-teal" />
      </div>
    </AdminAuthLayout>
  )
}

export default AdminAuthCallback
