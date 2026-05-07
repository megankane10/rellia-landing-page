import ProgramPageLayout from "@/components/program/ProgramPageLayout"
import { IGNITE_PITCH_STATIC_BLOCKS } from "@shared/cms/programs/ignite-pitch.static"
import type { QmsProgramContent } from "@shared/cms/types"

const CMS: QmsProgramContent = {
  paymentUrl: "https://forms.fillout.com/t/bLGtn6S2jtus",
  heroTitle: "Ignite: Pitch Foundations",
  heroDescription: "Master the essentials of fundraising by crafting your first pitch deck and presentation. Perfect for early-stage founders looking for a structured starting point to build investor confidence.",
  heroCtaLabel: "Join Waitlist",
  outcomesTitle: "Program Outcomes",
  outcomesIntro: "By the end of this program, you will have the tools and confidence to pitch your health tech startup to investors.",
  outcomes: [
    "A polished, investor-ready pitch deck tailored to healthcare investors",
    "A rehearsed 5-minute pitch with confident delivery",
    "Clear understanding of what healthcare investors look for at pre-seed and seed",
    "Financial model basics specific to health tech business models",
    "Peer-reviewed narrative and slide design",
  ],
  howItWorksTitle: "How It Works",
  howItWorksIntro: "Each week you receive structured coaching, peer feedback, and live practice sessions to build your pitch from the ground up.",
  pillarsTitle: "Program Pillars",
  timelineTitle: "Program Timeline & Details",
  timelineSubtitle: "An 8-week intensive to take you from idea to investor-ready pitch",
  pricingBadge: "Waitlist",
  pricingAmount: "$1,500",
  pricingSubAmount: ".00",
  pricingDescription: "Join the waitlist to be the first to know when Ignite: Pitch Foundations opens for enrollment.",
  pricingBullets: ["8-week structured curriculum", "Live pitch practice sessions", "1-on-1 narrative coaching", "Investor-ready deck template"],
  bottomCtaTitle: "**Ready** to pitch with confidence?",
  bottomCtaBody: "Join the waitlist and we'll notify you as soon as the next cohort opens.",
  bottomCtaButtonLabel: "Contact",
  bottomContactHref: "/contact",
}

export default function ProgramsIgnitePitch() {
  return <ProgramPageLayout cms={CMS} cmsSlug="ignite-pitch-foundations" heroImageSrc="/images/program-ignitePitch.png" heroImageAlt="Ignite: Pitch Foundations" outcomesSectionId="ignite-outcomes" staticBlocks={IGNITE_PITCH_STATIC_BLOCKS} isWaitlist />
}
