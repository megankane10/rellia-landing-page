import { useEffect, useRef, useState } from "react"
import { loadStripe, type StripeEmbeddedCheckout } from "@stripe/stripe-js"
import { clearApiCsrfCache, getApiCsrfHeaders } from "@/lib/apiCsrf"
import { AlertCircle } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"

type StripeEmbeddedCheckoutProps = {
  plan: "monthly" | "annual"
  fallbackHref?: string
  onBack: () => void
}

export default function StripeEmbeddedCheckout({
  plan,
  fallbackHref,
  onBack,
}: StripeEmbeddedCheckoutProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const publishableKey = (
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined
  )?.trim()

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)

      if (!publishableKey) {
        setError("Stripe publishable key is not configured.")
        setLoading(false)
        return
      }

      try {
        const csrf = await getApiCsrfHeaders()
        let res = await fetch("/api/stripe/checkout-session", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json", ...csrf },
          body: JSON.stringify({ plan }),
        })

        if (res.status === 403) {
          const errBody = (await res.json().catch(() => ({}))) as { code?: string }
          if (errBody.code === "CSRF") {
            clearApiCsrfCache()
            const retryCsrf = await getApiCsrfHeaders()
            res = await fetch("/api/stripe/checkout-session", {
              method: "POST",
              credentials: "same-origin",
              headers: { "content-type": "application/json", ...retryCsrf },
              body: JSON.stringify({ plan }),
            })
          }
        }

        const json = (await res.json().catch(() => ({}))) as {
          clientSecret?: string
          fallbackUrl?: string
          error?: string
        }

        if (cancelled) return

        if (!res.ok) {
          setError(json.error || "Could not start checkout.")
          setLoading(false)
          return
        }

        if (json.fallbackUrl) {
          window.location.assign(json.fallbackUrl)
          return
        }

        const clientSecret = json.clientSecret?.trim()
        if (!clientSecret) {
          setError("Checkout session could not be created.")
          setLoading(false)
          return
        }

        const stripe = await loadStripe(publishableKey)
        if (!stripe || cancelled) {
          setError("Stripe could not be initialized.")
          setLoading(false)
          return
        }

        checkoutRef.current?.destroy()
        const checkout = await stripe.initEmbeddedCheckout({ clientSecret })
        checkoutRef.current = checkout

        if (mountRef.current && !cancelled) {
          mountRef.current.innerHTML = ""
          checkout.mount(mountRef.current)
        }

        setLoading(false)
      } catch {
        if (!cancelled) {
          setError("Could not load checkout. Please try again.")
          setLoading(false)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
      checkoutRef.current?.destroy()
      checkoutRef.current = null
    }
  }, [plan, publishableKey])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <AlertCircle className="h-14 w-14 text-rellia-teal mb-6" aria-hidden />
        <p className="max-w-md font-urbanist text-base text-black/70 mb-8">{error}</p>
        {fallbackHref ? (
          <RelliaAction asChild variant="mintTealFill" size="comfortable" className="mb-4">
            <a href={fallbackHref} target="_blank" rel="noopener noreferrer">
              Open checkout in a new tab
            </a>
          </RelliaAction>
        ) : null}
        <RelliaAction type="button" variant="outlineOnWhite" size="comfortable" onClick={onBack}>
          Go back
        </RelliaAction>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-[600px]">
      {loading ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-rellia-teal"
            aria-hidden
          />
          <p className="font-urbanist text-sm font-medium text-black/60">Loading secure checkout…</p>
        </div>
      ) : null}
      <div ref={mountRef} id="stripe-embedded-checkout" className="w-full min-h-[600px]" />
    </div>
  )
}
