import type { ProgramPageIconCard } from "./types"

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
