import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { BRAND_STRATEGY_STATIC_BLOCKS } from "@shared/cms/programs/brand-strategy.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
  heroTitle: "Design Your Brand Strategy",
  heroDescription: "Develop a professionally positioned brand identity that earns trust from both clinicians and investors. Includes sprints for website copy, UI design, and sales collateral.",
  heroCtaLabel: "Join Waitlist",
  outcomesTitle: "Program Outcomes",
  outcomesIntro: "By the end of this program, you will have a cohesive brand identity and assets that earn trust across healthcare audiences.",
  outcomes: [
    "A complete visual identity system — logo direction, colors, typography",
    "Rewritten website copy structured for healthcare credibility",
    "Sales collateral designed for procurement and investor conversations",
    "A brand voice framework consistent across all touchpoints",
    "A lightweight design system for ongoing consistency as you scale",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro: "Sprint-based brand development that covers identity, messaging, and all the assets you need to look professional from day one.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "8 weeks to build a brand that earns healthcare trust",
  pricingBadge: "Waitlist",
  pricingAmount: "$2,000",
  pricingSubAmount: ".00",
  pricingDescription: "Join the waitlist to be notified when Design Your Brand Strategy opens for the next cohort.",
  pricingBullets: ["Visual identity development", "Website copy restructuring", "Sales collateral templates", "Design system documentation"],
  bottomCtaTitle: "**Ready** to build your brand?",
  bottomCtaBody: "Join the waitlist and we'll notify you when the next cohort begins.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
}

export default function ProgramsBrandStrategy() {
  return <ProgramPageLayout cms={CMS} heroImageSrc="/images/program-designYourBrand.png" heroImageAlt="Design Your Brand Strategy" outcomesSectionId="brand-outcomes" staticBlocks={BRAND_STRATEGY_STATIC_BLOCKS} isWaitlist />
}
