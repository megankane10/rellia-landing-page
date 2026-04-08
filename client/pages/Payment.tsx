import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check, CheckCircle2, Copy } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import PromoBanner from "@/components/PromoBanner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { usePaymentPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PAYMENT_PAGE, DEFAULT_STRIPE_PAYMENT_LINK_FALLBACK } from "@shared/cms/defaults"
import { cn } from "@/lib/utils"

export default function Payment() {
  const { data: paymentCms } = usePaymentPage()
  const p = paymentCms ?? DEFAULT_PAYMENT_PAGE

  const [codeCopied, setCodeCopied] = useState(false)
  const [billingCadence, setBillingCadence] = useState<"monthly" | "annual">("annual")

  const monthlyHref =
    (import.meta.env.VITE_STRIPE_MONTHLY_PLAN_LINK as string | undefined)?.trim() || DEFAULT_STRIPE_PAYMENT_LINK_FALLBACK
  const annualHref =
    (import.meta.env.VITE_STRIPE_ANNUAL_PLAN_LINK as string | undefined)?.trim() || DEFAULT_STRIPE_PAYMENT_LINK_FALLBACK

  const selectedPlan = useMemo(() => {
    const isAnnual = billingCadence === "annual"
    return {
      cadence: billingCadence,
      href: isAnnual ? annualHref : monthlyHref,
      badge: isAnnual ? p.pricingAnnualBadge : p.pricingMonthlyBadge,
      amount: isAnnual ? p.pricingAnnualAmount : p.pricingMonthlyAmount,
      proceedLabel: isAnnual ? p.annualProceedLabel : p.monthlyProceedLabel,
    }
  }, [
    annualHref,
    billingCadence,
    monthlyHref,
    p.annualProceedLabel,
    p.monthlyProceedLabel,
    p.pricingAnnualAmount,
    p.pricingAnnualBadge,
    p.pricingMonthlyAmount,
    p.pricingMonthlyBadge,
  ])

  const handleCopyCode = () => {
    const code = p.discountBannerSubtitle.trim() || "RELLIA50"
    void navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

  const paymentHeadingParts = useMemo(() => {
    const raw = p.benefitsTitle ?? ""
    const needle = "Rellia Health"
    if (!raw.includes(needle)) {
      return { before: "Join the ", accent: "Rellia Health", after: " Network" }
    }
    const [before, after] = raw.split(needle)
    return { before: before || "", accent: needle, after: after || "" }
  }, [p.benefitsTitle])

  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex, nofollow"
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  const benefitsImageSrc = "/images/benefits-payment.jpg"

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main>
        <>
          <section className="relative overflow-hidden bg-rellia-teal pt-[87px]">
            <div className="pointer-events-none absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rellia-mint via-transparent to-transparent blur-3xl" />
            </div>
            <img
              src="/images/hologram-logo.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[70%] md:h-[90%] w-auto object-contain opacity-[0.07] select-none"
            />

            <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 pt-16 pb-36 md:pt-24 md:pb-44">
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                <span>{p.heroHeadlinePrefix}</span>
                <span className="text-rellia-mint">{p.heroHeadlineAccent}</span>
                <br />
                <span>{p.heroHeadlineSuffix}</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl max-w-3xl font-urbanist leading-relaxed">{p.heroSubheadline}</p>
            </div>
          </section>

          <section className="relative z-10 -mt-16 px-4 md:-mt-24 md:px-8">
            <div className="absolute inset-x-0 bottom-0 top-16 bg-rellia-cream md:top-24" aria-hidden />
            <div className="relative mx-auto max-w-[1300px]">
              <div
                className="relative overflow-hidden rounded-[40px] bg-cover bg-center md:rounded-[56px]"
                style={{ backgroundImage: `url(${benefitsImageSrc})` }}
              >
                <div className="absolute inset-0 bg-black/55" aria-hidden />

                <div className="relative px-6 pb-[150px] pt-9 md:px-10 md:pb-[220px] md:pt-11 lg:px-12">
                  <div className="max-w-2xl space-y-3 md:space-y-4">
                    <span className="inline-flex w-fit items-center rounded-[20px] border border-rellia-mint/70 bg-rellia-mint/90 px-4 py-1.5 font-urbanist text-sm font-semibold text-rellia-teal">
                      {p.imageCardBadge}
                    </span>
                    <h2 className="font-host-grotesk text-3xl font-bold leading-tight tracking-[-0.02em] text-white md:text-[40px] md:leading-tight w-3/4">
                      <span>{p.imageCardHeadlinePrefix}</span>
                      <span className="text-rellia-mint">{p.imageCardHeadlineAccent}</span>
                    </h2>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="grid grid-cols-1 border-t border-white/35 bg-gradient-to-b from-transparent to-rellia-teal sm:grid-cols-2 lg:grid-cols-4">
                      {p.highlightBenefits.map((line, index) => (
                        <div
                          key={`${index}-${line.slice(0, 20)}`}
                          className={cn(
                            "group relative flex min-h-[140px] items-center justify-center overflow-hidden px-6 py-7 text-center md:min-h-[160px] md:px-8 lg:min-h-[190px]",
                            index > 0 && "border-t border-white/35 sm:border-t-0 sm:border-l lg:border-t-0",
                          )}
                        >
                          <span
                            className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-700 ease-in-out group-hover:scale-y-100"
                            aria-hidden
                          />
                          <p className="relative z-10 font-urbanist text-base font-semibold leading-snug tracking-[-0.01em] text-white/90 transition-colors duration-700 ease-in-out group-hover:text-primary-foreground md:text-lg">
                            {line}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-x-hidden bg-rellia-cream py-20 md:py-24">
            <div className="mx-auto max-w-[1100px] px-6 md:px-10">
              <h2 className="mb-10 text-center font-host-grotesk text-3xl font-semibold tracking-tight text-black md:mb-12 md:text-[40px] md:leading-tight">
                <span>{paymentHeadingParts.before || "Join the "}</span>
                <span className="text-rellia-teal">{paymentHeadingParts.accent}</span>
                <span>{paymentHeadingParts.after || " Network"}</span>
              </h2>

              <ul className="mx-auto flex max-w-3xl flex-col gap-4 md:gap-5" role="list">
                {p.benefits.map((benefit, index) => (
                  <li key={`${index}-${benefit.slice(0, 20)}`} className="flex list-none items-start gap-3 md:gap-4">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-rellia-teal" aria-hidden />
                    <span className="font-urbanist text-base leading-relaxed text-black/75 md:text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 md:mt-10">
                <div className="mx-auto flex w-fit flex-col items-center gap-3">
                  <ToggleGroup
                    type="single"
                    value={billingCadence}
                    onValueChange={(next) => {
                      if (next !== "monthly" && next !== "annual") return
                      setBillingCadence(next)
                    }}
                    aria-label="Billing cadence"
                    className="rounded-full border border-black/10 bg-white p-1 shadow-sm"
                  >
                    <ToggleGroupItem
                      value="monthly"
                      aria-label="Monthly billing"
                      className="rounded-full px-4 py-2 font-urbanist text-sm data-[state=on]:bg-rellia-teal data-[state=on]:text-white"
                    >
                      Monthly
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="annual"
                      aria-label="Annual billing"
                      className="rounded-full px-4 py-2 font-urbanist text-sm data-[state=on]:bg-rellia-teal data-[state=on]:text-white"
                    >
                      Annual
                    </ToggleGroupItem>
                  </ToggleGroup>

                  <span className="font-urbanist text-xs text-black/55">Choose monthly or annual billing</span>
                </div>

                <div className="mx-auto mt-6 max-w-[560px]">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-[28px] border border-black/10 bg-white p-6 shadow-sm md:p-8",
                      billingCadence === "annual" && "ring-2 ring-rellia-teal/20",
                    )}
                    role="region"
                    aria-label="Membership pricing"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-5 flex items-center gap-2">
                        <span className="inline-flex h-[30px] items-center justify-center rounded-full border border-black/15 bg-transparent px-4 font-urbanist text-sm text-black/60">
                          {selectedPlan.badge}
                        </span>
                      </div>

                      <div className="mb-6">
                        <span className="font-host-grotesk text-6xl font-bold tracking-[-0.03em] text-rellia-teal">
                          {selectedPlan.amount}
                        </span>
                        <span className="ml-2 font-host-grotesk text-xl font-bold text-[#5e5c5c]">
                          {p.pricingPerSuffix}
                        </span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-black/10" />

                    <div className="mt-6">
                      <RelliaAction asChild variant="tealCardFull" className="h-[52px] text-base">
                        <a href={selectedPlan.href} target="_blank" rel="noopener noreferrer">
                          {selectedPlan.proceedLabel}
                          <ArrowRight />
                        </a>
                      </RelliaAction>
                    </div>
                  </div>
                </div>
              </div>

              <PromoBanner
                className="mt-8 md:mt-10"
                badge={p.discountBannerBadge}
                title={p.discountBannerTitle}
                code={p.discountBannerSubtitle.trim() || "RELLIA50"}
                copied={codeCopied}
                onCopy={handleCopyCode}
              />

              <div className="mt-16 rounded-3xl bg-rellia-teal px-8 py-14 text-center md:mt-20 md:px-16 md:py-20">
                <h3 className="mx-auto mb-8 max-w-[760px] font-host-grotesk text-3xl font-bold leading-tight tracking-tight text-white md:text-[40px]">
                  {p.questionsTitle}
                </h3>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                  <RelliaAction asChild variant="mintOnTealStrip" className="min-w-[220px] px-8 py-4 text-base">
                    <Link to={p.questionsFaqPath}>{p.questionsFaqLabel}</Link>
                  </RelliaAction>
                  <RelliaAction asChild variant="heroSolidOnTeal" className="min-w-[220px] px-8 py-4 text-base">
                    <Link to={p.questionsContactPath}>{p.questionsContactLabel}</Link>
                  </RelliaAction>
                </div>
              </div>
            </div>
          </section>
        </>
      </main>

      <Footer />
    </div>
  )
}
