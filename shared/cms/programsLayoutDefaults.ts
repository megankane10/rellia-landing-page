import type { ProgramsLayoutPageContent, QmsProgramContent } from "./types"

export const DEFAULT_PROGRAMS_LAYOUT_PAGE: ProgramsLayoutPageContent = {
  howItWorksTitle: "How it works",
  pillarsTitle: "Program pillars",
  timelineTitle: "Program timeline",
  timelineWeekLabelPrefix: "Week",
}

/** Apply shared layout copy when a program field is empty. */
export const applyProgramsLayoutDefaults = (
  program: QmsProgramContent,
  layout: ProgramsLayoutPageContent | null | undefined,
): QmsProgramContent => {
  const shared = layout ?? DEFAULT_PROGRAMS_LAYOUT_PAGE
  const next = { ...program }

  if (!next.howItWorksTitle?.trim()) {
    next.howItWorksTitle = shared.howItWorksTitle ?? DEFAULT_PROGRAMS_LAYOUT_PAGE.howItWorksTitle!
  }
  if (!next.howItWorksIntro?.trim() && shared.howItWorksIntro?.trim()) {
    next.howItWorksIntro = shared.howItWorksIntro
  }
  if (!next.pillarsTitle?.trim()) {
    next.pillarsTitle = shared.pillarsTitle ?? DEFAULT_PROGRAMS_LAYOUT_PAGE.pillarsTitle!
  }
  if (!next.timelineTitle?.trim()) {
    next.timelineTitle = shared.timelineTitle ?? DEFAULT_PROGRAMS_LAYOUT_PAGE.timelineTitle!
  }
  if (!next.timelineSubtitle?.trim() && shared.timelineSubtitle?.trim()) {
    next.timelineSubtitle = shared.timelineSubtitle
  }

  const programPillars = (next.pillars ?? []).filter(
    (pillar) => pillar?.title?.trim() || pillar?.description?.trim(),
  )
  const layoutPillars = (shared.pillars ?? []).filter(
    (pillar) => pillar?.title?.trim() || pillar?.description?.trim(),
  )
  if (programPillars.length === 0 && layoutPillars.length > 0) {
    next.pillars = layoutPillars
  }

  return next
}
