import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { REGULATORY_ROADMAP_STATIC_BLOCKS } from "@shared/cms/programs/regulatory-roadmap.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/qnMWtHtTkyus",
  heroTitle: "Regulatory Strategy Sprint",
  heroDescription: "Navigate the complexities of medical device classification and global commercialization milestones. Leave with a documented regulatory strategy that supports investor due diligence.",
  heroCtaLabel: "Get started",
  status: "upcoming",
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
  timelineSubtitle: "4 weeks to build your regulatory roadmap from classification to market",
  pricingBadge: "Upcoming",
  pricingAmount: "$2,000",
  pricingSubAmount: ".00",
  pricingDescription: "The next cohort of the Regulatory Strategy Sprint is opening soon. Secure your spot now to ensure your participation.",
  pricingBullets: ["Multi-jurisdiction classification", "Pathway selection guidance", "Intended use statement drafting", "Regulatory milestone timeline"],
  bottomCtaTitle: "Not sure if your product needs a **regulatory pathway**?",
  bottomCtaBody: "Many health tech products require regulatory clearance — but not all do. Reach out and we'll help you figure out where you stand.",
  bottomCtaButtonLabel: "Contact Us",
  bottomContactHref: "/contact",
  testimonials: [
    {
      name: "Ibukun Elebute",
      role: "Founder & COO",
      company: "Cellect",
      image: "/images/ibukun.jpg",
      logo: "/images/cellect-logo.png",
      quote: "As an early-stage medtech company navigating regulatory readiness, having a structured system with clear guidance made a huge difference. The templates were practical and startup-friendly, the process was easy to follow, and the support helped us understand not just what needed to be done, but how to do it properly.",
    },
    {
      name: "Dr Stevie Foglia",
      role: "Founder & CEO",
      company: "Neuro-Mod",
      image: "/images/drstrevie.png",
      logo: "/images/portfolio-neuromod.png",
      quote: "Rellia has been excellent to work with and has played an integral role in building our regulatory plans. I would highly recommend them to anyone looking to navigate regulatory submissions for a medical-related product. They are true experts in their field.",
    },
  ],
}

export default function ProgramsRegulatoryRoadmap() {
  return <ProgramPageLayout cms={CMS} cmsSlug="regulatory-strategy-sprint" heroImageSrc="/images/programs-regulatoryRoadmap.png" heroImageAlt="Regulatory Strategy Sprint" outcomesSectionId="regulatory-outcomes" staticBlocks={REGULATORY_ROADMAP_STATIC_BLOCKS} />
}
