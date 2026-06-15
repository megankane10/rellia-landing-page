import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"
import RelliaAction from "@/components/RelliaAction"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  adminUserNeedsDisplayName,
  buildAdminUserMetadata,
  getAdminDisplayName,
  getAdminFirstName,
} from "@/lib/adminUserProfile"
import { ADMIN_AUTH_LEFT_DESCRIPTION, AdminAuthBrandHeading } from "@/components/admin/adminAuthBrandCopy"

type SetPasswordLocationState = {
  showWelcome?: boolean
}

const AdminSetPassword = () => {
  const { session, loading, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const welcomeAfterComplete =
    ((location.state as SetPasswordLocationState | null) ?? null)?.showWelcome === true
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const needsName = adminUserNeedsDisplayName(user)

  useEffect(() => {
    const existing = getAdminDisplayName(user)
    if (existing) setFullName(existing)
  }, [user])

  useEffect(() => {
    if (!loading && !session) {
      navigate("/admin/login", { replace: true })
    }
  }, [loading, session, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (needsName && !fullName.trim()) {
      setError("Please enter your full name.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({
      password,
      ...(needsName ? { data: buildAdminUserMetadata(fullName) } : {}),
    })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    const resolvedName = needsName ? fullName.trim() : getAdminDisplayName(user)
    navigate("/admin/overview", {
      replace: true,
      state: welcomeAfterComplete
        ? {
            showWelcome: true,
            firstName: getAdminFirstName(resolvedName, user?.email),
          }
        : null,
    })
  }

  if (loading) {
    return (
      <AdminAuthLayout
        leftHeading={<AdminAuthBrandHeading />}
        leftDescription={ADMIN_AUTH_LEFT_DESCRIPTION}
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
      leftHeading={<AdminAuthBrandHeading />}
      leftDescription={ADMIN_AUTH_LEFT_DESCRIPTION}
      title={needsName ? "Complete your profile" : "Set your password"}
      description={
        needsName
          ? "Enter your name and choose a password for your admin account."
          : "Choose a password for your admin account."
      }
      leftTextTone="mint"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {needsName ? (
          <div className="space-y-1">
            <Label htmlFor="admin-set-full-name" className="font-urbanist text-sm font-medium text-black/80">
              Full name
            </Label>
            <Input
              id="admin-set-full-name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl focus-visible:ring-rellia-mint"
            />
          </div>
        ) : null}
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
