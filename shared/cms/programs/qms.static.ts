/**
 * Static QMS program blocks (icons, timeline). CMS-driven strings are now loaded from
 * the shared `programPage` document for slug `build-your-qms`.
 *
 * Adding another program: create e.g. `shared/cms/programs/investment.static.ts` with the same shape,
 * add a route in `App.tsx` that renders `<ProgramPageLayout cms={...} staticBlocks={INVESTMENT_STATIC} ... />`,
 * and optionally add a Sanity document type later for full editorial control.
 */
import {
  FileText,
  GraduationCap,
  Layers,
  ShieldCheck,
  Timer,
  UserCheck,
  Wrench,
} from "lucide-react"
import type { ProgramPageStaticBlocks } from "./types"

export const QMS_PROGRAM_STATIC_BLOCKS: ProgramPageStaticBlocks = {
  howItWorksCards: [
    {
      icon: FileText,
      title: "Starting Frameworks",
      description:
        "Receive customized SOPs and templates that serve as your foundation - designed to be flexible enough for early-stage startups.",
    },
    {
      icon: Wrench,
      title: "Implementation Support",
      description:
        "Work through building your QMS with support and accountability at every step so nothing falls through the cracks",
    },
    {
      icon: UserCheck,
      title: "1-on-1 Mentorship",
      description:
        "Get personalized guidance from quality and regulatory experts who have built processes for medical device companies and who understand your constraints",
    },
  ],
  pillars: [
    {
      icon: ShieldCheck,
      title: "Compliance Simplified",
      description:
        "Complex regulatory requirements are translated into clear, scalable systems appropriate for early-stage companies.",
    },
    {
      icon: Layers,
      title: "Own Your Own Processes",
      description:
        "No two companies operate the same way. We build your QMS around how your team actually works, not with one-size-fits-all templates.",
    },
    {
      icon: GraduationCap,
      title: "Expert Guidance",
      description:
        "Your mentor knows quality inside and out. Together you get it done without adding quality management to your already long list of things to master.",
    },
    {
      icon: Timer,
      title: "Take It At Your Own Pace",
      description:
        "Every startup moves differently. The program flexes to your timeline, capacity, and priorities because we know that your QMS is just one of the hundred things you are juggling right now.",
    },
  ],
  timeline: [
    {
      month: "Month 1 — Core Processes",
      weeks: [
        {
          heading: "Week 1–2",
          points: ["QMS gap assessment and regulatory landscape", "Document control system setup", "Employee training and hiring practices", "Work environment and security controls"],
        },
        {
          heading: "Week 3–4",
          points: ["Design controls", "Product development lifecycle (IEC 62304)", "Risk management framework (ISO 14971)"],
        },
      ],
    },
    {
      month: "Month 2 — Vendors and Manufacturing Partners",
      weeks: [
        {
          heading: "Week 5–6",
          points: ["Validation of third-party tools and production processes", "Configuration and change management", "Supplier evaluation"],
        },
        {
          heading: "Week 7–8",
          points: ["Purchasing processes", "Inspection of purchased products and services", "Production and operations controls"],
        },
      ],
    },
    {
      month: "Month 3 — Market Launch",
      weeks: [
        {
          heading: "Week 9–10",
          points: ["Labeling and distribution", "Marketing and sales", "Installation and customer support"],
        },
        {
          heading: "Week 11–12",
          points: ["Post-market monitoring and customer complaint handling", "Regulatory and legal compliance", "Adverse events and recall management"],
        },
      ],
    },
    {
      month: "Month 4 — Continuous Improvements",
      weeks: [
        {
          heading: "Week 13–14",
          points: ["Handling defects", "Preventing future issues from occurring", "Internal and external audit preparation"],
        },
        {
          heading: "Week 15–16",
          points: ["Data analysis and improvements", "Management responsibilities", "Quality system summary and future objectives"],
        },
      ],
    },
  ],
}
