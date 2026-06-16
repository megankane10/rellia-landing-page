import type { LucideIcon } from "lucide-react"

/** One icon + title + body card (How it works, Pillars, etc.) */
export type ProgramPageIconCard = {
  icon: LucideIcon
  /** Optional CMS icon override (Lucide name). */
  iconKey?: string
  title: string
  description: string
  imageSrc?: string
}

export type ProgramTimelineStep = {
  heading?: string
  points: Array<string | { _type?: "programTimelineHeading"; text?: string }>
}

export type ProgramTimelineMonth = {
  month: string
  /** Optional badge above the accordion title (from CMS stepLabel). */
  stepLabel?: string
  /** Supports simple strings or structured objects with headings and sub-points. */
  weeks: (string | ProgramTimelineStep)[]
}

/** Icons and timeline defaults — title/body/images merge from CMS when present. */
export type ProgramPageStaticBlocks = {
  howItWorksCards: ProgramPageIconCard[]
  pillars: ProgramPageIconCard[]
  timeline: ProgramTimelineMonth[]
}
