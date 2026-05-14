/**
 * Static blocks for "Advisory Board Match" program.
 */
import { UserPlus, Scale, FileText, Search, Handshake, Shield, Users } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const ADVISORY_BOARD_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: Search,
      title: "Advisor Discovery",
      description: "Define your advisory needs by clinical domain, commercial expertise, and regulatory experience — then get matched with vetted advisors from Rellia's network.",
    },
    {
      icon: Scale,
      title: "Equity Benchmarking",
      description: "Understand market-standard advisory equity compensation, vesting structures, and engagement terms so you make fair, strategic offers.",
    },
    {
      icon: FileText,
      title: "Legal Frameworks",
      description: "Receive advisor agreement templates covering IP assignment, confidentiality, compensation, and termination — ready for your lawyer's review.",
    },
  ],
  pillars: [
    { icon: UserPlus, title: "Strategic Matching", description: "We match advisors to your specific gaps — regulatory, clinical, commercial — not generic mentorship." },
    { icon: Handshake, title: "Productive Relationships", description: "Set clear expectations, meeting cadence, and deliverables from day one so advisory relationships produce results." },
    { icon: Shield, title: "Protected Equity", description: "Benchmark your offers against market data so you don't over-dilute for advisory support." },
    { icon: Users, title: "Board Composition", description: "Build a balanced advisory board that covers clinical, regulatory, commercial, and investment perspectives." },
  ],
  timeline: [
    { month: "Week 1–2 — Needs Assessment", weeks: ["Advisory gap analysis and board composition planning", "Ideal advisor profile development"] },
    { month: "Week 3–4 — Matching", weeks: ["Advisor shortlisting from Rellia's network", "Introduction meetings and fit assessment"] },
    { month: "Week 5–6 — Terms", weeks: ["Equity benchmarking and compensation structuring", "Advisory agreement drafting and legal review"] },
    { month: "Week 7–8 — Launch", weeks: ["Onboarding process and meeting cadence setup", "First advisory session facilitation and feedback"] },
  ],
}
