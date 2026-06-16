import { useMemo } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import RelatedContentSection from "@/components/related/RelatedContentSection"
import { CareersOpenRoleCard } from "@/components/careers/CareersOpenRoleCard"
import type { CareersOpenRole } from "@shared/cms/types"
import { cmsDisplayText } from "@/lib/cmsStega"

const RELATED_ROLE_LIMIT = 2

type RelatedOpenRolesProps = {
  roles: CareersOpenRole[]
  currentRoleId: string
}

const RelatedOpenRoles = ({ roles, currentRoleId }: RelatedOpenRolesProps) => {
  const related = useMemo(
    () => roles.filter((role) => role.id !== currentRoleId).slice(0, RELATED_ROLE_LIMIT),
    [roles, currentRoleId],
  )

  if (related.length === 0) return null

  return (
    <RelatedContentSection
      headingId="related-open-roles-heading"
      title="More open roles"
      subheadline="Explore other opportunities on the Rellia team."
      viewAllHref="/careers#open-roles"
      viewAllLabel="View all roles"
      gridClassName="mt-10 grid w-full max-w-[1100px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6"
    >
      {related.map((role, index) => (
        <ScrollReveal key={role.id} delay={index * 0.05}>
          <CareersOpenRoleCard role={role} formatText={cmsDisplayText} />
        </ScrollReveal>
      ))}
    </RelatedContentSection>
  )
}

export default RelatedOpenRoles
