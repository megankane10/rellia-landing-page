import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiCsrfHeaders } from "@/lib/apiCsrf"

const AdminSignup = () => {
  const navigate = useNavigate()
  const [signupEnabled, setSignupEnabled] = useState<boolean | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/admin/signup-status")
      .then((r) => r.json())
      .then((data) => setSignupEnabled(data.enabled === true))
      .catch(() => setSignupEnabled(false))
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
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Signup failed. Please try again.")
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

  if (signupEnabled === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rellia-cream">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rellia-mint border-t-rellia-teal" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-rellia-cream px-4">
      <Card className="w-full max-w-sm rounded-[20px] border border-black/10 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-host-grotesk text-xl font-bold text-rellia-teal">
            Create Admin Account
          </CardTitle>
          <CardDescription className="font-urbanist text-black/60">
            Rellia internal access only
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!signupEnabled ? (
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
                <Label htmlFor="email" className="font-urbanist text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl focus-visible:ring-rellia-mint"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="font-urbanist text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
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
              {error && (
                <p className="font-urbanist text-sm text-destructive">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-rellia-teal text-white hover:bg-rellia-teal/90"
              >
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSignup
