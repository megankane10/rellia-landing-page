import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import RelliaAction from "@/components/RelliaAction"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiCsrfHeaders } from "@/lib/apiCsrf"
import { parseApiJson } from "@/lib/parseApiJson"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"

const AdminSignup = () => {
  const navigate = useNavigate()
  const [signupEnabled, setSignupEnabled] = useState<boolean | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await fetch("/api/admin/signup-status")
        const parsed = await parseApiJson<{ enabled?: boolean }>(res)
        if (parsed.ok === false) {
          setStatusError(parsed.error)
          setSignupEnabled(false)
          return
        }
        setSignupEnabled(parsed.data.enabled === true)
      } catch {
        setStatusError("Could not reach the server. Try again later.")
        setSignupEnabled(false)
      }
    }
    void loadStatus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const csrfHeaders = await getApiCsrfHeaders()
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...csrfHeaders,
        },
        body: JSON.stringify({ email: email.trim(), password, fullName: fullName.trim() }),
      })

      const parsed = await parseApiJson<{ ok?: boolean; error?: string }>(res)
      if (parsed.ok === false) {
        setError(parsed.error)
        return
      }
      setSuccess(true)
      setTimeout(() => navigate("/admin/login", { replace: true }), 2000)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const authLeftHeading = "Hello! Ready to see what's new today?"
  const authLeftDescription =
    "Log in to review the latest form submissions, coordinate inquiries, and easily track your website content drafts."

  if (signupEnabled === null) {
    return (
      <AdminAuthLayout
        leftHeading={authLeftHeading}
        leftDescription={authLeftDescription}
        title="Create Admin Account"
        description="Rellia internal access only."
      >
        <div className="flex justify-center py-8">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-rellia-mint border-t-rellia-teal"
            role="status"
            aria-label="Loading"
          />
        </div>
      </AdminAuthLayout>
    )
  }

  return (
    <AdminAuthLayout
      leftHeading={authLeftHeading}
      leftDescription={authLeftDescription}
      title="Create Admin Account"
      description="Rellia internal access only."
    >
      {statusError ? (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50 p-4 text-center">
          <p className="font-urbanist text-sm text-amber-950">{statusError}</p>
          <p className="mt-2 font-urbanist text-sm text-black/65">
            The admin API route is not responding with JSON. Check{" "}
            <a href="/api/health" className="font-medium text-rellia-teal underline underline-offset-2">
              /api/health
            </a>{" "}
            in this browser tab — it should show <code className="text-xs">{`{"ok":true}`}</code>. Set{" "}
            <code className="text-xs">ADMIN_SIGNUP_ENABLED=true</code> (server env, not{" "}
            <code className="text-xs">VITE_</code>) in Vercel for Production and Preview, then redeploy after{" "}
            <code className="text-xs">pnpm run build:api</code> runs in the build log.
          </p>
        </div>
      ) : !signupEnabled ? (
        <div className="rounded-xl border border-rellia-mint/40 bg-rellia-cream p-4 text-center">
          <p className="font-urbanist text-sm text-rellia-teal">
            Signup is currently disabled. Contact the site administrator to request access.
          </p>
        </div>
      ) : success ? (
        <div className="rounded-xl border border-rellia-mint bg-rellia-mint/20 p-4 text-center">
          <p className="font-urbanist text-sm text-rellia-teal">
            Account created! Redirecting to login…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="admin-signup-full-name" className="font-urbanist text-sm font-medium">
              Full name
            </Label>
            <Input
              id="admin-signup-full-name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl focus-visible:ring-rellia-mint"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="admin-signup-email" className="font-urbanist text-sm font-medium">
              Email
            </Label>
            <Input
              id="admin-signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl focus-visible:ring-rellia-mint"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="admin-signup-password" className="font-urbanist text-sm font-medium">
              Password
            </Label>
            <Input
              id="admin-signup-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl focus-visible:ring-rellia-mint"
            />
            <p className="font-urbanist text-xs text-black/50">Minimum 8 characters</p>
          </div>
          {error && <p className="font-urbanist text-sm text-destructive">{error}</p>}
          <RelliaAction
            type="submit"
            disabled={loading}
            variant="tealFilled"
            size="comfortable"
            className="w-full"
          >
            {loading ? "Creating account…" : "Create account"}
          </RelliaAction>
          <p className="pt-2 text-center font-urbanist text-sm text-black/55">
            Already have an account?{" "}
            <Link
              to="/admin/login"
              className="font-medium text-rellia-teal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AdminAuthLayout>
  )
}

export default AdminSignup
