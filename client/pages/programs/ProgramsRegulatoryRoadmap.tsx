import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { REGULATORY_ROADMAP_STATIC_BLOCKS } from "@shared/cms/programs/regulatory-roadmap.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
  heroTitle: "Regulatory Roadmap",
  heroDescription: "Navigate the complexities of medical device classification and global commercialization milestones. Leave with a documented regulatory strategy that supports investor due diligence.",
  heroCtaLabel: "Join Waitlist",
  outcomesTitle: "Program Outcomes",
  outcomesIntro: "By the end of this program, you will have a clear regulatory strategy and timeline you can execute against and share with stakeholders.",
  outcomes: [
    "Product classification across FDA, Health Canada, and EU MDR",
    "A documented regulatory pathway with submission requirements",
    "Precise intended use and indications for use statements",
    "A phased global commercialization timeline with regulatory dependencies",
    "An investor-ready regulatory milestone document",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro: "Work with regulatory experts to classify your device, choose the right pathway, and build a timeline investors trust.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "8 weeks to build your regulatory roadmap from classification to market",
  pricingBadge: "Waitlist",
  pricingAmount: "$2,000",
  pricingSubAmount: ".00",
  pricingDescription: "Join the waitlist to be notified when Regulatory Roadmap opens for the next cohort.",
  pricingBullets: ["Multi-jurisdiction classification", "Pathway selection guidance", "Intended use statement drafting", "Regulatory milestone timeline"],
  bottomCtaTitle: "**Ready** to map your regulatory path?",
  bottomCtaBody: "Join the waitlist and we'll let you know when the next cohort starts.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
}

export default function ProgramsRegulatoryRoadmap() {
  return <ProgramPageLayout cms={CMS} cmsSlug="regulatory-roadmap" heroImageSrc="/images/program-regulatoryRoadmap.png" heroImageAlt="Regulatory Roadmap" outcomesSectionId="regulatory-outcomes" staticBlocks={REGULATORY_ROADMAP_STATIC_BLOCKS} isWaitlist />
}
