import type { ProgramPageIconCard, ProgramTimelineMonth } from "./types"

export type ProgramCmsTimelineStep = {
  title?: string
  description?: string
  weekLabel?: string
}

export type ProgramCmsPillar = {
  title?: string
  description?: string
}

export type ProgramCmsHowItWorksCard = {
  title?: string
  description?: string
  imageSrc?: string
}

export const resolveProgramPillars = (
  cmsPillars: ProgramCmsPillar[] | undefined,
  staticPillars: ProgramPageIconCard[],
): ProgramPageIconCard[] =>
  staticPillars.map((staticPillar, index) => {
    const cms = cmsPillars?.[index]
    if (!cms) return staticPillar
    return {
      ...staticPillar,
      title: cms.title?.trim() || staticPillar.title,
      description: cms.description?.trim() || staticPillar.description,
    }
  })

export const resolveProgramHowItWorksCards = (
  cmsCards: ProgramCmsHowItWorksCard[] | undefined,
  staticCards: ProgramPageIconCard[],
): ProgramPageIconCard[] =>
  staticCards.map((staticCard, index) => {
    const cms = cmsCards?.[index]
    if (!cms) return staticCard
    return {
      ...staticCard,
      title: cms.title?.trim() || staticCard.title,
      description: cms.description?.trim() || staticCard.description,
      imageSrc: cms.imageSrc?.trim() || staticCard.imageSrc,
    }
  })

export const resolveProgramTimeline = (
  cmsSteps: ProgramCmsTimelineStep[] | undefined,
  staticTimeline: ProgramTimelineMonth[],
): ProgramTimelineMonth[] => {
  const steps = (cmsSteps ?? []).filter((step) => Boolean(step?.title?.trim()))
  if (steps.length === 0) return staticTimeline

  return steps.map((step, index) => {
    const points = (step.description ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    return {
      month: step.title!.trim(),
      stepLabel: step.weekLabel?.trim() || `Step ${index + 1}`,
      weeks: points.length > 0 ? points : [step.description?.trim() || ""],
    }
  })
}
