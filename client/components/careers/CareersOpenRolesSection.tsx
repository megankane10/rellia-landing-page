import type { CareersOpenRole } from "@shared/cms/types"
import type { SanityPortableText } from "@shared/cms/types"
import ScrollReveal from "@/components/ScrollReveal"
import { SectionHeadlinePortable } from "@/components/cms/SectionHeadlinePortable"
import { CareersOpenRolesList } from "@/components/careers/CareersOpenRolesList"
import { CmsOpenRolesListSkeleton } from "@/components/cms/CmsPageSkeletons"
import { HEADING_SECTION, HEADING_SECTION_SUBTITLE } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { cmsDisplayText } from "@/lib/cmsStega"

export type CareersOpenRolesSectionProps = {
  titlePortable: SanityPortableText | string | null | undefined
  subtitle?: string
  roles: CareersOpenRole[]
  formatText?: (value: string) => string
  rolesLoading?: boolean
}

export const CareersOpenRolesSection = ({
  titlePortable,
  subtitle,
  roles,
  formatText,
  rolesLoading = false,
}: CareersOpenRolesSectionProps) => (
  <section id="open-roles" className="scroll-mt-28 bg-white py-16 md:py-24 lg:py-28">
    <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10">
      <ScrollReveal className="flex min-w-0 flex-col">
        <div className="max-w-2xl">
          <SectionHeadlinePortable
            value={titlePortable}
            className={cn("font-host-grotesk font-semibold tracking-tight text-black", HEADING_SECTION)}
          />
          {subtitle ? (
            <p className={cn("mt-3 font-urbanist leading-relaxed text-black/55", HEADING_SECTION_SUBTITLE)}>
              {formatText ? formatText(subtitle) : subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-10 w-full">
          {rolesLoading ? (
            <CmsOpenRolesListSkeleton />
          ) : (
            <CareersOpenRolesList roles={roles} formatText={formatText} />
          )}
        </div>
      </ScrollReveal>
    </div>
  </section>
)
