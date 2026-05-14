import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { ADVISORY_BOARD_STATIC_BLOCKS } from "@shared/cms/programs/advisory-board.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
  heroTitle: "Advisory Board Match",
  heroDescription: "Identify and recruit the ideal experts for your startup using Rellia's vetted advisor network. We provide the matchmaking, equity benchmarking, and legal frameworks for productive advisory relationships.",
  heroCtaLabel: "Join Waitlist",
  outcomesTitle: "Program Outcomes",
  outcomesIntro: "By the end of this program, you will have a structured advisory board with clear terms and productive relationships.",
  outcomes: [
    "A balanced advisory board covering clinical, regulatory, and commercial expertise",
    "Market-benchmarked equity compensation and vesting structures",
    "Signed advisory agreements with clear deliverables and expectations",
    "First advisory sessions facilitated and running",
    "Ongoing advisory meeting cadence and accountability framework",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro: "From needs assessment to signed agreements — we match you with the right advisors and structure the relationship for results.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "8 weeks to build your advisory board with the right experts",
  pricingBadge: "Waitlist",
  pricingAmount: "$1,200",
  pricingSubAmount: ".00",
  pricingDescription: "Join the waitlist to be notified when Advisory Board Match opens for enrollment.",
  pricingBullets: ["Advisor matching from Rellia's network", "Equity benchmarking data", "Legal agreement templates", "Facilitated onboarding"],
  bottomCtaTitle: "**Ready** to build your advisory board?",
  bottomCtaBody: "Join the waitlist and we'll let you know when the next cohort opens.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
}

export default function ProgramsAdvisoryBoard() {
  return <ProgramPageLayout cms={CMS} cmsSlug="advisory-board-match" heroImageSrc="/images/programs-AdvisoryBoard.png" heroImageAlt="Advisory Board Match" outcomesSectionId="advisory-outcomes" staticBlocks={ADVISORY_BOARD_STATIC_BLOCKS} isWaitlist />
}
