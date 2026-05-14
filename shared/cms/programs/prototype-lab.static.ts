/**
 * Static blocks for "A Low-Fidelity Prototype Lab" program.
 */
import { Cpu, PenTool, FileCode, Blocks, Wrench, Workflow, Package } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const PROTOTYPE_LAB_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: PenTool,
      title: "Requirements Documentation",
      description: "Transform your product vision into a vendor-ready requirements document with user stories, workflow diagrams, and technical constraints mapped out.",
    },
    {
      icon: Blocks,
      title: "Rapid Prototyping",
      description: "Build a functional low-fidelity prototype using no-code or low-code tools that you can put in front of users and investors within weeks.",
    },
    {
      icon: Wrench,
      title: "Vendor Matching",
      description: "Connect with vetted development firms and testing experts from Rellia's partner network to take your prototype to the next stage.",
    },
  ],
  pillars: [
    { icon: Cpu, title: "Technical Clarity", description: "Define your product's technical architecture and constraints before spending on development — saving months and dollars." },
    { icon: FileCode, title: "Spec-Ready Output", description: "Leave with documentation that a development team can estimate and build from immediately." },
    { icon: Workflow, title: "Clinical Workflow Fit", description: "Validate that your product integrates into real clinical workflows, not just theoretical use cases." },
    { icon: Package, title: "Build-Ready", description: "Exit with a prototype, requirements doc, and vendor introductions to begin your build phase with confidence." },
  ],
  timeline: [
    { month: "Week 1–2 — Discovery", weeks: ["Product vision workshop and feature prioritization", "User journey mapping and workflow analysis"] },
    { month: "Week 3–4 — Specification", weeks: ["Requirements document drafting", "Technical architecture and integration planning"] },
    { month: "Week 5–6 — Prototype", weeks: ["Low-fidelity prototype build sprint", "Internal testing and iteration"] },
    { month: "Week 7–8 — Handoff", weeks: ["Vendor evaluation and introductions", "Final prototype demo and requirements review"] },
  ],
}
