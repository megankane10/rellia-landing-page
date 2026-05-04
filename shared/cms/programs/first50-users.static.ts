/**
 * Static blocks for the "First 50 Users: A Clinical Feedback Intensive" program.
 */
import { Users, Microscope, HeartPulse, ClipboardList, MessageCircle, Shield, TestTube } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const FIRST50_USERS_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: Users,
      title: "Clinician Network Access",
      description: "Connect with vetted clinicians, nurses, and healthcare professionals from Rellia's network who match your product's clinical use case for structured feedback sessions.",
    },
    {
      icon: Microscope,
      title: "Usability Testing Facilitation",
      description: "Run facilitated usability sessions with real clinical end-users, guided by research methodology that produces actionable, publishable insights.",
    },
    {
      icon: ClipboardList,
      title: "IRB & Ethics Guidance",
      description: "Navigate IRB requirements and ethical considerations for clinical feedback so your evidence is credible and your process is compliant.",
    },
  ],
  pillars: [
    { icon: HeartPulse, title: "Clinical Validation", description: "Move from assumptions to evidence with structured clinical feedback that investors and buyers trust." },
    { icon: MessageCircle, title: "User-Centered Design", description: "Identify workflow gaps and usability barriers before you scale — saving months of rework." },
    { icon: Shield, title: "Compliant Process", description: "Follow a research process that meets ethical standards and can support future regulatory submissions." },
    { icon: TestTube, title: "Publishable Insights", description: "Generate findings structured enough to inform white papers, case studies, or clinical validation plans." },
  ],
  timeline: [
    { month: "Week 1–2 — Design", weeks: ["Research protocol development and user persona mapping", "Assumption audit and hypothesis prioritization"] },
    { month: "Week 3–4 — Recruit", weeks: ["Clinician matching and session scheduling", "IRB considerations and consent framework"] },
    { month: "Week 5–6 — Test", weeks: ["Facilitated usability testing sessions (3–5 sessions)", "Real-time observation and feedback capture"] },
    { month: "Week 7–8 — Synthesize", weeks: ["Findings report and product recommendation document", "Investor-ready clinical validation summary"] },
  ],
}
