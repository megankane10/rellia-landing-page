/**
 * Static blocks for "Regulatory Strategy Sprint" program.
 */
import { Map, ShieldCheck, FileText, Globe, Compass, Scale, ClipboardCheck } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const REGULATORY_ROADMAP_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: Map,
      title: "Classification & Pathway",
      description: "Determine your product's device classification across FDA, Health Canada, and EU MDR — and map the fastest viable regulatory pathway for each market.",
      imageSrc: "/images/road.jpg",
    },
    {
      icon: FileText,
      title: "Intended Use Documentation",
      description: "Draft precise intended use and indications for use statements that align your regulatory, clinical, and commercial strategy from the start.",
      imageSrc: "/images/intended-use.png",
    },
    {
      icon: Globe,
      title: "Global Market Strategy",
      description: "Build a phased commercialization timeline across key markets, understanding the regulatory dependencies and milestones investors expect to see.",
      imageSrc: "/images/globalmarket.png",
    },
  ],
  pillars: [
    { icon: Compass, title: "Pathway Clarity", description: "Understand exactly which regulatory submissions you need, in what order, and what evidence each requires." },
    { icon: ShieldCheck, title: "Risk-Based Approach", description: "Use ISO 14971 risk management principles to inform your classification and submission strategy from day one." },
    { icon: Scale, title: "Investor Alignment", description: "Frame your regulatory strategy as a de-risking milestone that builds investor confidence in your timeline." },
    { icon: ClipboardCheck, title: "Actionable Roadmap", description: "Leave with a documented regulatory strategy and timeline you can execute against and share with stakeholders." },
  ],
  timeline: [
    { month: "Week 1 — Intended Use & Classification", weeks: ["Device vs. non-device determination", "Intended use statement drafting and product classification"] },
    { month: "Week 2 — Submission Pathway & Market Strategy", weeks: ["Regulatory submission outline and timeline estimate", "Target market prioritization and implications"] },
    { month: "Week 3 — Evidence and Testing Strategy", weeks: ["Validation, usability, clinical evaluation, and cybersecurity requirements", "Phased testing roadmap to know what can be deferred to after submission"] },
    { month: "Week 4 — Investor Narrative and Regulatory Positioning", weeks: ["Investor-ready regulatory strategy with risk framing", "Pitch deck language review and recommended next steps"] },
  ],
}
