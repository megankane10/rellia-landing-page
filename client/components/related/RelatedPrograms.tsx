import { useEffect, useMemo } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import RelatedContentSection from "@/components/related/RelatedContentSection"
import RelatedProgramCard from "@/components/related/RelatedProgramCard"
import { RELATED_COMPACT_GRID_CLASS } from "@/components/related/relatedCompactGrid"
import { usePrograms, useProgramsLayoutPage } from "@/hooks/useCmsDocuments"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { isProgramAvailable } from "@shared/cms/programStatus"
import {
  DEFAULT_PROGRAMS_RELATED_COPY,
  mergeRelatedContentCopy,
} from "@shared/cms/relatedContentCopy"

type RelatedProgramsProps = {
  currentSlug: string
  onHasRelatedChange?: (hasRelated: boolean) => void
}

const normalizeProgramSlug = (program: { slug?: string; href?: string; title?: string }) => {
  const explicit = program.slug?.trim().toLowerCase()
  if (explicit) return explicit
  const fromHref = program.href?.replace(/^\/programs\//, "").trim().toLowerCase()
  if (fromHref) return fromHref
  return program.title?.toLowerCase().trim().replace(/[^a-z0-9]/g, "") ?? ""
}

const RelatedPrograms = ({ currentSlug, onHasRelatedChange }: RelatedProgramsProps) => {
  const { data: programsData } = usePrograms()
  const { data: layoutPage } = useProgramsLayoutPage()
  const copy = mergeRelatedContentCopy(layoutPage, DEFAULT_PROGRAMS_RELATED_COPY)

  const related = useMemo(() => {
    const rawList =
      programsData && programsData.length > 0
        ? programsData
        : allowCmsSeedFallbacks()
          ? DEFAULT_PROGRAMS_LANDING.programs
          : []

    const current = currentSlug.trim().toLowerCase()

    return rawList
      .filter((program) => isProgramAvailable(program))
      .filter((program) => normalizeProgramSlug(program) !== current)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title))
      .slice(0, 3)
  }, [currentSlug, programsData])

  const visible = copy.relatedSectionEnabled && related.length > 0

  useEffect(() => {
    onHasRelatedChange?.(visible)
  }, [onHasRelatedChange, visible])

  if (!visible) return null

  return (
    <RelatedContentSection
      headingId="related-programs-heading"
      title={copy.relatedSectionTitle}
      subheadline={copy.relatedSectionSubheadline}
      viewAllHref="/programs"
      viewAllLabel="View all programs"
      gridClassName={RELATED_COMPACT_GRID_CLASS}
    >
      {related.map((program, index) => (
        <ScrollReveal key={normalizeProgramSlug(program) || program.title} delay={index * 0.05} className="h-full">
          <RelatedProgramCard program={program} />
        </ScrollReveal>
      ))}
    </RelatedContentSection>
  )
}

export default RelatedPrograms
