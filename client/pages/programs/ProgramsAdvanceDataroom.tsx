import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { ADVANCE_DATAROOM_STATIC_BLOCKS } from "@shared/cms/programs/advance-dataroom.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
  heroTitle: "Advance: Data Room Deep Dive",
  heroDescription: "Move beyond the basics into the mechanics of due diligence and data room management. Gain the practical tools and execution tips needed to navigate the complexities of the raising process.",
  heroCtaLabel: "Join Waitlist",
  outcomesTitle: "Program Outcomes",
  outcomesIntro: "By the end of this program, you will have an investor-grade data room and the confidence to navigate due diligence.",
  outcomes: [
    "A structured, investor-grade data room ready for due diligence",
    "Clean cap table and corporate documentation",
    "Healthcare-specific regulatory and clinical document organization",
    "Mock diligence experience with real investor feedback",
    "Comprehensive diligence checklist covering legal, financial, IP, and regulatory",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro: "A hands-on, document-driven program that builds your data room piece by piece with expert guidance at every step.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "8 weeks to build a diligence-ready data room from scratch",
  pricingBadge: "Waitlist",
  pricingAmount: "$1,800",
  pricingSubAmount: ".00",
  pricingDescription: "Join the waitlist to be notified when Advance: Data Room Deep Dive opens for the next cohort.",
  pricingBullets: ["Data room platform setup", "Cap table and legal document templates", "Mock diligence with investors", "Healthcare-specific compliance docs"],
  bottomCtaTitle: "**Ready** for due diligence?",
  bottomCtaBody: "Join the waitlist and we'll let you know when the next cohort begins.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
}

export default function ProgramsAdvanceDataroom() {
  return <ProgramPageLayout cms={CMS} heroImageSrc="/images/program-DataRoomDeepDive.png" heroImageAlt="Advance: Data Room Deep Dive" outcomesSectionId="advance-outcomes" staticBlocks={ADVANCE_DATAROOM_STATIC_BLOCKS} isWaitlist />
}
