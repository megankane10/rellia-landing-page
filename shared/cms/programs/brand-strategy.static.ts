/**
 * Static blocks for "Design Your Brand Strategy" program.
 */
import { Palette, Globe, Megaphone, PenTool, Eye, Layout, Type } from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const BRAND_STRATEGY_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: Palette,
      title: "Brand Identity Sprint",
      description: "Define your visual identity, voice, and positioning in a structured sprint — including logo direction, color system, and typography that earns clinical trust.",
    },
    {
      icon: Globe,
      title: "Website & Copy Workshop",
      description: "Rewrite your website copy and structure to speak credibly to both clinicians and investors, with messaging frameworks tailored to health tech.",
    },
    {
      icon: Megaphone,
      title: "Sales Collateral Design",
      description: "Create leave-behind decks, one-pagers, and case study templates formatted for healthcare procurement and investor conversations.",
    },
  ],
  pillars: [
    { icon: Eye, title: "Clinical Credibility", description: "Healthcare buyers judge your product partly by how professional your brand looks — we help you earn that trust visually." },
    { icon: Layout, title: "Conversion-Focused", description: "Every asset is designed to move a specific audience — clinicians, buyers, or investors — toward the next step." },
    { icon: Type, title: "Consistent Voice", description: "Develop a brand voice that works across your website, pitch deck, sales calls, and regulatory submissions." },
    { icon: PenTool, title: "Design System", description: "Leave with a lightweight design system — colors, fonts, spacing, components — that keeps everything consistent as you scale." },
  ],
  timeline: [
    { month: "Week 1–2 — Discovery", weeks: ["Brand audit and competitive positioning analysis", "Audience persona mapping (clinician, buyer, investor)"] },
    { month: "Week 3–4 — Identity", weeks: ["Visual identity development (logo, color, type)", "Brand voice and messaging framework"] },
    { month: "Week 5–6 — Assets", weeks: ["Website copy and structure redesign", "Sales collateral and pitch deck alignment"] },
    { month: "Week 7–8 — Launch", weeks: ["Design system documentation", "Implementation handoff and vendor recommendations"] },
  ],
}
