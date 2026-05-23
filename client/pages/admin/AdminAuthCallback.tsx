import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"

const readAuthType = (searchParams: URLSearchParams): string | null => {
  const fromQuery = searchParams.get("type")
  if (fromQuery) return fromQuery

  const hash = window.location.hash.replace(/^#/, "")
  if (!hash) return null
  return new URLSearchParams(hash).get("type")
}

const AdminAuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState("Completing sign-in…")

  useEffect(() => {
    let cancelled = false

    const finish = async () => {
      const authType = readAuthType(searchParams)

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

      const { data, error } = await supabase.auth.getSession()
      if (cancelled) return

      if (error || !data.session) {
        setMessage("Could not verify your session. Try signing in again.")
        window.setTimeout(() => navigate("/admin/login", { replace: true }), 2400)
        return
      }

      if (authType === "invite" || authType === "recovery") {
        navigate("/admin/set-password", { replace: true })
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
