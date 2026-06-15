import { useEffect, useMemo } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import AdvisorDirectoryCard from "@/components/network/AdvisorDirectoryCard"
import { DIRECTORY_CARD_GRID_CLASS } from "@/components/network/profilePageGrid"
import RelatedContentSection from "@/components/related/RelatedContentSection"
import {
  type AdvisorDirectoryEntry,
} from "@/data/advisorDirectory"
import { useAdvisors, useNetworkAdvisorsDirectoryPage } from "@/hooks/useCmsDocuments"
import { resolveAdvisorPrimaryTag } from "@/lib/resolveAdvisorPrimaryTag"
import { isSanityConfigured } from "@/lib/sanity"
import { mergeNetworkAdvisorsDirectoryPage } from "@shared/cms/directoryPageDefaults"
import { pickRelatedByPrimaryTag } from "@shared/cms/relatedStories"

type RelatedAdvisorsProps = {
  currentAdvisorId: string
  primaryTag?: string
  onHasRelatedChange?: (hasRelated: boolean) => void
}

const RelatedAdvisors = ({
  currentAdvisorId,
  primaryTag,
  onHasRelatedChange,
}: RelatedAdvisorsProps) => {
  const { data: cmsAdvisors } = useAdvisors()
  const { data: advisorsDirectoryPage } = useNetworkAdvisorsDirectoryPage()
  const copy = mergeNetworkAdvisorsDirectoryPage(advisorsDirectoryPage)

  const related = useMemo(() => {
    const cmsPool = (
      isSanityConfigured() && Array.isArray(cmsAdvisors)
        ? (cmsAdvisors as AdvisorDirectoryEntry[])
        : []
    ).filter((advisor) => advisor.id && advisor.name && advisor.photoSrc)

    const pool = cmsPool

    return pickRelatedByPrimaryTag(
      pool,
      currentAdvisorId,
      primaryTag,
      3,
      (advisor) => advisor.id,
      (advisor) => resolveAdvisorPrimaryTag(advisor),
      (advisor) => Number.parseInt(String(advisor.yearJoined ?? "0"), 10) || 0,
    )
  }, [cmsAdvisors, currentAdvisorId, primaryTag])

  const visible = copy.relatedSectionEnabled !== false && related.length > 0

  useEffect(() => {
    onHasRelatedChange?.(visible)
  }, [onHasRelatedChange, visible])

  if (copy.relatedSectionEnabled === false || related.length === 0) return null

  return (
    <RelatedContentSection
      headingId="related-advisors-heading"
      title={copy.relatedSectionTitle ?? "More advisors"}
      subheadline={
        copy.relatedSectionSubheadline ??
        "Explore mentors who support health tech founders across the Rellia network."
      }
      viewAllHref="/advisors/directory"
      viewAllLabel="View all advisors"
      gridClassName={`mt-8 md:mt-10 ${DIRECTORY_CARD_GRID_CLASS}`}
    >
      {related.map((advisor, index) => (
        <ScrollReveal key={advisor.id} delay={index * 0.05} className="h-full">
          <AdvisorDirectoryCard
            advisor={advisor}
            href={`/advisors/directory/${advisor.id}`}
          />
        </ScrollReveal>
      ))}
    </RelatedContentSection>
  )
}

export default RelatedAdvisors
