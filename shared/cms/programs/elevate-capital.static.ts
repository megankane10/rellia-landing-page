/**
 * Static blocks for the "Elevate: Healthcare Capital" program.
 */
import { TrendingUp, Stethoscope, DollarSign, Target, LineChart, Handshake, Award } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const ELEVATE_CAPITAL_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: LineChart,
      title: "Healthcare Investor Mapping",
      description: "Identify and prioritize the investors who actually fund your category — digital health, devices, diagnostics — with warm intro pathways through the Rellia network.",
    },
    {
      icon: DollarSign,
      title: "Financial Modeling for Health Tech",
      description: "Build financial projections that reflect healthcare-specific revenue models: reimbursement, procurement cycles, pilot-to-contract timelines, and regulatory milestones.",
    },
    {
      icon: Stethoscope,
      title: "Clinical & Regulatory Narrative",
      description: "Translate your clinical evidence and regulatory strategy into investor-ready language that builds conviction with healthcare-specialized LPs and GPs.",
    },
  ],
  pillars: [
    { icon: Target, title: "Thesis Alignment", description: "Match your company's stage, category, and traction to investors whose thesis and check size actually fit." },
    { icon: TrendingUp, title: "Traction Metrics", description: "Define the KPIs healthcare investors care about — clinical engagement, pilot conversion, regulatory milestones — and present them clearly." },
    { icon: Handshake, title: "Warm Introductions", description: "Leverage Rellia's investor network for curated intros once your materials are diligence-ready." },
    { icon: Award, title: "Diligence Ready", description: "Exit the program with materials, metrics, and a data room that can withstand healthcare-specific scrutiny." },
  ],
  timeline: [
    { month: "Week 1–2 — Positioning", weeks: ["Healthcare investor landscape analysis", "Fundraising narrative and thesis alignment workshop"] },
    { month: "Week 3–4 — Materials", weeks: ["Deck upgrade for healthcare sophistication", "Financial model with reimbursement and procurement logic"] },
    { month: "Week 5–6 — Diligence Prep", weeks: ["Clinical evidence and regulatory strategy framing", "Data room review and investor FAQ preparation"] },
    { month: "Week 7–8 — Execution", weeks: ["Mock pitch with healthcare investor panel", "Intro strategy and outreach sequencing"] },
  ],
}
