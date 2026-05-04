import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { ELEVATE_CAPITAL_STATIC_BLOCKS } from "@shared/cms/programs/elevate-capital.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
  heroTitle: "Elevate: Healthcare Capital",
  heroDescription: "Refine your existing fundraising strategy for the specialized world of health tech. Upgrade your pitch to meet the specific technical and clinical expectations of healthcare investors.",
  heroCtaLabel: "Join Waitlist",
  outcomesTitle: "Program Outcomes",
  outcomesIntro: "By the end of this program, you will have a healthcare-specific fundraising strategy and materials ready for specialized investors.",
  outcomes: [
    "A refined pitch deck calibrated for healthcare-specialized investors",
    "Financial projections reflecting reimbursement and procurement models",
    "Clinical and regulatory narrative that builds investor conviction",
    "Warm introductions to matched healthcare investors through Rellia's network",
    "Diligence-ready materials that withstand healthcare-specific scrutiny",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro: "Upgrade your fundraising approach with healthcare-specific strategy, materials, and investor access.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "8 weeks to elevate your fundraising for healthcare capital",
  pricingBadge: "Waitlist",
  pricingAmount: "$2,200",
  pricingSubAmount: ".00",
  pricingDescription: "Join the waitlist to be the first to know when Elevate: Healthcare Capital opens for enrollment.",
  pricingBullets: ["Healthcare investor mapping", "Financial model upgrade", "Mock pitch with investor panel", "Warm intro strategy"],
  bottomCtaTitle: "**Ready** to raise healthcare capital?",
  bottomCtaBody: "Join the waitlist and we'll notify you when the next cohort starts.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
}

export default function ProgramsElevateCapital() {
  return <ProgramPageLayout cms={CMS} heroImageSrc="/images/program-HealthcareCapital.png" heroImageAlt="Elevate: Healthcare Capital" outcomesSectionId="elevate-outcomes" staticBlocks={ELEVATE_CAPITAL_STATIC_BLOCKS} isWaitlist />
}
