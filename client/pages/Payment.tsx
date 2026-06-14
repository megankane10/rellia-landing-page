import { useCallback, useEffect, useState } from "react"
import {
  CheckCircle2,
  ArrowRight,
  Copy,
  ShieldCheck,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import MembershipWelcomeSplash from "@/components/MembershipWelcomeSplash"
import MembershipBenefitsPanel from "@/components/MembershipBenefitsPanel"
import { usePaymentPage } from "@/hooks/useCmsDocuments"
import {
  DEFAULT_PAYMENT_PAGE,
  getPaymentPagePanelDescriptionPortable,
} from "@shared/cms/defaults"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { cn } from "@/lib/utils"
import { PriceDisplay } from "@/components/cms/PriceDisplay"
import { formatPromoMessage } from "@/lib/mergeDiagnosticSurvey"
import { cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

const MEMBERSHIP_SPLASH_COMPLETE_SESSION_KEY = "rellia-membership-splash-complete-session"

const readMembershipSplashCompleteFromSession = () => {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem(MEMBERSHIP_SPLASH_COMPLETE_SESSION_KEY) === "true"
}

const markMembershipSplashSeenInSession = () => {
  if (typeof window === "undefined") return
  sessionStorage.setItem(MEMBERSHIP_SPLASH_COMPLETE_SESSION_KEY, "true")
}

export default function Payment() {
  const { data: paymentCms, isPending: paymentCmsPending } = usePaymentPage()
  const p = paymentCms ?? DEFAULT_PAYMENT_PAGE
  useApplyCmsSeo(p.seo)
  const previewMode = isVisualEditingPreview()

  const [codeCopied, setCodeCopied] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | null>(null)
  const [splashComplete, setSplashComplete] = useState(
    () =>
      !DEFAULT_PAYMENT_PAGE.welcomeSplashEnabled ||
      previewMode ||
      readMembershipSplashCompleteFromSession(),
  )

  const monthlyHref = (import.meta.env.VITE_STRIPE_MONTHLY_PLAN_LINK as string | undefined)?.trim()
  const annualHref = (import.meta.env.VITE_STRIPE_ANNUAL_PLAN_LINK as string | undefined)?.trim()
  const currentHref = selectedPlan === "annual" ? annualHref : monthlyHref

  const splashEnabled = paymentCmsPending
    ? DEFAULT_PAYMENT_PAGE.welcomeSplashEnabled
    : Boolean(p.welcomeSplashEnabled)

  const showSplash =
    splashEnabled &&
    !splashComplete &&
    !previewMode

  const splashBackgroundSrc =
    p.welcomeSplashBackgroundSrc?.trim() ||
    DEFAULT_PAYMENT_PAGE.welcomeSplashBackgroundSrc ||
    "/images/membership-splash.jpg"

  const panelImageSrc =
    p.benefitsPanelImageSrc?.trim() ||
    DEFAULT_PAYMENT_PAGE.benefitsPanelImageSrc ||
    "/images/membership-splash.jpg"

  const panelDescriptionPortable = getPaymentPagePanelDescriptionPortable(p)

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true)
    markMembershipSplashSeenInSession()
  }, [])

  useEffect(() => {
    if (readMembershipSplashCompleteFromSession()) {
      setSplashComplete(true)
    }
  }, [])

  useEffect(() => {
    if (paymentCmsPending || previewMode) return
    if (!p.welcomeSplashEnabled) {
      setSplashComplete(true)
    }
  }, [paymentCmsPending, p.welcomeSplashEnabled, previewMode])

  useEffect(() => {
    if (!showSplash) return
    markMembershipSplashSeenInSession()
  }, [showSplash])

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

  useEffect(() => {
    if (!showSplash) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showSplash])

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      {showSplash ? (
        <MembershipWelcomeSplash
          enabled
          heading={p.welcomeSplashHeadingPortable ?? DEFAULT_PAYMENT_PAGE.welcomeSplashHeadingPortable}
          subheading={p.welcomeSplashSubheading ?? DEFAULT_PAYMENT_PAGE.welcomeSplashSubheading ?? ""}
          backgroundSrc={splashBackgroundSrc}
          logoSrc={
            p.welcomeSplashLogoSrc?.trim() ||
            DEFAULT_PAYMENT_PAGE.welcomeSplashLogoSrc ||
            "/svgs/rellia-secondary-logo-circle-health-white-rgb.svg"
          }
          holdAfterRevealSeconds={
            p.welcomeSplashDurationSeconds ??
            DEFAULT_PAYMENT_PAGE.welcomeSplashDurationSeconds
          }
          onComplete={handleSplashComplete}
        />
      ) : null}

      <div
        className={cn(showSplash && "invisible pointer-events-none")}
        aria-hidden={showSplash}
      >
      <Navbar deferModals={showSplash} forceHidden={showSplash} />

      <main id="main-content" className="flex w-full flex-1 flex-col">
        <section className="relative w-full pt-[84px] md:pt-[100px] pb-[12px] md:pb-[14px]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <ScrollReveal variant="ctaReveal" hold={showSplash} className="flex flex-col p-4 pb-8 md:p-6 md:pb-10 lg:p-8">
              <MembershipBenefitsPanel
                headline={p.benefitsPanelHeadline?.trim() || p.benefitsTitle}
                descriptionPortable={panelDescriptionPortable ?? []}
                imageEnabled={p.benefitsPanelImageEnabled ?? DEFAULT_PAYMENT_PAGE.benefitsPanelImageEnabled}
                imageSrc={panelImageSrc}
              />
            </ScrollReveal>

            <ScrollReveal
              variant="ctaReveal"
              delay={0.12}
              hold={showSplash}
              className="relative flex items-center justify-center overflow-hidden bg-white px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20"
            >
              <div className="absolute top-1/4 -right-20 w-80 h-80 bg-rellia-mint/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-10 -right-20 w-80 h-80 bg-rellia-mint/10 rounded-full blur-[120px] pointer-events-none" />

              <div className="relative z-10 w-full max-w-xl">
                <h2 className="font-host-grotesk text-2xl md:text-[32px] font-semibold text-black mb-10 tracking-tight">
                  {cmsDisplayText(p.choosePlanHeadline?.trim() || "Choose your plan")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-6">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("annual")}
                    className={cn(
                      "relative flex flex-col items-start p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 text-left min-w-0",
                      selectedPlan === "annual"
                        ? "border-rellia-teal bg-white shadow-lg ring-4 ring-rellia-teal/5"
                        : "border-black/5 bg-black/[0.02] hover:bg-black/[0.04] hover:border-black/10",
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
                        : "border-black/5 bg-black/[0.02] hover:bg-black/[0.04] hover:border-black/10",
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
                    Cancel at any time
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
                  {selectedPlan === "annual"
                    ? cmsDisplayText(p.annualProceedLabel)
                    : selectedPlan === "monthly"
                      ? cmsDisplayText(p.monthlyProceedLabel)
                      : "Select a plan"}
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                </RelliaAction>

                {p.discountBannerEnabled || p.promoMessage?.trim() ? (
                  <div className="w-full flex flex-col items-start gap-4">
                    {p.promoMessage?.trim() ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rellia-mint/20 text-rellia-teal text-xs font-black uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rellia-teal opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rellia-teal"></span>
                        </span>
                        {cmsDisplayText(p.discountBannerBadge.trim() || "Limited time")}
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
            </ScrollReveal>
          </div>
        </section>

        <ScrollReveal variant="ctaReveal" delay={0.08} hold={showSplash}>
          <RelliaCta
            title={p.questionsTitle || "Questions about membership?"}
            body={p.questionsBody || "Have questions about the membership, billing, or benefits? We're here to help you get the most out of the Rellia network."}
            primary={{ label: p.questionsContactLabel || "Contact us", to: p.questionsContactPath || "/contact" }}
            secondary={{ label: p.questionsFaqLabel || "View FAQ", to: p.questionsFaqPath || "/faq" }}
            className="mt-20 md:mt-32"
          />
        </ScrollReveal>
      </main>

      <Footer />
      </div>
    </div>
  )
}
