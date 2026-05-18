import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Copy,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Users,
  Target,
} from "lucide-react"
import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { usePaymentPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PAYMENT_PAGE } from "@shared/cms/defaults"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { cn } from "@/lib/utils"
import { clearApiCsrfCache, getApiCsrfHeaders } from "@/lib/apiCsrf"
import StripeEmbeddedCheckout from "@/components/StripeEmbeddedCheckout"

const BENEFIT_ICONS = [Sparkles, ShieldCheck, Users, Target, Zap]

export default function Payment() {
  const [searchParams] = useSearchParams()
  const isSuccess = searchParams.get("success") === "true"
  const isCancel = searchParams.get("cancel") === "true"

  const { data: paymentCms } = usePaymentPage()
  const p = paymentCms ?? DEFAULT_PAYMENT_PAGE
  useApplyCmsSeo(p.seo)

  const [codeCopied, setCodeCopied] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const monthlyHref = (import.meta.env.VITE_STRIPE_MONTHLY_PLAN_LINK as string | undefined)?.trim()
  const annualHref = (import.meta.env.VITE_STRIPE_ANNUAL_PLAN_LINK as string | undefined)?.trim()

  const currentHref = selectedPlan === "annual" ? annualHref : monthlyHref

  const handleCopyCode = () => {
    const code = p.discountBannerSubtitle.trim() || "RELLIA50"
    void navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex, nofollow"
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  const benefitsGrid = useMemo(() => {
    return p.benefits.filter(b => !b.toLowerCase().includes("cancel")).slice(0, 4)
  }, [p.benefits])

  const handleCheckout = () => {
    if (!selectedPlan) return
    setShowCheckout(true)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-rellia-cream/35 font-host-grotesk overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-[120px] pb-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[580px] bg-white border border-rellia-teal/5 shadow-2xl rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center gap-6 md:gap-8"
          >
            <div className="h-16 w-16 bg-rellia-mint/20 text-rellia-teal flex items-center justify-center rounded-full">
              <CheckCircle2 className="h-9 w-9 text-rellia-teal" strokeWidth={2.5} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-rellia-teal leading-tight">
                {p.successTitle}
              </h1>
              <p className="font-urbanist text-lg text-black/60 leading-relaxed">
                {p.successBody}
              </p>
            </div>
            <RelliaAction asChild variant="mintTealFill" size="comfortable" className="w-full py-4 mt-2 justify-center shadow-lg">
              <Link to="/">
                Go to Homepage
              </Link>
            </RelliaAction>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  if (showCheckout && selectedPlan) {
    return (
      <div className="min-h-screen bg-rellia-cream/35 font-host-grotesk overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col pt-[120px] pb-24 px-6 max-w-[800px] mx-auto w-full">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowCheckout(false)}
              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
            >
              ← Back to plans
            </button>
          </div>
          <div className="w-full bg-white border border-rellia-teal/5 shadow-2xl rounded-[32px] p-6 md:p-12">
            <div className="mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-rellia-teal mb-2">
                Secure Checkout
              </h1>
              <p className="font-urbanist text-sm text-black/50">
                Complete your founding membership subscription for the <span className="font-semibold">{selectedPlan === "annual" ? "Annual Plan" : "Monthly Plan"}</span>
              </p>
            </div>
            <StripeEmbeddedCheckout
              plan={selectedPlan}
              fallbackHref={currentHref}
              onBack={() => setShowCheckout(false)}
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <section className="relative w-full border-t border-black/5 pt-20 md:pt-10">
          {/* Full Bleed Background Layers (Desktop) */}
          <div className="absolute inset-0 hidden md:flex md:flex-row pointer-events-none">
            <div className="relative flex-1 bg-rellia-teal/90 overflow-hidden">
              <img 
                src="/images/benefits-payment.jpg" 
                alt="Rellia Network Benefits" 
                className="h-full w-full object-cover opacity-[0.45] mix-blend-overlay scale-105"
              />
              {/* Gradient Overlay: Darker on the left edge */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-rellia-teal/40 to-transparent" />
              <div className="absolute inset-0 bg-rellia-teal/20" />
              <div className="absolute -left-20 -top-20 w-[500px] h-[500px] bg-rellia-mint/10 blur-[120px] rounded-full" />
            </div>
            <div className="flex-1 bg-white" />
          </div>

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 flex flex-col md:flex-row min-h-0 md:min-h-[820px] gap-y-16 md:gap-y-0">
            {/* Left: Benefits */}
            <div className="flex-1 flex flex-col justify-start items-start pt-16 pb-14 md:pt-28 md:pb-20 pr-6 md:pr-16 relative w-auto md:w-full bg-rellia-teal/90 md:bg-transparent px-6 -mx-6 sm:px-10 sm:-mx-10 md:px-0 md:mx-0 overflow-hidden md:overflow-visible">
              {/* Full Bleed Background Layers (Mobile) */}
              <div className="absolute inset-0 md:hidden pointer-events-none">
                <img 
                  src="/images/benefits-payment.jpg" 
                  alt="Rellia Network Benefits" 
                  className="h-full w-full object-cover opacity-[0.45] mix-blend-overlay scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-rellia-teal/40 to-transparent" />
                <div className="absolute inset-0 bg-rellia-teal/20" />
                <div className="absolute -left-20 -top-20 w-[500px] h-[500px] bg-rellia-mint/10 blur-[120px] rounded-full" />
              </div>
              <div className="relative z-10 w-full max-w-[500px]">
                <h3 className="font-host-grotesk text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-12 md:mb-16 leading-[1.1] text-white">
                  Join the <span className="text-rellia-mint">Rellia Network</span> today
                </h3>

                <div className="flex flex-col gap-y-6 md:gap-y-8">
                  {benefitsGrid.map((benefit, index) => {
                    const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length]
                    return (
                      <div key={index} className="flex items-start gap-5 md:gap-6 group">
                        <Icon
                          className="mt-0.5 h-6 w-6 text-rellia-mint transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                          aria-hidden
                          strokeWidth={2.5}
                        />
                        <p className="font-urbanist text-white text-lg font-medium leading-relaxed">
                          {benefit}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Plan Selection */}
            <div className="flex-1 flex flex-col justify-start pt-0 pb-14 md:pt-28 md:pb-20 md:pl-16 relative bg-white">
              <div className="w-full h-full flex flex-col">
                <h2 className="font-host-grotesk text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black mb-10 leading-[1.1]">Choose your plan</h2>
                
                {isCancel && (
                  <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-50/50 p-4 text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="font-urbanist text-sm leading-relaxed">
                      Your checkout session was cancelled. You can select your plan again and click below to try once more.
                    </p>
                  </div>
                )}

                {checkoutError && (
                  <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-50/50 p-4 text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="font-urbanist text-sm leading-relaxed">
                      {checkoutError}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-6">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("annual")}
                    className={cn(
                      "relative flex flex-col items-start p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 text-left min-w-0",
                      selectedPlan === "annual" 
                        ? "border-rellia-teal bg-white shadow-lg ring-4 ring-rellia-teal/5" 
                        : "border-black/5 bg-black/[0.02] hover:bg-black/[0.04] hover:border-black/10"
                    )}
                  >
                    {selectedPlan === "annual" && (
                      <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-rellia-teal" />
                    )}
                    <span className="font-host-grotesk text-xs font-bold uppercase tracking-widest text-rellia-teal mb-4">Annual</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-bold text-black tracking-tight">{p.pricingAnnualAmount}</span>
                      <span className="text-black/40 font-medium text-base">/yr</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("monthly")}
                    className={cn(
                      "relative flex flex-col items-start p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 text-left min-w-0",
                      selectedPlan === "monthly" 
                        ? "border-rellia-teal bg-white shadow-lg ring-4 ring-rellia-teal/5" 
                        : "border-black/5 bg-black/[0.02] hover:bg-black/[0.04] hover:border-black/10"
                    )}
                  >
                    {selectedPlan === "monthly" && (
                      <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-rellia-teal" />
                    )}
                    <span className="font-host-grotesk text-xs font-bold uppercase tracking-widest text-rellia-teal mb-4">Monthly</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-bold text-black tracking-tight">{p.pricingMonthlyAmount}</span>
                      <span className="text-black/40 font-medium text-base">/mo</span>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-10 pl-1">
                  <ShieldCheck className="h-4 w-4 text-black/30" />
                  <p className="font-urbanist text-sm font-medium text-black/40">
                    {p.benefits.find(b => b.toLowerCase().includes("cancel")) || "Cancel at any time"}
                  </p>
                </div>

                <RelliaAction 
                  type="button" 
                  variant="mintTealFill" 
                  size="comfortable" 
                  disabled={!selectedPlan || checkingOut}
                  onClick={handleCheckout} 
                  className="w-full h-[60px] text-lg font-bold mb-12 shadow-md hover:shadow-lg transition-all justify-center"
                >
                  {checkingOut ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span>Redirecting to Stripe...</span>
                    </div>
                  ) : (
                    <>
                      {selectedPlan === "annual" ? p.annualProceedLabel : (selectedPlan === "monthly" ? p.monthlyProceedLabel : "Select a plan")}
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                    </>
                  )}
                </RelliaAction>

                <div className="w-full flex flex-col items-start gap-4">
                  <span className="inline-flex px-3 py-1 rounded-full bg-rellia-mint/20 text-rellia-teal text-xs font-bold uppercase tracking-wider">
                    Limited time
                  </span>
                  <div className="space-y-4">
                    <p className="font-urbanist text-lg text-black/70">
                      Founding members get <span className="font-bold text-rellia-teal">50% off</span> first purchase using code <span className="font-bold text-black">{p.discountBannerSubtitle.trim() || "RELLIA50"}</span>
                    </p>
                    <button 
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 transition-colors font-host-grotesk text-sm font-bold text-black"
                    >
                      {codeCopied ? (
                        <CheckCircle2 className="h-4 w-4 text-rellia-teal" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {codeCopied ? "Code copied!" : "Copy code"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RelliaCta 
          title={p.questionsTitle} 
          body="Have questions about the membership, billing, or benefits? We're here to help you get the most out of the Rellia network."
          primary={{ label: p.questionsContactLabel, to: p.questionsContactPath }}
          secondary={{ label: p.questionsFaqLabel, to: p.questionsFaqPath }}
          className="mt-20 md:mt-32"
        />
      </main>

      <Footer />
    </div>
  )
}
