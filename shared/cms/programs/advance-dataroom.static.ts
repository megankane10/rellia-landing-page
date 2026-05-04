/**
 * Static blocks for the "Advance: Data Room Deep Dive" program.
 */
import { Database, FileSearch, FolderOpen, Shield, BookOpen, ClipboardCheck, BarChart3 } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const ADVANCE_DATAROOM_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: FolderOpen,
      title: "Data Room Architecture",
      description: "Build a structured, investor-grade data room that surfaces the right documents at each stage of due diligence — from term sheet to close.",
    },
    {
      icon: FileSearch,
      title: "Diligence Simulation",
      description: "Walk through a mock due diligence process with experienced investors so you know exactly what questions to expect and how to answer them.",
    },
    {
      icon: Database,
      title: "Document Preparation",
      description: "Get hands-on help organizing cap tables, IP assignments, regulatory filings, and financial projections into diligence-ready formats.",
    },
  ],
  pillars: [
    { icon: Shield, title: "Investor Confidence", description: "A well-organized data room signals operational maturity and dramatically speeds up the closing process." },
    { icon: BookOpen, title: "Healthcare Specifics", description: "Regulatory submissions, clinical evidence, and reimbursement docs have unique diligence requirements we address directly." },
    { icon: ClipboardCheck, title: "Checklist Driven", description: "Use our comprehensive diligence checklist covering legal, financial, IP, regulatory, and clinical categories." },
    { icon: BarChart3, title: "Stage-Appropriate", description: "We calibrate what belongs in your data room based on your funding stage — no unnecessary complexity for pre-seed teams." },
  ],
  timeline: [
    { month: "Week 1–2 — Audit", weeks: ["Current document inventory and gap analysis", "Priority document creation roadmap"] },
    { month: "Week 3–4 — Build", weeks: ["Cap table cleanup and corporate docs", "Regulatory and IP documentation prep"] },
    { month: "Week 5–6 — Organize", weeks: ["Data room platform setup and structure", "Financial model and projection formatting"] },
    { month: "Week 7–8 — Simulate", weeks: ["Mock diligence walkthrough with investor panel", "Final cleanup, permissions, and launch checklist"] },
  ],
}
