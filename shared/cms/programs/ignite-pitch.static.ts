/**
 * Static blocks for the "Ignite: Pitch Foundations" program.
 */
import { FileText, Lightbulb, Presentation, Target, MessageSquare, Users, Sparkles } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const IGNITE_PITCH_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: FileText,
      title: "Pitch Deck Framework",
      description: "Receive a proven deck structure tailored for healthcare investors — covering problem, solution, market, traction, and ask slides with clinical credibility built in.",
    },
    {
      icon: Presentation,
      title: "Live Pitch Practice",
      description: "Rehearse your pitch in front of experienced operators and investors who give direct, actionable feedback on delivery, narrative, and slide design.",
    },
    {
      icon: MessageSquare,
      title: "Narrative Coaching",
      description: "Work 1-on-1 with a pitch coach to refine your founding story, clinical problem framing, and investor-ready language.",
    },
  ],
  pillars: [
    { icon: Target, title: "Investor Lens", description: "Learn exactly what healthcare investors look for at pre-seed and seed — and how to frame your company to meet those expectations." },
    { icon: Lightbulb, title: "Story First", description: "Build a pitch around a compelling narrative, not just data slides. Great pitches start with a problem worth solving." },
    { icon: Users, title: "Peer Feedback", description: "Practice with a cohort of founders at similar stages so you sharpen your pitch through real-time peer review." },
    { icon: Sparkles, title: "Polished Output", description: "Leave with a presentation-ready deck and a rehearsed 5-minute pitch you can deliver with confidence to any investor." },
  ],
  timeline: [
    { month: "Week 1–2 — Foundation", weeks: ["Problem definition and market sizing workshop", "Competitive landscape mapping and positioning"] },
    { month: "Week 3–4 — Deck Build", weeks: ["Slide-by-slide construction with template", "Financial model basics for early-stage healthcare"] },
    { month: "Week 5–6 — Rehearsal", weeks: ["Live pitch sessions with investor feedback", "Narrative refinement and delivery coaching"] },
    { month: "Week 7–8 — Final Polish", weeks: ["Design review and visual storytelling", "Mock investor Q&A and final presentation"] },
  ],
}
