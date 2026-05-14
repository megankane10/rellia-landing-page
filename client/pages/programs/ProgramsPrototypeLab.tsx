import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { PROTOTYPE_LAB_STATIC_BLOCKS } from "@shared/cms/programs/prototype-lab.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
  heroTitle: "A Low-Fidelity Prototype Lab",
  heroDescription: "Transform your vision into a functional low-fidelity prototype and a vendor-ready requirements document. Connect with vetted development firms to build your proof of concept.",
  heroCtaLabel: "Join Waitlist",
  outcomesTitle: "Program Outcomes",
  outcomesIntro: "By the end of this program, you will have a testable prototype and the documentation to take it to production.",
  outcomes: [
    "A functional low-fidelity prototype you can demo to users and investors",
    "A vendor-ready requirements document with user stories and technical specs",
    "Clinical workflow validation for your core product flows",
    "Introductions to vetted development firms and testing partners",
    "Technical architecture decisions documented for your build phase",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro: "A sprint-based program that takes you from product vision to a testable prototype with vendor introductions.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "8 weeks from concept to prototype with vendor-ready specs",
  pricingBadge: "Waitlist",
  pricingAmount: "$1,800",
  pricingSubAmount: ".00",
  pricingDescription: "Join the waitlist to be notified when the Low-Fidelity Prototype Lab opens.",
  pricingBullets: ["Requirements documentation", "Rapid prototyping tools", "Vendor matching and intros", "Technical architecture guidance"],
  bottomCtaTitle: "**Ready** to build your prototype?",
  bottomCtaBody: "Join the waitlist and we'll notify you when the next cohort starts.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
}

export default function ProgramsPrototypeLab() {
  return <ProgramPageLayout cms={CMS} cmsSlug="low-fidelity-prototype-lab" heroImageSrc="/images/programs-PrototypeLab.png" heroImageAlt="A Low-Fidelity Prototype Lab" outcomesSectionId="prototype-outcomes" staticBlocks={PROTOTYPE_LAB_STATIC_BLOCKS} isWaitlist />
}
