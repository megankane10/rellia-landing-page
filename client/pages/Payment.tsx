import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Copy,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Users,
  Target,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { usePaymentPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PAYMENT_PAGE } from "@shared/cms/defaults"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { cn } from "@/lib/utils"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import StripeEmbeddedCheckout from "@/components/StripeEmbeddedCheckout"

const BENEFIT_ICONS = [Sparkles, ShieldCheck, Users, Target, Zap]

export default function Payment() {
  const { data: paymentCms } = usePaymentPage()
  const p = paymentCms ?? DEFAULT_PAYMENT_PAGE
  useApplyCmsSeo(p.seo)

  const [codeCopied, setCodeCopied] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | null>(null)
  const [showForm, setShowForm] = useState(false)
  const useStripeEmbed = Boolean(
    (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)?.trim(),
  )

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


  const [waitlistOpen, setWaitlistOpen] = useState(false) // Not used here but keeping state structure consistent if needed

  const benefitsGrid = useMemo(() => {
    return p.benefits.filter(b => !b.toLowerCase().includes("cancel")).slice(0, 4)
  }, [p.benefits])

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
                alt="Rellia Benefits" 
                className="h-full w-full object-cover opacity-[0.45] mix-blend-overlay scale-105"
              />
              {/* Gradient Overlay: Darker on the left edge */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-rellia-teal/40 to-transparent" />
              <div className="absolute inset-0 bg-rellia-teal/20" />
              <div className="absolute -left-20 -top-20 w-[500px] h-[500px] bg-rellia-mint/10 blur-[120px] rounded-full" />
            </div>
            <div className="flex-1 bg-white" />
          </div>

          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div 
                key="details-selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 flex flex-col md:flex-row min-h-0 md:min-h-[820px] gap-y-16 md:gap-y-0"
              >
                {/* Left: Benefits */}
                <div className="flex-1 flex flex-col justify-start items-start pt-16 pb-14 md:pt-28 md:pb-20 pr-6 md:pr-16 relative w-auto md:w-full bg-rellia-teal/90 md:bg-transparent px-6 -mx-6 sm:px-10 sm:-mx-10 md:px-0 md:mx-0 overflow-hidden md:overflow-visible">
                  {/* Full Bleed Background Layers (Mobile) */}
                  <div className="absolute inset-0 md:hidden pointer-events-none">
                    <img 
                      src="/images/benefits-payment.jpg" 
                      alt="Rellia Benefits" 
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
                <div className="flex-1 flex flex-col justify-start pt-0 pb-14 md:pt-28 md:pb-20 md:pl-16 relative">
                  <div className="w-full h-full flex flex-col">
                    <h2 className="font-host-grotesk text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black mb-10 leading-[1.1]">Choose your plan</h2>
                    
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
                      disabled={!selectedPlan}
                      onClick={() => setShowForm(true)} 
                      className="w-full h-[60px] text-lg font-bold mb-12 shadow-md hover:shadow-lg transition-all"
                    >
                      {selectedPlan === "annual" ? p.annualProceedLabel : (selectedPlan === "monthly" ? p.monthlyProceedLabel : "Select a plan")}
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
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
              </motion.div>
            ) : (
              <motion.div 
                key="checkout-embed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex w-full min-h-0 md:min-h-[820px] flex-col bg-white pt-0"
              >
                <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between px-6 pt-2 pb-4 md:px-10 md:pt-4 md:pb-6">
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)} 
                      className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />Back to details
                    </button>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rellia-teal/10 text-rellia-teal font-host-grotesk text-[11px] font-bold uppercase tracking-widest border border-rellia-teal/10">
                      <ShieldCheck className="h-4 w-4" aria-hidden />
                      Secure Checkout
                    </div>
                </div>

                <div className="stripe-embedded-checkout-shell w-full flex-1 mt-0">
                    {selectedPlan && (useStripeEmbed || currentHref) ? (
                      useStripeEmbed ? (
                        <StripeEmbeddedCheckout
                          plan={selectedPlan}
                          fallbackHref={currentHref}
                          onBack={() => setShowForm(false)}
                        />
                      ) : (
                        <iframe
                          src={currentHref}
                          title="Membership Payment"
                          className="h-full min-h-[min(900px,calc(100svh-120px))] w-full border-0"
                          allow="payment; fullscreen"
                        />
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
                        <AlertCircle className="h-16 w-16 text-rellia-teal mb-8" />
                        <h2 className="text-2xl font-bold text-rellia-teal mb-4">Payment Link Missing</h2>
                        <RelliaAction 
                          type="button" 
                          variant="outlineOnWhite" 
                          size="comfortable" 
                          onClick={() => setShowForm(false)}
                          className="mt-10"
                        >
                          Go Back
                        </RelliaAction>
                      </div>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
