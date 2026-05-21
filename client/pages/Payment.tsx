import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Copy,
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

const BENEFIT_ICONS = [Sparkles, ShieldCheck, Users, Target, Zap]

export default function Payment() {
  const { data: paymentCms } = usePaymentPage()
  const p = paymentCms ?? DEFAULT_PAYMENT_PAGE
  useApplyCmsSeo(p.seo)

  const [codeCopied, setCodeCopied] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | null>(null)

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

  const handleProceed = () => {
    if (currentHref) window.location.href = currentHref
  }

  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex, nofollow"
    document.head.appendChild(meta)
    return () => { document.head.removeChild(meta) }
  }, [])

  const benefitsGrid = useMemo(() => {
    return p.benefits.filter(b => !b.toLowerCase().includes("cancel")).slice(0, 4)
  }, [p.benefits])

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <section className="relative w-full border-t border-black/5 pt-24 md:pt-10">
          {/* Full Bleed Background Layers (Persistent) */}
          <div className="absolute inset-0 flex flex-col md:flex-row pointer-events-none">
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 flex flex-col md:flex-row min-h-[820px]"
          >
                {/* Left: Benefits */}
                <div className="flex-1 flex flex-col justify-start items-start pt-16 pb-14 md:pt-28 md:pb-20 pr-6 md:pr-16 relative">
                  <div className="relative z-10 w-full max-w-[500px]">
                    <h1 className="font-host-grotesk text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10 leading-[1.1] text-white">
                      Join the <span className="text-rellia-mint">Rellia Network</span> today
                    </h1>

                    <div className="flex flex-col gap-y-12 md:gap-y-16">
                      {benefitsGrid.map((benefit, index) => {
                        const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length]
                        return (
                          <div key={index} className="flex items-start gap-5 md:gap-6 group">
                            <Icon
                              className="mt-1 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-rellia-mint transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                              aria-hidden
                              strokeWidth={2.5}
                            />
                            <p className="font-urbanist text-white text-base sm:text-lg md:text-xl font-medium leading-relaxed">
                              {benefit}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Plan Selection */}
                <div className="flex-1 flex flex-col justify-start pt-16 pb-14 md:pt-28 md:pb-20 md:pl-16 relative">
                  <div className="w-full h-full flex flex-col">
                    <h2 className="font-host-grotesk text-2xl md:text-3xl font-bold text-black mb-10">Choose your plan</h2>
                    
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
                      disabled={!selectedPlan || !currentHref}
                      onClick={handleProceed}
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