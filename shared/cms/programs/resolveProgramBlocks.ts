import type { ProgramPageIconCard, ProgramTimelineMonth } from "./types"

export type ProgramCmsTimelineWeek = {
  heading?: string
  points?: string[]
}

export type ProgramCmsTimelineStep = {
  title?: string
  stepLabel?: string
  /** @deprecated Legacy flat timeline rows — migrated to `weeks`. */
  weekLabel?: string
  /** @deprecated Legacy newline-separated bullet list — migrated to `weeks`. */
  description?: string
  weeks?: ProgramCmsTimelineWeek[]
}

export type ProgramCmsPillar = {
  title?: string
  description?: string
  iconKey?: string
}

export type ProgramCmsHowItWorksCard = {
  title?: string
  description?: string
  imageSrc?: string
}

const hasText = (value?: string) => Boolean(value?.trim())

const filterCmsCards = <T extends { title?: string; description?: string; imageSrc?: string }>(
  cards: T[] | undefined,
): T[] =>
  (cards ?? []).filter(
    (card) => hasText(card.title) || hasText(card.description) || hasText(card.imageSrc),
  )

const filterCmsPillars = (pillars: ProgramCmsPillar[] | undefined): ProgramCmsPillar[] =>
  (pillars ?? []).filter((pillar) => hasText(pillar.title) || hasText(pillar.description))

export const resolveProgramPillars = (
  cmsPillars: ProgramCmsPillar[] | undefined,
  staticPillars: ProgramPageIconCard[],
): ProgramPageIconCard[] => {
  const cms = filterCmsPillars(cmsPillars)
  if (cms.length === 0) return staticPillars

  return cms.map((pillar, index) => {
    const staticPillar = staticPillars[index] ?? staticPillars[staticPillars.length - 1]
    return {
      icon: staticPillar?.icon ?? staticPillars[0]?.icon,
      iconKey: pillar.iconKey?.trim() || undefined,
      title: pillar.title?.trim() || staticPillar?.title || "",
      description: pillar.description?.trim() || staticPillar?.description || "",
    }
  })
}

export const resolveProgramHowItWorksCards = (
  cmsCards: ProgramCmsHowItWorksCard[] | undefined,
  staticCards: ProgramPageIconCard[],
): ProgramPageIconCard[] => {
  const cms = filterCmsCards(cmsCards)
  if (cms.length === 0) return staticCards

  return cms.map((card, index) => {
    const staticCard = staticCards[index] ?? staticCards[staticCards.length - 1]
    return {
      icon: staticCard?.icon ?? staticCards[0]?.icon,
      title: card.title?.trim() || staticCard?.title || "",
      description: card.description?.trim() || staticCard?.description || "",
      imageSrc: card.imageSrc?.trim() || staticCard?.imageSrc,
    }
  })
}

const parseLegacyDescription = (description?: string): string[] =>
  (description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

const normalizeCmsWeeks = (
  weeks: ProgramCmsTimelineWeek[] | undefined,
): ProgramTimelineMonth["weeks"] =>
  (weeks ?? [])
    .map((week) => {
      const points = (week.points ?? []).map((point) => point.trim()).filter(Boolean)
      if (points.length === 0) return null

      const heading = week.heading?.trim()
      if (heading) return { heading, points }
      if (points.length === 1) return points[0]
      return { points }
    })
    .filter((week): week is NonNullable<typeof week> => week !== null)

const hasStructuredTimeline = (steps: ProgramCmsTimelineStep[]) =>
  steps.some((step) =>
    (step.weeks ?? []).some((week) => (week.points ?? []).some((point) => point.trim())),
  )

const isLegacyTimeline = (steps: ProgramCmsTimelineStep[]) =>
  steps.every(
    (step) =>
      !step.weeks?.length &&
      Boolean(step.description?.trim() || step.weekLabel?.trim()),
  )

export const resolveProgramTimeline = (
  cmsSteps: ProgramCmsTimelineStep[] | undefined,
  staticTimeline: ProgramTimelineMonth[],
): ProgramTimelineMonth[] => {
  const steps = (cmsSteps ?? []).filter((step) => Boolean(step?.title?.trim()))
  if (steps.length === 0) return staticTimeline

  if (!hasStructuredTimeline(steps)) {
    if (isLegacyTimeline(steps)) {
      return steps.map((step, index) => ({
        month: step.title?.trim() || step.weekLabel?.trim() || `Step ${index + 1}`,
        stepLabel: step.weekLabel?.trim() || step.stepLabel?.trim() || `Step ${index + 1}`,
        weeks: parseLegacyDescription(step.description),
      }))
    }

    return staticTimeline
  }

  return steps.map((step, index) => {
    const staticMonth = staticTimeline[index]
    const weeks = normalizeCmsWeeks(step.weeks)

    return {
      month: step.title!.trim(),
      stepLabel: step.stepLabel?.trim() || staticMonth?.stepLabel || `Step ${index + 1}`,
      weeks,
    }
  })
}
