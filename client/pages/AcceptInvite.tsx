import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
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
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />
      <main
        id="main-content"
        className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-20"
      >
        <div className="w-full max-w-md rounded-3xl border border-black/[0.06] bg-rellia-cream/30 px-8 py-10 text-center">
          <h1 className="font-host-grotesk text-2xl text-rellia-teal">Accept invitation</h1>
          <p className="mt-3 font-urbanist text-sm leading-relaxed text-black/65">
            Email scanners can expire invite links before you open them. Click continue when you are ready to
            finish setting up your account.
          </p>

          {!validUrl ? (
            <p className="mt-6 font-urbanist text-sm text-red-700" role="alert">
              This invitation link is missing or invalid. Open the link from your invite email again, or ask
              for a new invitation.
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 font-urbanist text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <RelliaAction
            type="button"
            variant="tealFilled"
            size="comfortable"
            className="mt-8 w-full"
            disabled={!validUrl}
            onClick={handleContinue}
          >
            Continue
          </RelliaAction>

          <Link
            to="/"
            className="mt-8 inline-block font-urbanist text-sm text-black/50 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
          >
            ← Back to website
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AcceptInvite
