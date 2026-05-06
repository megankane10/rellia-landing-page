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
  Target
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { usePaymentPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PAYMENT_PAGE } from "@shared/cms/defaults"
import { cn } from "@/lib/utils"

const BENEFIT_ICONS = [Sparkles, ShieldCheck, Users, Target, Zap]

export default function Payment() {
  const { data: paymentCms } = usePaymentPage()
  const p = paymentCms ?? DEFAULT_PAYMENT_PAGE

  const [codeCopied, setCodeCopied] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | null>(null)
  const [showForm, setShowForm] = useState(false)

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

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <section className="w-full bg-white border-t border-black/5 pt-[80px]">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div 
                key="selection-view" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                transition={{ duration: 0.3 }}
              >
                <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row py-20 md:py-32 gap-16 lg:gap-24">
                  {/* Divider line */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-black/10 -translate-x-1/2" />

                  {/* Left: Plan Selection */}
                  <div className="flex-1 flex flex-col justify-start items-start md:pr-12 lg:pr-20">
                    <h2 className="font-host-grotesk text-3xl font-bold tracking-tight text-black mb-10">Choose your plan</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-12">
                      {/* Annual Plan */}
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
                        <span className="font-host-grotesk text-xs md:text-sm font-bold uppercase tracking-widest text-rellia-teal mb-4 whitespace-nowrap">Annual billing</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl md:text-5xl font-medium text-black tracking-tight">{p.pricingAnnualAmount}</span>
                          <span className="text-black/40 font-normal text-lg">/yr</span>
                        </div>
                      </button>

                      {/* Monthly Plan */}
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
                        <span className="font-host-grotesk text-xs md:text-sm font-bold uppercase tracking-widest text-rellia-teal mb-4 whitespace-nowrap">Monthly billing</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl md:text-5xl font-medium text-black tracking-tight">{p.pricingMonthlyAmount}</span>
                          <span className="text-black/40 font-normal text-lg">/mo</span>
                        </div>
                      </button>
                    </div>

                    <RelliaAction 
                      type="button" 
                      variant="mintTealFill" 
                      size="comfortable" 
                      disabled={!selectedPlan}
                      onClick={() => setShowForm(true)} 
                      className="w-full h-[56px] text-lg font-bold mb-12"
                    >
                      {selectedPlan === "annual" ? p.annualProceedLabel : (selectedPlan === "monthly" ? p.monthlyProceedLabel : "Select a plan")}
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                    </RelliaAction>

                    {/* Promo Code Box */}
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

                  {/* Right: Benefits */}
                  <div className="flex-1 flex flex-col justify-start items-start md:pl-12 lg:pl-20">
                    <h3 className="font-host-grotesk text-2xl font-bold text-black mb-8">Join the Rellia network</h3>
                    <ul className="flex flex-col gap-6 list-none w-full">
                      {p.benefits.map((benefit, index) => {
                        const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length]
                        return (
                          <li key={`${index}-${benefit.slice(0, 20)}`} className="flex items-start gap-4">
                            <Icon className="h-6 w-6 text-rellia-teal shrink-0 mt-1" aria-hidden />
                            <span className="font-urbanist text-black/75 text-lg leading-relaxed">{benefit}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="payment-view" 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
                className="w-full"
              >
                <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-10 pb-6 flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)} 
                    className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />Back to details
                  </button>
                  <div className="px-4 py-1.5 rounded-full bg-rellia-teal text-white font-host-grotesk text-xs font-bold uppercase tracking-widest">
                    Secure Checkout
                  </div>
                </div>
                
                <div className="w-full flex-1 bg-white">
                  {currentHref ? (
                    <iframe 
                      src={currentHref} 
                      title="Membership Payment" 
                      className="w-full border-0" 
                      style={{ minHeight: "calc(100svh - 140px)" }} 
                      allow="payment; fullscreen" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                      <AlertCircle className="h-16 w-16 text-rellia-teal mb-8" />
                      <h2 className="text-2xl font-bold text-rellia-teal mb-4">Payment Link Missing</h2>
                      <p className="text-black/60 font-urbanist max-w-md leading-relaxed">
                        Please set the <code className="bg-black/5 px-1.5 py-0.5 rounded text-rellia-teal font-mono text-sm">{selectedPlan === "annual" ? "VITE_STRIPE_ANNUAL_PLAN_LINK" : "VITE_STRIPE_MONTHLY_PLAN_LINK"}</code> environment variable in your deployment settings.
                      </p>
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
        />
      </main>

      <Footer />
    </div>
  )
}
