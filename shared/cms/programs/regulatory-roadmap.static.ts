/**
 * Static blocks for "Regulatory Roadmap" program.
 */
import { Map, ShieldCheck, FileText, Globe, Compass, Scale, ClipboardCheck } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const REGULATORY_ROADMAP_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: Map,
      title: "Classification & Pathway",
      description: "Determine your product's device classification across FDA, Health Canada, and EU MDR — and map the fastest viable regulatory pathway for each market.",
    },
    {
      icon: FileText,
      title: "Intended Use Documentation",
      description: "Draft precise intended use and indications for use statements that align your regulatory, clinical, and commercial strategy from the start.",
    },
    {
      icon: Globe,
      title: "Global Market Strategy",
      description: "Build a phased commercialization timeline across key markets, understanding the regulatory dependencies and milestones investors expect to see.",
    },
  ],
  pillars: [
    { icon: Compass, title: "Pathway Clarity", description: "Understand exactly which regulatory submissions you need, in what order, and what evidence each requires." },
    { icon: ShieldCheck, title: "Risk-Based Approach", description: "Use ISO 14971 risk management principles to inform your classification and submission strategy from day one." },
    { icon: Scale, title: "Investor Alignment", description: "Frame your regulatory strategy as a de-risking milestone that builds investor confidence in your timeline." },
    { icon: ClipboardCheck, title: "Actionable Roadmap", description: "Leave with a documented regulatory strategy and timeline you can execute against and share with stakeholders." },
  ],
  timeline: [
    { month: "Week 1–2 — Classification", weeks: ["Product classification analysis across FDA, HC, and MDR", "Predicate device and substantial equivalence research"] },
    { month: "Week 3–4 — Strategy", weeks: ["Regulatory pathway selection and rationale", "Intended use and indications for use drafting"] },
    { month: "Week 5–6 — Global Planning", weeks: ["Multi-market commercialization phasing", "Evidence requirements mapping per jurisdiction"] },
    { month: "Week 7–8 — Documentation", weeks: ["Regulatory strategy document finalization", "Investor-ready regulatory milestone timeline"] },
  ],
}
