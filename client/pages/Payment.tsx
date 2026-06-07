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
import { PriceDisplay } from "@/components/cms/PriceDisplay"
import { formatPromoMessage } from "@/lib/mergeDiagnosticSurvey"

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

      <main id="main-content" className="flex w-full flex-1 flex-col pt-[72px] md:pt-[86px]">
        <section className="relative w-full border-t border-black/5 py-16 md:py-24 lg:py-32 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* Left: Benefits Card */}
            <div className="flex flex-col w-full">
              <div className="relative flex flex-col overflow-hidden rounded-[1.75rem] bg-rellia-teal p-8 md:p-10 lg:p-12 w-full h-full min-h-[600px]">
                {/* Background image & gradient overlay contained within card */}
                <div className="absolute inset-0 pointer-events-none">
                  <img 
                    src="/images/benefits-payment.jpg" 
                    alt="" 
                    aria-hidden
                    className="h-full w-full object-cover opacity-[0.35] mix-blend-overlay scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal via-[#0f5c5c] to-rellia-teal/85" />
                  <div className="absolute -left-20 -top-20 w-[400px] h-[400px] bg-rellia-mint/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 flex min-h-[520px] flex-col">
                  <h1 className="font-host-grotesk text-2xl md:text-[32px] font-semibold tracking-tight text-rellia-mint mb-10 leading-tight">
                    {p.benefitsPanelHeadline?.trim() || p.benefitsTitle}
                  </h1>

                  <div className="flex flex-col gap-y-5 md:gap-y-6">
                    {benefitsGrid.map((benefit, index) => {
                      return (
                        <div key={index} className="flex items-start gap-4 group">
                          <span
                            className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-rellia-mint transition-transform duration-300 group-hover:scale-110"
                            aria-hidden
                          />
                          <p className="font-urbanist text-white text-base sm:text-lg font-medium leading-relaxed">
                            {benefit}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-auto pt-10 self-start">
                    <img
                      src="/images/hologram-logo.png"
                      alt=""
                      aria-hidden
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 opacity-90 drop-shadow-[0_0_15px_rgba(152,255,232,0.35)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Plan Selection */}
            <div className="flex flex-col w-full md:px-8">
              <div className="w-full h-full flex flex-col justify-center">
                <h2 className="font-host-grotesk text-2xl md:text-[32px] font-semibold text-black mb-10 tracking-tight">
                  {p.choosePlanHeadline?.trim() || "Choose your plan"}
                </h2>
                    
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
                        <PriceDisplay
                          amount={p.pricingAnnualAmount}
                          compareAmount={p.pricingAnnualCompareAmount}
                          discountEnabled={p.pricingAnnualDiscountEnabled}
                          suffix="/yr"
                          suffixClassName="text-black/40 font-medium text-base"
                        />
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
                        <PriceDisplay
                          amount={p.pricingMonthlyAmount}
                          compareAmount={p.pricingMonthlyCompareAmount}
                          discountEnabled={p.pricingMonthlyDiscountEnabled}
                          suffix="/mo"
                          suffixClassName="text-black/40 font-medium text-base"
                        />
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

                    {p.discountBannerEnabled ? (
                      <div className="w-full flex flex-col items-start gap-4">
                        {p.promoPillEnabled !== false ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rellia-mint/20 text-rellia-teal text-xs font-black uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rellia-teal opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rellia-teal"></span>
                            </span>
                            {p.discountBannerBadge.trim() || "Limited time"}
                          </span>
                        ) : null}
                        <div className="space-y-4">
                          <p className="font-urbanist text-lg text-black/70">
                            {formatPromoMessage(
                              p.promoMessage?.trim() ||
                                p.discountBannerTitle?.trim() ||
                                "Founding members get 50% off first purchase using code {code}",
                              p.discountBannerSubtitle.trim() || "RELLIA50",
                            )}
                          </p>
                          <button
                            type="button"
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
                    ) : null}
                  </div>
                </div>
          </motion.div>
        </section>

        <RelliaCta 
          title={p.questionsTitle || "Questions about membership?"} 
          body={p.questionsBody || "Have questions about the membership, billing, or benefits? We're here to help you get the most out of the Rellia network."}
          primary={{ label: p.questionsContactLabel || "Contact us", to: p.questionsContactPath || "/contact" }}
          secondary={{ label: p.questionsFaqLabel || "View FAQ", to: p.questionsFaqPath || "/faq" }}
          className="mt-20 md:mt-32"
        />
      </main>

      <Footer />
    </div>
  )
}