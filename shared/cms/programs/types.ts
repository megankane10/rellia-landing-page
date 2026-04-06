import type { LucideIcon } from "lucide-react"

/** One icon + title + body card (How it works, Pillars, etc.) */
export type ProgramPageIconCard = {
  icon: LucideIcon
  title: string
  description: string
}

export type ProgramTimelineMonth = {
  month: string
  weeks: string[]
}

/** Content not yet modeled in Sanity — keep per-program in `*.static.ts` files. */
export type ProgramPageStaticBlocks = {
  howItWorksCards: ProgramPageIconCard[]
  pillars: ProgramPageIconCard[]
  timeline: ProgramTimelineMonth[]
}
