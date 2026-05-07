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
          <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row py-20 md:py-32 gap-16 lg:gap-24">
            {/* Divider line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-black/10 -translate-x-1/2" />

            {/* Brand Gradient Blur */}
            <div className="absolute -left-20 top-40 h-[500px] w-[500px] rounded-full bg-rellia-mint/20 blur-[120px] pointer-events-none" />
            <div className="absolute right-[-10%] bottom-0 h-[400px] w-[400px] rounded-full bg-rellia-teal/5 blur-[100px] pointer-events-none" />

            {/* Left: Benefits */}
            <div className="flex-1 relative z-10 flex flex-col justify-start items-start md:pr-12 lg:pr-20">
              <h3 className="font-host-grotesk text-3xl md:text-4xl font-bold tracking-tight text-black mb-12">Join the Rellia Network</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 w-full">
                {p.benefits
                  .filter(b => !b.toLowerCase().includes("cancel"))
                  .slice(0, 4)
                  .map((benefit, index) => {
                    const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length]
                    return (
                      <div key={index} className="flex flex-col items-start gap-4 max-w-[240px]">
                        <Icon className="h-8 w-8 text-rellia-teal" aria-hidden strokeWidth={2} />
                        <p className="font-urbanist text-black/75 text-[17px] font-medium leading-relaxed">
                          {benefit}
                        </p>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Right: Plan Selection */}
            <div className="flex-1 relative z-10 flex flex-col justify-start items-start md:pl-12 lg:pl-20">
              <h2 className="font-host-grotesk text-2xl font-bold text-black mb-10">Choose your plan</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-6">
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
                  <span className="font-host-grotesk text-xs font-bold uppercase tracking-widest text-rellia-teal mb-4">Annual</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-black tracking-tight">{p.pricingAnnualAmount}</span>
                    <span className="text-black/40 font-medium text-base">/yr</span>
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
                  <span className="font-host-grotesk text-xs font-bold uppercase tracking-widest text-rellia-teal mb-4">Monthly</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-black tracking-tight">{p.pricingMonthlyAmount}</span>
                    <span className="text-black/40 font-medium text-base">/mo</span>
                  </div>
                </button>
              </div>

              {/* Cancel any time note */}
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
                onClick={() => {
                  if (!currentHref) {
                    alert("Payment links are not configured. Please check environment variables.");
                    return;
                  }
                  window.location.href = currentHref;
                }} 
                className="w-full h-[60px] text-lg font-bold mb-12 shadow-md hover:shadow-lg transition-all"
              >
                {selectedPlan === "annual" ? p.annualProceedLabel : (selectedPlan === "monthly" ? p.monthlyProceedLabel : "Select a plan")}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </RelliaAction>

              {/* Promo Code Box (Restored) */}
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
