import type { LucideIcon } from "lucide-react"

/** One icon + title + body card (How it works, Pillars, etc.) */
export type ProgramPageIconCard = {
  icon: LucideIcon
  title: string
  description: string
}

export type ProgramTimelineStep = {
  heading?: string
  points: string[]
}

export type ProgramTimelineMonth = {
  month: string
  /** Supports simple strings or structured objects with headings and sub-points. */
  weeks: (string | ProgramTimelineStep)[]
}

/** Content not yet modeled in Sanity — keep per-program in `*.static.ts` files. */
export type ProgramPageStaticBlocks = {
  howItWorksCards: ProgramPageIconCard[]
  pillars: ProgramPageIconCard[]
  timeline: ProgramTimelineMonth[]
}
