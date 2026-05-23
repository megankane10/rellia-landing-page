import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"
import RelliaAction from "@/components/RelliaAction"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const AdminSetPassword = () => {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !session) {
      navigate("/admin/login", { replace: true })
    }
  }, [loading, session, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate("/admin/overview", { replace: true })
  }

  if (loading) {
    return (
      <AdminAuthLayout
        leftHeading="Create your password"
        leftDescription="Finish setting up secure access to the Rellia Health admin dashboard."
        title="Loading"
        description="Preparing your account…"
        leftTextTone="mint"
      >
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rellia-mint border-t-rellia-teal" />
        </div>
      </AdminAuthLayout>
    )
  }

  return (
    <AdminAuthLayout
      leftHeading="Create your password"
      leftDescription="Finish setting up secure access to the Rellia Health admin dashboard."
      title="Set your password"
      description="Choose a password for your admin account."
      leftTextTone="mint"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="admin-set-password" className="font-urbanist text-sm font-medium text-black/80">
            Password
          </Label>
          <Input
            id="admin-set-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl focus-visible:ring-rellia-mint"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="admin-set-password-confirm" className="font-urbanist text-sm font-medium text-black/80">
            Confirm password
          </Label>
          <Input
            id="admin-set-password-confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-xl focus-visible:ring-rellia-mint"
          />
        </div>
        {error ? <p className="font-urbanist text-sm text-destructive">{error}</p> : null}
        <RelliaAction
          type="submit"
          disabled={submitting}
          variant="tealFilled"
          size="comfortable"
          className="w-full"
        >
          {submitting ? "Saving…" : "Save and continue"}
        </RelliaAction>
        <p className="pt-2 text-center font-urbanist text-sm text-black/55">
          Already have a password?{" "}
          <Link
            to="/admin/login"
            className="font-medium text-rellia-teal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AdminAuthLayout>
  )
}

export default AdminSetPassword
