import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { FIRST50_USERS_STATIC_BLOCKS } from "@shared/cms/programs/first50-users.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
  heroTitle: "First 50 Users",
  heroDescription: "Validate your product through facilitated usability testing and assumption audits with Rellia's clinician network. Bridge the gap between prototype and clinical use.",
  heroCtaLabel: "Join Waitlist",
  outcomesTitle: "Program Outcomes",
  outcomesIntro: "By the end of this program, you will have real clinical feedback and a validation framework investors trust.",
  outcomes: [
    "Structured usability feedback from matched clinical end-users",
    "IRB-compliant research methodology and documentation",
    "Validated product-market fit with clinician-generated evidence",
    "Actionable product improvement recommendations based on real workflow testing",
    "Investor-ready clinical validation summary",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro: "Connect with real clinicians, run structured feedback sessions, and produce evidence that matters to investors and buyers.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "8 weeks from prototype to validated clinical feedback",
  pricingBadge: "Waitlist",
  pricingAmount: "$2,500",
  pricingSubAmount: ".00",
  pricingDescription: "Join the waitlist to be notified when First 50 Users opens for the next cohort.",
  pricingBullets: ["Clinician network access", "Facilitated usability sessions", "IRB guidance and templates", "Publishable findings report"],
  bottomCtaTitle: "**Ready** to validate with real users?",
  bottomCtaBody: "Join the waitlist and we'll notify you when the next cohort begins.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
}

export default function ProgramsFirst50Users() {
  return <ProgramPageLayout cms={CMS} heroImageSrc="/images/program-first50users.png" heroImageAlt="First 50 Users" outcomesSectionId="first50-outcomes" staticBlocks={FIRST50_USERS_STATIC_BLOCKS} isWaitlist />
}
