import { useEffect, useMemo } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import FounderDirectoryCard from "@/components/network/FounderDirectoryCard"
import { DIRECTORY_CARD_GRID_CLASS } from "@/components/network/profilePageGrid"
import RelatedContentSection from "@/components/related/RelatedContentSection"
import {
  getFounderPrimaryTag,
  type FounderCompany,
} from "@/data/founderDirectory"
import { useAlumniCompanies, useNetworkAlumniDirectoryPage } from "@/hooks/useCmsDocuments"
import { isSanityConfigured } from "@/lib/sanity"
import { mergeNetworkAlumniDirectoryPage } from "@shared/cms/directoryPageDefaults"
import { pickRelatedByPrimaryTag } from "@shared/cms/relatedStories"

type RelatedAlumniCompaniesProps = {
  currentCompanyId: string
  primaryTag?: string
  onHasRelatedChange?: (hasRelated: boolean) => void
}

const mapCmsCompany = (c: Record<string, unknown>): FounderCompany => ({
  id: String(c.id),
  slug: String(c.id),
  logoName: String(c.name),
  logoSrc: typeof c.logoSrc === "string" ? c.logoSrc : "",
  tagline: typeof c.tagline === "string" ? c.tagline : "",
  countries: Array.isArray(c.countries) ? c.countries.filter(Boolean) : [],
  specialtyTags: Array.isArray(c.specialtyTags) ? c.specialtyTags.filter(Boolean) : [],
  businessModels: Array.isArray(c.businessModels) ? c.businessModels.filter(Boolean) : [],
  directoryFilters: Array.isArray(c.directoryFilters) ? c.directoryFilters : [],
  shortDescription: typeof c.shortDescription === "string" ? c.shortDescription : "",
  longDescription: typeof c.longDescription === "string" ? c.longDescription : "",
  traction: typeof c.traction === "string" ? c.traction : "",
  relliaCollaboration: typeof c.relliaCollaboration === "string" ? c.relliaCollaboration : "",
  imageSrc: "",
  yearJoined: typeof c.yearJoined === "number" ? c.yearJoined : 0,
  founders: Array.isArray(c.founders) ? c.founders : [],
  programs: [],
  profileBody: c.profileBody as FounderCompany["profileBody"],
  socialLinks: Array.isArray(c.socialLinks) ? c.socialLinks : [],
  email: typeof c.email === "string" ? c.email : undefined,
})

const RelatedAlumniCompanies = ({
  currentCompanyId,
  primaryTag,
  onHasRelatedChange,
}: RelatedAlumniCompaniesProps) => {
  const { data: cmsCompanies } = useAlumniCompanies()
  const { data: alumniDirectoryPage } = useNetworkAlumniDirectoryPage()
  const copy = mergeNetworkAlumniDirectoryPage(alumniDirectoryPage)

  const related = useMemo(() => {
    const cmsPool = isSanityConfigured()
      ? (cmsCompanies ?? [])
          .map((company) => mapCmsCompany(company as Record<string, unknown>))
          .filter((company) => company.id && company.logoName && company.logoSrc)
      : []

    const pool = cmsPool

    return pickRelatedByPrimaryTag(
      pool,
      currentCompanyId,
      primaryTag,
      3,
      (company) => company.id,
      (company) => getFounderPrimaryTag(company),
      (company) => company.yearJoined ?? 0,
    )
  }, [cmsCompanies, currentCompanyId, primaryTag])

  const visible = copy.relatedSectionEnabled !== false && related.length > 0

  useEffect(() => {
    onHasRelatedChange?.(visible)
  }, [onHasRelatedChange, visible])

  if (copy.relatedSectionEnabled === false || related.length === 0) return null

  return (
    <RelatedContentSection
      headingId="related-alumni-heading"
      title={copy.relatedSectionTitle ?? "More alumni companies"}
      subheadline={copy.relatedSectionSubheadline ?? "Discover other founders building in the Rellia network."}
      viewAllHref="/founders/alumni"
      viewAllLabel="View all alumni"
      gridClassName={`mt-8 md:mt-10 ${DIRECTORY_CARD_GRID_CLASS}`}
    >
      {related.map((company, index) => (
        <ScrollReveal key={company.id} delay={index * 0.05} className="h-full">
          <FounderDirectoryCard
            company={company}
            href={`/founders/alumni/${company.id}`}
          />
        </ScrollReveal>
      ))}
    </RelatedContentSection>
  )
}

export default RelatedAlumniCompanies
